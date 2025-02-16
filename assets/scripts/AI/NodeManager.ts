import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeManager')
export class NodeManager  {

    nodeId: number;
    camp: number;
    hp: number;
    flowSoldier: number;
    level: number;
    productionInterval: number;
    timeAccumulator: number;

    constructor(nodeId: number, camp: number, initialHp: number = 0) {
        this.nodeId = nodeId;
        this.camp = camp;
        this.hp = initialHp;
        this.flowSoldier = 0; // 能流动的兵力，这个只用于推演时使用
        this.updateLevelFromHP(); // 更新 level
        this.productionInterval = 1; // 非中立节点每 1 秒生产 1 个士兵
        this.timeAccumulator = 0.0;
    }

    // 更新节点的 level 值基于当前的 hp
    updateLevelFromHP(): void {
        if (this.hp < 15) {
            this.level = 1;
        } else if (this.hp >= 15 && this.hp < 45) {
            this.level = 2;
        } else {
            this.level = 3;
        }
    }

    // 打印当前节点信息
    toString(): string {
        return `Node(${this.nodeId}, camp=${this.camp}, hp=${this.hp})`;
    }

    
}



