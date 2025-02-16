import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

// 这个暂时没人用

export class ConnectionNode {
    name: string;
    x: number;
    y: number;

    constructor(name: string, x: number, y: number) {
        this.name = name;
        this.x = x;
        this.y = y;
    }
}


@ccclass('ConnectionInfo1')
// 定义图结构
export class ConnectionInfo1 {
    private adjacencyList: Map<string, Set<string>>; // 连接关系
    private nodes: Map<string, ConnectionNode>; // 节点信息
    private isDirected: boolean; // 是否是单向图

    constructor(isDirected: boolean = false) {
        this.adjacencyList = new Map();
        this.nodes = new Map();
        this.isDirected = isDirected;
    }

    // 添加塔
    addTower(tower: ConnectionNode): void {
        if (!this.adjacencyList.has(tower.name)) {
            this.adjacencyList.set(tower.name, new Set());
            this.nodes.set(tower.name, tower);
        }
    }

    // 添加连接关系
    addConnection(tower1Name: string, tower2Name: string): void {

        console.log(tower1Name+"->"+tower2Name)

        if (!this.nodes.has(tower1Name) || !this.nodes.has(tower2Name)) {
            throw new Error("One or both towers do not exist.");
        }

        this.adjacencyList.get(tower1Name)?.add(tower2Name);

        if (!this.isDirected) {
            this.adjacencyList.get(tower2Name)?.add(tower1Name);
        }
    }

    // 获取塔节点信息
    getTower(towerName: string): ConnectionNode | undefined {
        return this.nodes.get(towerName);
    }

    // 获取某个塔的连接关系
    getConnections(towerName: string): ConnectionNode[] | undefined {
        const connections = this.adjacencyList.get(towerName);
        if (!connections) return undefined;
        return Array.from(connections).map((name) => this.nodes.get(name)!);
    }

    // 删除一个塔
    removeTower(towerName: string): void {
        if (!this.adjacencyList.has(towerName)) return;

        // 删除所有指向该塔的连接
        for (const [key, connections] of this.adjacencyList) {
            connections.delete(towerName);
        }

        // 删除该塔的连接和节点信息
        this.adjacencyList.delete(towerName);
        this.nodes.delete(towerName);
    }

    // 删除连接关系
    removeConnection(tower1Name: string, tower2Name: string): void {
        this.adjacencyList.get(tower1Name)?.delete(tower2Name);

        if (!this.isDirected) {
            this.adjacencyList.get(tower2Name)?.delete(tower1Name);
        }
    }

    // 清空所有连接和塔信息
    clearAll(): void {
        this.adjacencyList.clear();
        this.nodes.clear();
    }

    // 或者某节点作为起点，的连接数
    getConnectionCount(towerName: string): number {
        return this.adjacencyList.get(towerName)?.size ?? 0;
    }

    // 打印拓扑关系
    printGraph(): void {
        for (const [towerName, connections] of this.adjacencyList) {
            const connectionNames = Array.from(connections).join(", ");
            const tower = this.nodes.get(towerName);
            console.log(
                `${towerName} (${tower?.x}, ${tower?.y}) is connected to: ${connectionNames}`
            );
        }
    }
}

// // 使用示例

// // 创建单向图
// const directedGraph = new ConnectionInfo1(true);

// // 添加塔
// const towerA = new ConnectionNode("A", 10, 20);
// const towerB = new ConnectionNode("B", 30, 40);
// const towerC = new ConnectionNode("C", 50, 60);

// directedGraph.addTower(towerA);
// directedGraph.addTower(towerB);
// directedGraph.addTower(towerC);

// // 添加连接
// directedGraph.addConnection("A", "B");
// directedGraph.addConnection("B", "C");

// // 打印拓扑关系
// directedGraph.printGraph();
// // 输出:
// // A (10, 20) is connected to: B
// // B (30, 40) is connected to: C
// // C (50, 60) is connected to:

// // 获取塔的连接关系
// console.log(directedGraph.getConnections("B")); 
// // 输出: [TowerNode { name: 'C', x: 50, y: 60 }]
