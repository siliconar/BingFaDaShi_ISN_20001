import copy

from gamestate4 import *
from UndirectedGraph import *

import random



class GameAI:
    """
    实现游戏AI的深度优先搜索（DFS）算法，结合状态剪枝
    大概原理是这样
    1. 当前某个局面需要判定，启动AI之前，首先我们得把所有的已放连接全部断开
    2. 进行DFS时，首先生成1步可能性（1步是指，只添加一条连接线）
    3. 真正生成下一步可能性时，遍历所有已方节点，再遍历每个节点的1步。
    """

    def __init__(self, camp):
        self.visited_states = []  # 存储已经访问过的状态（标准化状态）
        self.camp = camp
        self.best_score = -999
        self.best_state = []
        global global_access_graph
    def dfs(self, current_state, depth):
        """
        深度优先搜索（DFS），支持状态剪枝。
        current_state: GameStateX
        depth: int
        """
        # 先检查当前状态是否已经访问过
        if any(state.connection_manager == current_state.connection_manager for state in self.visited_states):
            return None  # 如果已经访问过，剪枝

        # 标记当前状态已访问
        self.visited_states.append(current_state)

        # 评估当前局面分数，如果比best记录大，记录下来
        newcurrent_state = copy.deepcopy(current_state)
        eval_score = newcurrent_state.calculate_score()


        if eval_score>self.best_score:
            self.best_score = eval_score
            self.best_state = current_state

        # 如果没深度了，就不继续往下拓展了
        if depth == 0:
            return current_state  # 返回当前状态

        # 获取当前状态的所有可能后续状态，注意只有1步
        possible_next_states = self.__get_possible_next_states(current_state)
        for next_state in possible_next_states:
            result = self.dfs(next_state, depth - 1)
            # if result:  # 如果找到了目标状态，则返回
            #     return result

        # 回溯时移除当前状态
        return None

    def __get_possible_next_states(self, current_state):
        """
        获取当前状态的所有可能的后续状态
        这个方法可以根据游戏规则进行调整
        """
        possible_states = []   # 用于保存所有的状态
        for node in current_state.nodes.values():  # 获取所有的节点node

            # 本质原理是，切换所有的己方节点
            # 以这个己方节点为树根，搜索其他能连接的塔
            # 然后走出一步。

            # -- 判断是不是己方节点
            if node.camp != self.camp:
                continue
            # -- 判断这个节点还能不能增加连接了,如果节点level不够，那么跳过
            if len(current_state.connection_manager.get_connections(node.node_id)) >= node.level:
                print("跳出")
                continue
            # -- 取得这个节点能够输出的节点
            access_nodeID_vec = global_access_graph.get_neighbors(node.node_id)  # 注意这个得从无向图获取
            # -- 生成所有可能情况
            for i_targetID in access_nodeID_vec:  # 指定目标塔
                """
                生成当前状态的一个新状态，模拟一个行动（如连接/断开节点）
                """
                new_nodes = [Node(node.node_id, node.camp, node.hp, node.pos) for node in current_state.nodes.values()]
                new_conn = current_state.connection_manager.deep_copy()  #连接的深拷贝
                # 现在开始添加线
                new_conn.add_connection(node.node_id, i_targetID)
                # 判断要不要删除反向连接，如果时同一阵营，那么就要删除
                if current_state.nodes[i_targetID].camp == node.camp:
                    new_conn.remove_connection(i_targetID, node.node_id)  # 如果是同阵营，那么就要删除反向连接。不管有没有，先删为敬

                new_state = GameStateX(new_nodes,new_conn)
                possible_states.append(new_state)


        return possible_states



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
    global_access_graph.add_edge(1, 4)
    global_access_graph.add_edge(1, 6)
    global_access_graph.add_edge(1, 2)
    global_access_graph.add_edge(4, 6)
    global_access_graph.add_edge(4, 2)
    global_access_graph.add_edge(2, 3)
    global_access_graph.add_edge(2, 5)
    global_access_graph.add_edge(3, 5)




    #------ 创建节点
    node1 = Node(1, 'computer', initial_hp=1, pos=(100, 100))
    node2 = Node(2, 'neutral', initial_hp=18, pos=(500, 100))
    node3 = Node(3, 'neutral', initial_hp=20, pos=(300, 200))
    node4 = Node(4, 'neutral', initial_hp=10, pos=(100, 300))
    node5 = Node(5, 'player', initial_hp=10, pos=(500, 300))
    node6 = Node(6, 'neutral', initial_hp=10, pos=(300, 350))
    node_list = [node1, node2, node3, node4, node5, node6]

    # 设置节点之间的连接
    conn = ConnectionManager()
    # conn.add_connection(1,2)
    # conn.add_connection(2, 1)
    # conn.add_connection(4, 1)
    # conn.add_connection(5, 6)



    #--- 创建AI并进行深度优先搜索
    ai_camp2 = "computer"
    ai2 = GameAI(ai_camp2)
    # 注意第一次要清除所有的己方连接，否则ai不具有删除连接功能，这个连接会一直存在。
    conn2 = conn.deep_copy()
    for sourceID, targets in conn.connections.items():
        if node_list[sourceID-1].camp != ai_camp2:  # 不是自己的节点，删除不了人家的连接
            continue
        # 是自己的节点，那就把所有的连接删除
        conn2.remove_node_all_connections(sourceID)


    # 创建一个游戏状态
    # game_state = GameStateX(node_list,conn2)
    game_state = GameStateX(node_list, conn)
    result = ai2.dfs(game_state, depth=3)

    # 输出搜索结果
    print(ai2.best_score)
    a=1


