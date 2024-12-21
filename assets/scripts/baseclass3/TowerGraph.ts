import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TowerGraph')
export class TowerGraph {
    private adjacencyList: Map<string, Set<string>>;  // 连接关系

    constructor() {
        this.adjacencyList = new Map();
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
        this.adjacencyList.get(tower2)?.add(tower1); // 无向图的双向连接
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
            // 删除与其他塔的连接
            this.adjacencyList.get(tower)?.forEach((connectedTower) => {
                this.adjacencyList.get(connectedTower)?.delete(tower);
            });
            // 删除该塔本身
            this.adjacencyList.delete(tower);
        }
    }

    // 删除连接关系
    removeConnection(tower1: string, tower2: string): void {
        this.adjacencyList.get(tower1)?.delete(tower2);
        this.adjacencyList.get(tower2)?.delete(tower1);
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


