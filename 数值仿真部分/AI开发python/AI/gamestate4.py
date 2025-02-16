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
        # self.enemy_soldier =0  # 敌方攻击的士兵数，因为没有即使扣减，先存这里，这个只用于推演时使用
        self.updatelevelfromHP()  # 更新level
        self.production_interval = 1  # 非中立节点每 1.5 秒生产 1 个士兵
        self.time_accumulator = 0.0  # 用于判断是否生产士兵
        self.pos = pos  # UI 显示位置

    def __repr__(self):
        return f"Node({self.node_id}, camp='{self.camp}', hp={self.hp})"

    def updatelevelfromHP(self):
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
        # 打分 = 100*15秒增兵量 + 10*45秒增兵量 + 90秒总兵量
        # 绕圈怎么办？绕圈兵直接抛弃。游戏内未完成，需要防止绕圈。

        step_tm=3
        start_tm=0
        # 先推演到15秒
        self.simulate_time(15,1,new_nodes)

        # 计算15秒时得分
        score15 = 0
        for i_node in new_nodes.values():
            # 如果是自己的节点
            # 计算15秒时的增兵量
            if i_node.camp == 'computer':
                score15 += i_node.level

        # 再推演到45秒
        self.simulate_time(15, 1, new_nodes)
        # 计算45秒时得分
        score45 = 0
        for i_node in new_nodes.values():
            # 如果是自己的节点
            # 计算15秒时的增兵量
            if i_node.camp == 'computer':
                score45 += i_node.level

        # 再推演到90秒
        self.simulate_time(15, 1, new_nodes)
        # 计算90秒时得分
        score90 = 0
        for i_node in new_nodes.values():
            # 如果是自己的节点
            # 计算15秒时的增兵量
            if i_node.camp == 'computer':
                score90 += i_node.hp


        print(self.connection_manager)
        print(str(score15) + ":" + str(score45) + ":" + str(score90) + ":" + str(100*score15 + 10*score45 + score90))
        # 返回
        return 100*score15 + 10*score45 + score90


    def simulate_time(self,n, step_tm, new_nodes):
        """
        快速推算 n 秒之后的状态，直接修改new_nodes状态，原来的也会修改
        """
        cur_time = 0
        while cur_time < n:
            cur_time = cur_time + step_tm  # 时间累加
            # 所有兵的水位（可流动数量）清零
            for i_node in new_nodes.values():
                i_node.flow_soldier = 0  # 可流动数量清零，游戏内绕圈的兵也会被清零

            # 增兵，派兵
            for i_node in new_nodes.values():

                # 中立的不增兵，不派兵
                if i_node.camp == 'neutral':
                    continue;

                # 新增兵力
                newcnt = i_node.level * step_tm / 1  # 当前新增数量
                # 连接派兵
                node_conn = self.connection_manager.get_connections(i_node.node_id)  # 取出连接
                for i_targetID in node_conn:  # 遍历所有连接，派兵
                    if newcnt<=0:
                        break
                    newcnt-=1  # 当前新增数量
                    if new_nodes[i_targetID].camp == 'computer': # 如果是自己人
                        new_nodes[i_targetID].flow_soldier += 1  # 可流动数量
                    else: # 如果是敌人
                        new_nodes[i_targetID].hp -= 1  # 可流动数量

                # 自身的flow兵，全派出去
                len_conn = len(node_conn)  # 连接的数量
                if len_conn!=0:  # 如果有连接
                    for i_targetID in node_conn:  # 遍历所有连接，派兵
                        if new_nodes[i_targetID].camp == 'computer':  # 如果是自己人
                            new_nodes[i_targetID].flow_soldier += i_node.flow_soldier / len_conn  # 可流动数量
                        else:  # 如果是敌人
                            new_nodes[i_targetID].hp -= i_node.flow_soldier / len_conn  # 可流动数量
                            if new_nodes[i_targetID].hp<0: # 如果对方塔直接被打负值了，那就改阵营
                                new_nodes[i_targetID].hp = math.fabs(new_nodes[i_targetID].hp)
                                new_nodes[i_targetID].camp = i_node.camp
                                new_nodes[i_targetID].updatelevelfromHP()
                    i_node.flow_soldier = 0 # 兵全派出去了，清零
                else:  # 如果没有连接，flow兵全部进塔
                    newcnt += i_node.flow_soldier;

                # 剩余的屯兵
                i_node.hp += newcnt
                i_node.hp = 90 if i_node.hp>90 else i_node.hp
                i_node.updatelevelfromHP()

                # if i_node.camp == 'computer':
                #     a=1





