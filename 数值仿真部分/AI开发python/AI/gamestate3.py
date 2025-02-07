
from UndirectedGraph import UndirectedGraph


class Node:
    """
    表示地图上的一个节点（塔）。
    """
    def __init__(self, node_id, camp, initial_hp=0, pos=(0, 0)):
        self.node_id = node_id
        self.camp = camp
        self.hp = initial_hp
        self.connections = []  # 存放指向其他 Node 实例的【有向】输出连接
        self.production_interval = 1.5  # 非中立节点每 1.5 秒生产 1 个士兵
        self.time_accumulator = 0.0  # 累计时间，用于判断是否生产士兵
        self.pos = pos  # 用于UI显示的位置

    def add_connection(self, target_node):
        """添加一条指向目标节点的输出连接"""
        self.connections.append(target_node)

    def remove_connection(self, target_node):
        """删除与目标节点的连接"""
        if target_node in self.connections:
            self.connections.remove(target_node)

    def __repr__(self):
        return f"Node({self.node_id}, camp='{self.camp}', hp={self.hp})"


class GameStateX:
    """
    表示游戏的状态，包括节点血量、连接状态等。
    """

    def __init__(self, nodes):
        """
        初始化游戏状态
        :param nodes: 传入节点列表，初始化节点及其连接关系
        """
        self.nodes = {node.node_id: node for node in nodes}  # 存储节点信息
        # self.connections = self.__get_sorted_connections()  # 获取标准化后的连接列表

    def __get_sorted_connections(self):
        """
        获取并返回标准化后的连接列表：连接按节点ID排序
        """
        connections = []
        for node in self.nodes.values():
            for target in node.connections:
                connections.append(tuple(sorted([node.node_id, target.node_id])))
        # 对连接进行排序，确保连接顺序不影响状态的等效性
        return sorted(connections)

    def normalize_state(self):
        """
        标准化当前游戏状态：排序节点和连接，确保状态一致性。
        返回标准化后的节点和连接。
        """
        # sorted_nodes = sorted(self.nodes.values(), key=lambda x: x.node_id)  # 按节点ID排序
        # normalized_connections = self.__get_sorted_connections()
        # # 返回节点血量和连接信息，作为比较的标准
        # return [(node.node_id, node.hp, sorted([conn[0], conn[1]])) for node in sorted_nodes], normalized_connections

        sorted_nodes = sorted(self.nodes.values(), key=lambda x: x.node_id)  # 按节点ID排序
        normalized_nodes = [(node.node_id, node.hp) for node in sorted_nodes]
        # 正确的写法是直接使用 get_sorted_connections() 的结果
        normalized_connections = self.__get_sorted_connections()
        return normalized_nodes, normalized_connections

    def simulate_time(self, n: float):
        """
        快速推算 n 秒之后的状态，返回一个新的 GameStateX 对象。

        说明：
          1. 对于每个非中立节点，计算 n 秒内产生的士兵数：
                produced = int((time_accumulator + n) / production_interval)
             并更新 time_accumulator = (time_accumulator + n) % production_interval
          2. 如果节点没有输出连接，则直接累加到节点 hp 中；
             如果节点有输出连接，则模拟将所有士兵发送到第一个目标：
                - 如果目标和自身阵营相同，则目标 hp 增加 produced；
                - 如果不同，则目标 hp 扣除 produced；若扣除后目标 hp < 0，则更改目标的阵营。
        """
        # 先复制节点，确保不修改当前状态
        new_nodes = []
        for node in self.nodes.values():
            new_node = Node(node.node_id, node.camp, node.hp, node.pos)
            new_node.time_accumulator = node.time_accumulator
            new_nodes.append(new_node)

        # 构造节点ID到新节点的映射，便于复制连接关系
        new_nodes_dict = {node.node_id: node for node in new_nodes}

        # 复制连接关系
        for node in self.nodes.values():
            for target in node.connections:
                new_nodes_dict[node.node_id].add_connection(new_nodes_dict[target.node_id])

        # 模拟 n 秒的兵产出及转移
        for node in new_nodes:
            if node.camp == 'neutral':
                # 中立节点不生产士兵
                continue
            total_time = node.time_accumulator + n
            produced = int(total_time // node.production_interval)
            node.time_accumulator = total_time % node.production_interval

            if produced == 0:
                continue

            if not node.connections:
                # 没有输出连接，则士兵累加在本节点
                node.hp += produced
            else:
                # 有输出连接，模拟将士兵全部发送给第一个目标
                target = node.connections[0]
                if node.camp == target.camp:
                    # 同阵营，目标节点加兵
                    target.hp += produced
                else:
                    # 不同阵营，目标节点受攻，扣血
                    target.hp -= produced
                    # 若目标血量下降到 -1 或更低，则转换阵营（此处简单实现为：血量低于0则转换，并重置 hp 至 0）
                    if target.hp < 0:
                        target.camp = node.camp
                        target.hp = 0

        # 返回新的游戏状态
        return GameStateX(new_nodes)

    def __eq__(self, other):
        """
        比较两个状态是否相等，首先比较标准化后的节点和连接
        """
        self_normalized, self_connections = self.normalize_state()
        other_normalized, other_connections = other.normalize_state()
        return self_normalized == other_normalized and self_connections == other_connections

    def __repr__(self):
        return f"GameStateX(nodes={self.nodes})"


class GameAI:
    """
    实现游戏AI的深度优先搜索（DFS）算法，结合状态剪枝
    """

    def __init__(self, camp):
        self.visited_states = []  # 存储已经访问过的状态（标准化状态）
        self.path = []  # 存储当前搜索路径
        self.camp= "computer"
        global global_access_graph
    def dfs(self, current_state, depth):
        """
        深度优先搜索（DFS），支持状态剪枝。
        """
        if depth == 0:
            return current_state  # 返回当前状态

        # 先检查当前状态是否已经访问过
        if any(state == current_state for state in self.visited_states):
            return None  # 如果已经访问过，剪枝

        # 标记当前状态已访问
        self.visited_states.append(current_state)
        self.path.append(current_state)

        # 获取当前状态的所有可能后续状态
        possible_next_states = self.__get_possible_next_states(current_state)
        for next_state in possible_next_states:
            result = self.dfs(next_state, depth - 1)
            if result:  # 如果找到了目标状态，则返回
                return result

        # 回溯时移除当前状态
        self.path.pop()
        return None

    def __get_possible_next_states(self, current_state):
        """
        获取当前状态的所有可能的后续状态
        这个方法可以根据游戏规则进行调整
        """
        possible_states = []
        for node in current_state.nodes.values():  # 获取所有的节点node
            # 例如，可以通过调整连接关系模拟不同的状态 未完成

            # 本质原理是，切换所有的己方节点，然后走出一步。

            # -- 判断是不是己方节点
            if node.camp != self.camp:
                continue
            # -- 取得这个节点能够输出的节点
            access_nodeID_vec = global_access_graph.get_neighbors(node.node_id)
            # -- 生成所有可能情况
            for i_targetID in access_nodeID_vec:
                """
                生成当前状态的一个新状态，模拟一个行动（如连接/断开节点）
                """
                new_nodes = [Node(node.node_id, node.camp, node.hp, node.pos) for node in current_state.nodes.values()]
                未完成
                new_state = GameStateX(new_nodes)

            next_state = self.__generate_next_state(current_state)
            possible_states.append(next_state)


        return possible_states

    def __generate_next_state(self, current_state):
        """
        生成当前状态的一个新状态，模拟一个行动（如连接/断开节点）
        """
        new_nodes = [Node(node.node_id, node.camp, node.hp, node.pos) for node in current_state.nodes.values()]
        new_state = GameStateX(new_nodes)
        return new_state


# -------------------------------
# 示例：初始化游戏状态并执行 DFS
# -------------------------------

if __name__ == "__main__":


    #---- 创建可连接图
    global_access_graph = UndirectedGraph()
    # 添加节点（可选，因为在添加边时不存在的节点会自动添加）
    global_access_graph.add_node(1)
    global_access_graph.add_node(2)
    global_access_graph.add_node(3)
    global_access_graph.add_node(4)
    global_access_graph.add_node(5)
    global_access_graph.add_node(6)
    # 添加边：1-2, 1-3
    global_access_graph.add_edge(1, 2)
    global_access_graph.add_edge(1, 3)
    global_access_graph.add_edge(2, 3)
    global_access_graph.add_edge(4, 2)
    global_access_graph.add_edge(4, 5)
    global_access_graph.add_edge(4, 6)
    global_access_graph.add_edge(5, 6)


    #------ 创建节点
    node1 = Node(1, 'computer', initial_hp=10, pos=(100, 100))
    node2 = Node(2, 'player', initial_hp=10, pos=(500, 100))
    node3 = Node(3, 'neutral', initial_hp=10, pos=(300, 200))
    node4 = Node(4, 'computer', initial_hp=10, pos=(100, 300))
    node5 = Node(5, 'player', initial_hp=10, pos=(500, 300))
    node6 = Node(6, 'neutral', initial_hp=10, pos=(300, 350))

    # 设置节点之间的连接
    node1.add_connection(node3)
    node2.add_connection(node3)
    node4.add_connection(node6)
    node5.add_connection(node6)

    # 创建一个游戏状态
    game_state = GameStateX([node1, node2, node3, node4, node5, node6])

    # 创建AI并进行深度优先搜索
    ai = GameAI("computer")
    result = ai.dfs(game_state, depth=3)

    # 输出搜索结果
    if result:
        print("找到目标状态:", result)
    else:
        print("未找到目标状态。")









    ## 下面代码验证了
    ## 只有id，血量，连接，影响是否相等，其他例如阵营，pos，不影响
    # node11 = Node(1, 'computer', initial_hp=10, pos=(100, 100))
    # node12 = Node(2, 'player', initial_hp=10, pos=(500, 100))
    # node13 = Node(3, 'neutral', initial_hp=10, pos=(300, 200))
    # node11.add_connection(node13)
    # node12.add_connection(node13)
    # game_state1 = GameStateX([node11, node12, node13])
    #
    # node21 = Node(1, 'computer', initial_hp=10, pos=(100, 100))
    # node22 = Node(2, 'player', initial_hp=10, pos=(500, 100))
    # node23 = Node(3, 'neutral', initial_hp=10, pos=(300, 200))
    # node22.add_connection(node23)
    # node21.add_connection(node23)
    #
    # game_state2 = GameStateX([node21, node22, node23])
    #
    # if game_state1 == game_state2:
    #     print("相等")
    # else:
    #     print("不相等")