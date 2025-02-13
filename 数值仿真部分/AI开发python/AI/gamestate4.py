import math

from ConnManager import ConnectionManager

class Node:
    """
    表示地图上的一个节点（塔）。
    """

    def __init__(self, node_id, camp, initial_hp=0, pos=(0, 0)):
        self.node_id = node_id
        self.camp = camp
        self.hp = initial_hp
        self.flow_soldier = 0  # 能流动的兵力，这个只用于推演时使用
        self.enemy_soldier =0  # 敌方攻击的士兵数，因为没有即使扣减，先存这里，这个只用于推演时使用
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

    def calculate_score(self):

        new_nodes = {node_id: Node(node.node_id, node.camp, node.hp, node.pos)
                     for node_id, node in self.nodes.items()}  # 复制节点

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
        # 打分 = 100*15秒增兵量 + 10*30秒增兵量 + 90秒总兵量
        # 绕圈怎么办？绕圈兵直接抛弃。游戏内未完成，需要防止绕圈。

        step_tm=3
        start_tm=0
        # 先推演到15秒
        while start_tm<15:

        # 计算15秒时增兵量


    def simulate_time(self,n, step_tm, new_nodes):
        """
        快速推算 n 秒之后的状态，直接修改new_nodes状态，原来的也会修改
        """
        # 先给增上兵
        for i_node in new_nodes.values():

            # 新增兵力
            newcnt = 0  # 当前新增数量
            if i_node.camp != 'neutral':
                add_level = math.floor( n/15 )  # 判断能升几级，15秒升一级
                if i_node.level+add_level>3:
                    add_level = (3 if i_node.level+add_level>3 else i_node.level+add_level)  - i_node.level # 防止超过3级



        # cur_time = 0
        # while cur_time < n:
        #     cur_time = cur_time + step_tm  # 时间累加
        #     # 所有兵的水位（可流动数量）清零
        #     for i_node in new_nodes.values():
        #         i_node.flow_soldier = 0  # 可流动数量清零
        #
        #     for i_node in new_nodes.values():
        #         # 新增兵力
        #         newcnt = i_node.level * step_tm / i_node.production_interval  # 当前新增数量
        #         # 连接派兵
        #         node_conn = self.connection_manager.get_connections(i_node.node_id)  # 取出连接
        #         for i_targetID in node_conn:  # 遍历所有连接，派兵
        #             if newcnt<=0:
        #                 break
        #             newcnt-=1  # 当前新增数量
        #             new_nodes[i_targetID].flow_soldier += 1  # 可流动数量



        def __quick_calculate_ntime_cnt(rawnumber,n:float):

        return GameStateX(list(new_nodes.values()), new_connection_manager)



