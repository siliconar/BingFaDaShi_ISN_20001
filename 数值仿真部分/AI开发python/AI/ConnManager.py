
import copy
class ConnectionManager:
    """
    维护所有节点之间的有向连接信息。
    """
    def __init__(self):
        self.connections = {}

    # 请注意，使用的source和target都是ID
    def add_connection(self, source, target):
        if source not in self.connections:
            self.connections[source] = set()
        self.connections[source].add(target)

    def remove_connection(self, source, target):
        if source in self.connections and target in self.connections[source]:
            self.connections[source].remove(target)

    def remove_node_all_connections(self, source):
        """删除某个节点发出的所有连接"""
        if source in self.connections:
            del self.connections[source]

    def get_connections(self, node_id):
        return self.connections.get(node_id, set())

    def connection_exists(self, source, target):
        """判断某个连接是否存在"""
        return target in self.connections.get(source, set())

    def __eq__(self, other):
        """判断两个 ConnectionManager 是否相等"""
        if not isinstance(other, ConnectionManager):
            return False
        return self.connections == other.connections

    def __repr__(self):
        return f"ConnectionManager({self.connections})"


    def deep_copy(self):
        """创建一个 ConnectionManager 的深拷贝"""
        new_copy = ConnectionManager()
        new_copy.connections = copy.deepcopy(self.connections)
        return new_copy

# 示例使用
# if __name__ == "__main__":
#
#
#     g1 = ConnectionManager()
#     g1.add_connection(1,2)
#     g1.add_connection(1,3)
#     g1.add_connection(3, 2)
#
#
#
#     g2 = ConnectionManager()
#     g2.add_connection(3, 2)
#     g2.add_connection(1, 3)
#     g2.add_connection(1,2)   #调换顺序，依旧相等
#
#
#     # g2.remove_connection(3,2)
#
#     if g1==g2:
#         print("相等")
#     else:
#         print("不相等")


# # 深拷贝测试
# if __name__ == "__main__":
#
#     g1 = ConnectionManager()
#     g1.add_connection(1,2)
#     g1.add_connection(1,3)
#     g1.add_connection(3, 2)
#
#     # # 浅拷贝
#     # g2 = g1
#     # g2.remove_connection(3,2)
#     #
#     # if g1==g2:
#     #     print("相等")
#     # else:
#     #     print("不相等")
#
#     # 深拷贝,应当输出不相等
#     g3 = g1.deep_copy()
#     g3.remove_connection(3,2)
#
#     if g1==g3:
#         print("相等")
#     else:
#         print("不相等")


# # 重复添加测试
# if __name__ == "__main__":
#
#     g1 = ConnectionManager()
#     g1.add_connection(1,2)
#     g1.add_connection(1,2)
#     g1.add_connection(1, 3)
#
#     print(g1.get_connections(1))

# 打印所有连接
# if __name__ == "__main__":
#
#     g1 = ConnectionManager()
#     g1.add_connection(1,2)
#     g1.add_connection(1,2)
#     g1.add_connection(1, 3)
#
#     for source, targets in g1.connections.items():
#         for target in targets:
#             print(f"{source} -> {target}")