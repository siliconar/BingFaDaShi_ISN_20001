import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TowerGraph')
export class TowerGraph {
    private adjacencyList: Map<string, Set<string>>; // 连接关系
    private isDirected: boolean; // 是否是单向图

    constructor(isDirected: boolean = false) {
        this.adjacencyList = new Map();
        this.isDirected = isDirected; // 根据参数决定图的类型
    }

    // 添加塔
    addTower(tower: string): void {
        if (!this.adjacencyList.has(tower)) {
            this.adjacencyList.set(tower, new Set());
        }
    }

    // 添加连接关系
    addConnection(tower1: string, tower2: string): void {
        this.addTower(tower1);
        this.addTower(tower2);

        this.adjacencyList.get(tower1)?.add(tower2);

        // 如果是无向图，添加双向连接
        if (!this.isDirected) {
            this.adjacencyList.get(tower2)?.add(tower1);
        }
    }

    // 获取某个塔的连接关系
    getConnections(tower: string): string[] | undefined {
        return this.adjacencyList.has(tower)
            ? Array.from(this.adjacencyList.get(tower)!)
            : undefined;
    }

    // 删除一个塔
    removeTower(tower: string): void {
        if (this.adjacencyList.has(tower)) {
            // 对于无向图或单向图，删除所有以该塔为起点的连接
            this.adjacencyList.delete(tower);

            // 对于单向图或无向图，移除所有以该塔为目标的连接
            for (const [key, connections] of this.adjacencyList) {
                if (connections.has(tower)) {
                    connections.delete(tower);
                }
            }
        }
    }

    // 删除连接关系
    removeConnection(tower1: string, tower2: string): void {
        this.adjacencyList.get(tower1)?.delete(tower2);

        // 如果是无向图，删除双向连接
        if (!this.isDirected) {
            this.adjacencyList.get(tower2)?.delete(tower1);
        }
    }

    // 清空所有连接，包括塔信息
    clearAll(): void {
        this.adjacencyList.clear();
    }

    // 打印拓扑关系
    printGraph(): void {
        for (const [tower, connections] of this.adjacencyList) {
            const connectionList = Array.from(connections).join(", ");
            console.log(`${tower} is connected to: ${connectionList}`);
        }
    }
}

// 使用示例

// 创建单向图
// const directedGraph = new TowerGraph(true);
// directedGraph.addConnection("B", "A");
// directedGraph.addConnection("C", "A");
// directedGraph.addConnection("A", "D");
// directedGraph.addConnection("B", "D");
// directedGraph.printGraph();
// // 输出:
// // B is connected to: A
// // C is connected to: A
// // A is connected to: D
// console.log("===================")
// // 删除 A
// directedGraph.removeTower("A");
// directedGraph.printGraph();
// // 输出:
// // B is connected to:
// // C is connected to:
