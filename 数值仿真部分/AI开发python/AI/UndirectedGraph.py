class UndirectedGraph:
    def __init__(self):
        # 使用字典存储图，其中键是节点 id，值是与该节点相连的其他节点集合
        self.graph = {}

    def add_node(self, node_id):
        """添加节点，如果节点已经存在则不做任何操作。"""
        if node_id not in self.graph:
            self.graph[node_id] = set()

    def add_edge(self, node1, node2):
        """
        添加无向边，即在 node1 与 node2 之间建立连接。
        若节点不存在，会自动先添加节点。
        """
        # 确保两个节点都在图中
        if node1 not in self.graph:
            self.add_node(node1)
        if node2 not in self.graph:
            self.add_node(node2)
        # 由于是无向图，添加双向连接
        self.graph[node1].add(node2)
        self.graph[node2].add(node1)

    def get_neighbors(self, node_id):
        """
        返回与给定节点 node_id 相连的所有节点 id。
        如果节点不存在，则返回空集合。
        """
        return self.graph.get(node_id, set())


# # 示例使用
# if __name__ == "__main__":
#     g = UndirectedGraph()
#     # 添加节点（可选，因为在添加边时不存在的节点会自动添加）
#     g.add_node(1)
#     g.add_node(2)
#     g.add_node(3)
#
#     # 添加边：1-2, 1-3
#     g.add_edge(1, 2)
#     g.add_edge(1, 3)
#
#     # 输出与节点 1 相连的节点
#     neighbors = g.get_neighbors(1)
#     print("与节点 1 相连的节点:", neighbors)
