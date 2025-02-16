import { _decorator } from 'cc';
import { ConnectionManager } from './ConnectionManager';
import { NodeManager } from './NodeManager';
const { ccclass, property } = _decorator;

@ccclass('GameStateX')
export class GameStateX  {



    nodes: Map<number, NodeManager>;
    connectionManager: ConnectionManager;

    constructor(nodes: NodeManager[], connectionManager: ConnectionManager) {
        this.nodes = new Map<number, NodeManager>();
        nodes.forEach(node => this.nodes.set(node.nodeId, node)); // 存储节点信息
        this.connectionManager = connectionManager; // 连接管理器
    }

    // 计算游戏状态的得分
    calculateScore(): number {
        let newNodes: Map<number, NodeManager> = new Map();
        this.nodes.forEach((node) => {
            newNodes.set(node.nodeId, new NodeManager(node.nodeId, node.camp, node.hp)); // 复制节点
        });

        // 先推演到15秒
        this.simulateTime(15, 1, newNodes);

        // 计算15秒时的得分
        let score15 = 0;
        newNodes.forEach((node) => {
            if (node.camp === -1) {
                score15 += node.level;
            }
        });

        // 再推演到45秒
        this.simulateTime(15, 1, newNodes);
        let score45 = 0;
        newNodes.forEach((node) => {
            if (node.camp === -1) {
                score45 += node.level;
            }
        });

        // 再推演到90秒
        this.simulateTime(15, 1, newNodes);
        let score90 = 0;
        newNodes.forEach((node) => {
            if (node.camp === -1) {
                score90 += node.hp;
            }
        });

        console.log(this.connectionManager.toString());
        console.log(`${score15}:${score45}:${score90}:${100 * score15 + 10 * score45 + score90}`);
        return 100 * score15 + 10 * score45 + score90;
    }

    // 快速推算 n 秒之后的状态
    simulateTime(n: number, stepTime: number, newNodes: Map<number, NodeManager>): void {
        let currentTime = 0;
        while (currentTime < n) {
            currentTime += stepTime; // 时间累加
            newNodes.forEach((node) => {
                node.flowSoldier = 0; // 清零可流动的兵力
            });

            // 增兵，派兵
            newNodes.forEach((node) => {
                if (node.camp === 0) {
                    return;
                }

                let newCount = node.level * stepTime / 1; // 新增数量
                let nodeConnections = this.connectionManager.getConnections(node.nodeId); // 获取节点连接
                nodeConnections.forEach((targetId) => {
                    if (newCount <= 0) return;
                    newCount -= 1;
                    const targetNode = newNodes.get(targetId);
                    if (targetNode && targetNode.camp === -1) {
                        targetNode.flowSoldier += 1;
                    } else if (targetNode) {
                        targetNode.hp -= 1;
                    }
                });

                // 自身的 flow 兵全派出去
                const lenConn = nodeConnections.size;
                if (lenConn !== 0) {
                    nodeConnections.forEach((targetId) => {
                        const targetNode = newNodes.get(targetId);
                        if (targetNode) {
                            if (targetNode.camp === -1) {
                                targetNode.flowSoldier += node.flowSoldier / lenConn;
                            } else {
                                targetNode.hp -= node.flowSoldier / lenConn;
                                if (targetNode.hp < 0) {
                                    targetNode.hp = Math.abs(targetNode.hp);
                                    targetNode.camp = node.camp;
                                    targetNode.updateLevelFromHP();
                                }
                            }
                        }
                    });
                    node.flowSoldier = 0; // 清零
                } else {
                    newCount += node.flowSoldier;
                }

                node.hp += newCount;
                node.hp = Math.min(node.hp, 90); // 限制最大血量
                node.updateLevelFromHP();
            });
        }
    }








}


