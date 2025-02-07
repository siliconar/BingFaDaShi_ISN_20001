import time
import copy


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
        self.time_accumulator = 0.0  # 累计时间用来判断是否生产士兵
        self.pos = pos  # 用于UI显示的位置

    def add_connection(self, target_node):
        """添加一条指向目标节点的输出连接"""
        self.connections.append(target_node)

    def remove_connection(self, target_node):
        """删除与目标节点的连接"""
        if target_node in self.connections:
            self.connections.remove(target_node)

    def update_production(self, dt):
        """
        根据经过的时间 dt 计算新产生的士兵数量。
        注意：中立节点不生产士兵。
        """
        if self.camp == 'neutral':
            return 0
        self.time_accumulator += dt
        produced = 0
        while self.time_accumulator >= self.production_interval:
            produced += 1
            self.time_accumulator -= self.production_interval
        return produced

    def update(self, dt):
        """
        更新节点状态：
          1. 计算并生产新士兵；
          2. 如果该节点没有输出连接，则把新士兵屯兵（累加到 hp）。
        """
        new_soldiers = self.update_production(dt)
        if not self.connections:
            self.hp += new_soldiers
        else:
            # 如果有输出连接，可根据后续决策模块决定如何分配新产生的士兵
            pass

    def __repr__(self):
        return f"Node({self.node_id}, camp='{self.camp}', hp={self.hp})"


class GameState:
    """
    管理所有节点的状态，并提供更新和查询接口。
    """

    def __init__(self):
        self.nodes = {}  # 以 node_id 为键存储 Node 实例

    def add_node(self, node):
        """将节点添加到游戏状态中"""
        self.nodes[node.node_id] = node

    def connect_nodes(self, from_node_id, to_node_id):
        """
        建立从 from_node_id 到 to_node_id 的有向连接。
        """
        if from_node_id in self.nodes and to_node_id in self.nodes:
            from_node = self.nodes[from_node_id]
            to_node = self.nodes[to_node_id]
            if from_node.camp == to_node.camp:
                if from_node in to_node.connections:
                    to_node.remove_connection(from_node)
                    from_node.add_connection(to_node)
                    return
            if to_node not in from_node.connections:
                from_node.add_connection(to_node)
        else:
            print(f"连接失败：节点 {from_node_id} 或 {to_node_id} 不存在。")

    def update(self, dt):
        """更新所有节点状态（例如生产士兵）"""
        for node in self.nodes.values():
            node.update(dt)

    def get_state(self):
        """
        获取当前所有节点的状态信息，返回字典格式：
        {node_id: {'camp': 阵营, 'hp': 士兵数, 'pos': (x, y), 'connections': [目标节点ID列表]}}
        """
        state_info = {}
        for node_id, node in self.nodes.items():
            state_info[node_id] = {
                'camp': node.camp,
                'hp': node.hp,
                'pos': node.pos,
                'connections': [n.node_id for n in node.connections]
            }
        return state_info

    def copy(self):
        """
        以增量的方式复制游戏状态，返回一个新的 GameState 实例。
        这个方法不会复制整个节点对象，而是复制节点的必要状态。
        """
        new_game_state = GameState()
        for node in self.nodes.values():
            new_node = Node(node.node_id, node.camp, node.hp, node.pos)
            new_game_state.add_node(new_node)
        # 复制节点的连接关系
        for node in self.nodes.values():
            for target in node.connections:
                new_game_state.connect_nodes(node.node_id, target.node_id)
        return new_game_state


# -------------------------------
# 深度优先搜索 AI
# -------------------------------

class AI:
    def __init__(self, game_state):
        self.game_state = game_state

    def dfs(self, current_state, depth):
        """
        进行深度优先搜索（DFS），每次搜索时只更新局部状态，避免复制整个游戏状态。
        """
        if depth == 0:
            return current_state.get_state()  # 返回当前状态

        # 模拟所有可能的行动并进行深度优先搜索
        possible_next_states = self.get_possible_next_states(current_state)
        for next_state in possible_next_states:
            result = self.dfs(next_state, depth - 1)
            if result:  # 如果找到了目标状态，则返回
                return result
        return None

    def get_possible_next_states(self, current_state):
        """获取所有可能的后续状态"""
        possible_states = []
        for node in current_state.nodes.values():
            # 这里的逻辑可以根据需要进行调整，模拟每个节点的可能动作
            next_state = current_state.copy()
            # 例如，你可以模拟节点的士兵攻击、转移等行为
            possible_states.append(next_state)
        return possible_states


# -------------------------------
# 示例：初始化游戏状态并执行 DFS
# -------------------------------

if __name__ == "__main__":
    game_state = GameState()

    # 创建节点
    node1 = Node(1, 'computer', initial_hp=10, pos=(100, 100))
    node2 = Node(2, 'player', initial_hp=10, pos=(500, 100))
    node3 = Node(3, 'neutral', initial_hp=10, pos=(300, 200))

    # 添加节点到游戏状态
    for node in [node1, node2, node3]:
        game_state.add_node(node)

    # 建立连接示例
    game_state.connect_nodes(1, 3)  # computer 发起进攻 neutral
    game_state.connect_nodes(2, 3)  # player 发起进攻 neutral

    # 运行 AI 的深度优先搜索
    ai = AI(game_state)
    initial_state = game_state
    result = ai.dfs(initial_state, depth=3)  # 假设搜索深度为 3

    print(result)
