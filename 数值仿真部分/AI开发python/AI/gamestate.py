import tkinter as tk
import time


# -------------------------------
# 游戏状态管理模块
# -------------------------------

class Node:
    """
    表示地图上的一个节点（塔）。

    参数：
      - node_id: 节点的唯一标识符
      - camp: 阵营，可取值 'neutral', 'computer', 'player'
      - initial_hp: 初始士兵数量（血量）
      - pos: 节点在 UI 画布上的坐标，格式为 (x, y)
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
        else:
            print(f"连接 {self.node_id} → {target_node.node_id} 不存在。")

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
             如果存在输出连接，则兵力转移的逻辑由决策模块处理（此处暂不处理）。
        """
        new_soldiers = self.update_production(dt)
        if not self.connections:
            self.hp += new_soldiers
        else:
            # 若有输出连接，可根据后续决策模块决定如何分配新产生的士兵
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

        规则说明：
          - 如果节点 A 和节点 B 不属于同一阵营，则允许 A→B 与 B→A 同时存在；
          - 如果节点 A 和节点 B 属于同一阵营，则只允许存在 A→B 或 B→A 的单向连接，
            即如果已有 B→A 存在，则不允许再添加 A→B，反之亦然。
        """
        if from_node_id in self.nodes and to_node_id in self.nodes:
            from_node = self.nodes[from_node_id]
            to_node = self.nodes[to_node_id]
            # 对于同阵营节点，判断是否已有相反方向的连接存在
            if from_node.camp == to_node.camp:
                if from_node in to_node.connections:
                    # print(f"无法添加连接 {from_node_id} → {to_node_id}：同阵营下已存在 {to_node_id} → {from_node_id}。")
                    print(f"同阵营下已存在 {to_node_id} → {from_node_id}。该连接删除")
                    to_node.remove_connection(from_node)  #删除老的连接
                    from_node.add_connection(to_node)   # 添加新的连接
                    return
            # 如果连接尚不存在，则添加
            if to_node not in from_node.connections:
                from_node.add_connection(to_node)
            else:
                print(f"连接 {from_node_id} → {to_node_id} 已存在。")
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


# -------------------------------
# UI 模块（使用 Tkinter 实现实时显示）
# -------------------------------

class GameUI:
    def __init__(self, game_state):
        self.game_state = game_state
        self.root = tk.Tk()
        self.root.title("实时游戏状态显示")
        self.canvas_width = 600
        self.canvas_height = 400
        self.canvas = tk.Canvas(self.root, width=self.canvas_width, height=self.canvas_height, bg="white")
        self.canvas.pack()

        self.node_ui_items = {}  # 存储各节点对应的UI元素（圆形与文本）
        self.last_time = time.time()

        self.draw_static()  # 绘制静态部分：节点及连接（带箭头）
        self.update_loop()  # 启动定时更新

    def draw_static(self):
        """
        绘制节点间的连接线和节点（圆形与文字）。
        使用箭头来标识连接方向。
        """
        # 绘制节点：圆形和显示节点信息的文本
        for node in self.game_state.nodes.values():
            x, y = node.pos
            r = 20  # 节点半径
            circle = self.canvas.create_oval(x - r, y - r, x + r, y + r, fill=self.get_color(node.camp))
            text = self.canvas.create_text(x, y, text=f"{node.node_id}\n{node.camp}\nHP:{node.hp}", font=("Arial", 10))
            self.node_ui_items[node.node_id] = {"circle": circle, "text": text}

        # 先绘制连接线，确保连接线位于节点图形下方
        for node in self.game_state.nodes.values():
            for target in node.connections:
                x1, y1 = node.pos
                x2, y2 = target.pos
                # arrow=tk.LAST 表示在线的终点绘制箭头，指示连接方向
                self.canvas.create_line(x1, y1, x2, y2, fill="black", dash=(4, 2), arrow=tk.LAST)


    def get_color(self, camp):
        """根据阵营返回节点对应的颜色"""
        if camp == "computer":
            return "red"
        elif camp == "player":
            return "lightblue"
        elif camp == "neutral":
            return "gray"
        else:
            return "black"

    def update_ui(self):
        """
        根据最新的游戏状态更新UI显示：
          - 更新节点文本信息（ID、阵营和HP）；
          - 更新节点颜色（当阵营发生变化时）。
        """
        for node_id, items in self.node_ui_items.items():
            node = self.game_state.nodes[node_id]
            self.canvas.itemconfig(items["text"], text=f"{node.node_id}\n{node.camp}\nHP:{node.hp}")
            self.canvas.itemconfig(items["circle"], fill=self.get_color(node.camp))

    def update_loop(self):
        """
        定时更新循环：
          1. 计算自上次更新以来的时间 dt；
          2. 更新游戏状态；
          3. 更新 UI 显示；
          4. 通过 after 方法安排下一次更新（此处设置为 100 毫秒）。
        """
        current_time = time.time()
        dt = current_time - self.last_time
        self.last_time = current_time

        self.game_state.update(dt)
        self.update_ui()
        self.root.after(100, self.update_loop)

    def run(self):
        self.root.mainloop()


# -------------------------------
# 示例：初始化游戏状态、节点和 UI
# -------------------------------

if __name__ == "__main__":
    game_state = GameState()

    # 根据需要为节点指定在画布上的位置（x, y）
    node1 = Node(1, 'computer', initial_hp=10, pos=(100, 100))
    node2 = Node(2, 'player', initial_hp=10, pos=(500, 100))
    node3 = Node(3, 'neutral', initial_hp=10, pos=(300, 200))
    node4 = Node(4, 'computer', initial_hp=10, pos=(100, 300))
    node5 = Node(5, 'player', initial_hp=10, pos=(500, 300))
    node6 = Node(6, 'neutral', initial_hp=10, pos=(300, 350))

    # 添加节点到游戏状态
    for node in [node1, node2, node3, node4, node5, node6]:
        game_state.add_node(node)

    # 建立连接示例：
    # 不同阵营之间允许同时存在双向连接（如 node1 与 node3、node2 与 node3）
    game_state.connect_nodes(1, 3)  # computer 发起进攻 neutral
    game_state.connect_nodes(2, 3)  # player 发起进攻 neutral
    game_state.connect_nodes(4, 6)  # computer 发起进攻 neutral
    game_state.connect_nodes(5, 6)  # player 发起进攻 neutral

    # 同阵营连接示例：
    # 例如，node1 和 node4 都属于 computer 阵营，
    # 允许存在 1→4 或 4→1 中的一个，但不能同时存在。
    game_state.connect_nodes(1, 4)  # 添加 node1 → node4（成功）
    game_state.connect_nodes(4, 1)  # 尝试添加 node4 → node1（将被拒绝，因为已存在 1→4）

    ui = GameUI(game_state)
    ui.run()
