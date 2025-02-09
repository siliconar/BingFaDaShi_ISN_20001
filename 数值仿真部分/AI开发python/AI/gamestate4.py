
from ConnManager import ConnectionManager

class Node:
    """
    表示地图上的一个节点（塔）。
    """

    def __init__(self, node_id, camp, initial_hp=0, pos=(0, 0)):
        self.node_id = node_id
        self.camp = camp
        self.hp = initial_hp
        self.__updatelevelfromHP()  # 更新level
        self.production_interval = 1.5  # 非中立节点每 1.5 秒生产 1 个士兵
        self.time_accumulator = 0.0  # 用于判断是否生产士兵
        self.pos = pos  # UI 显示位置

    def __repr__(self):
        return f"Node({self.node_id}, camp='{self.camp}', hp={self.hp})"

    def __updatelevelfromHP(self):
        if self.hp<15:
            self.level = 1
        elif self.hp>=15 and self.hp<45:
            self.level = 2
        elif self.hp>=45:
            self.level =3



class GameStateX:
    """
    表示游戏的状态，包括节点血量、连接状态等。
    """

    def __init__(self, nodes, connection_manager):
        self.nodes = {node.node_id: node for node in nodes}  # 存储节点信息
        self.connection_manager = connection_manager  # 连接管理器

    def simulate_time(self):
        """
        快速推算 n 秒之后的状态，返回一个新的 GameStateX 对象。 未完成
        """
        new_nodes = {node_id: Node(node.node_id, node.camp, node.hp, node.pos)
                     for node_id, node in self.nodes.items()}  # 复制节点
        new_connection_manager = self.connection_manager.deep_copy()  # 深拷贝连接

        ##计算策略如下(暂时弃用)
        # 定升级时间为15s，于是我们计算15秒，跟n没关
        # 所有节点按照当前速率生产15秒，分为屯兵和泄水兵
        # 统计各阵营泄水兵总和。
        # 分阵营
        # 水循环在所有本阵营节点循环2轮
        # 记录攻击点与攻击量
        # 把总水量按照攻击点和攻击量比例，重新分配（防止2轮后还有剩余水）。
        # 然后真实的攻击对方塔，如果有负值，那么变阵营，取绝对值。
        # 两个阵营都算完后，打分。

        ## 计算策略2：
        # 步长设置3
        # 所有节点计算3*1.5秒产兵量，该屯兵屯兵，该发送发送。
        # 一直计算到有兵产出
        # 这个难点在于怎么打分啊

        total_time = 15;
        total_water = {"computer"}
        cnt_nodes = len(self.nodes) # 有多少个节点
        for i_nodeID in range(1,cnt_nodes+1):





        for node in new_nodes.values():
            if node.camp == 'neutral':
                continue
            total_time = node.time_accumulator + n
            produced = int(total_time // node.production_interval)
            node.time_accumulator = total_time % node.production_interval

            if produced == 0:
                continue

            connected_nodes = new_connection_manager.get_connections(node.node_id)
            if not connected_nodes:
                node.hp += produced
            else:
                target_id = list(connected_nodes)[0]
                target = new_nodes[target_id]
                if node.camp == target.camp:
                    target.hp += produced
                else:
                    target.hp -= produced
                    if target.hp < 0:
                        target.camp = node.camp
                        target.hp = 0

        return GameStateX(list(new_nodes.values()), new_connection_manager)



