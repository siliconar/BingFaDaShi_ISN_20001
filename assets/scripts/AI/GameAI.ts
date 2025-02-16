import { _decorator} from 'cc';
import { GameStateX } from './GameStateX';
import { UndirectedGraph } from './UndirectedGraph';
import { ConnectionManager } from './ConnectionManager';
import { NodeManager } from './NodeManager';
const { ccclass, property } = _decorator;

@ccclass('GameAI')
export class GameAI  {





    visitedStates: GameStateX[];
    camp: number;
    bestScore: number;
    bestState: GameStateX;

    constructor(camp: number) {
        this.visitedStates = [];  // 存储已经访问过的状态
        this.camp = camp;
        this.bestScore = -999;
        this.bestState = new GameStateX([], new ConnectionManager());
    }

    /**
     * 深度优先搜索（DFS），支持状态剪枝
     * @param currentState 当前游戏状态
     * @param depth 搜索深度
     * @param globalAccessGraph 无向图实例
     */
    public dfs(currentState: GameStateX, depth: number, globalAccessGraph: UndirectedGraph): GameStateX | null {
        // 先检查当前状态是否已经访问过
        if (this.visitedStates.some(state => state.connectionManager.equals(currentState.connectionManager))) {
            return null; // 如果已经访问过，剪枝
        }

        // 标记当前状态已访问
        this.visitedStates.push(currentState);

        // 评估当前局面分数，如果比best记录大，记录下来
        const newCurrentState = new GameStateX(
            Array.from(currentState.nodes.values()).map(node => new NodeManager(node.nodeId, node.camp, node.hp)),
            currentState.connectionManager.deepCopy()
        );
        const evalScore = newCurrentState.calculateScore();

        if (evalScore > this.bestScore) {
            this.bestScore = evalScore;
            this.bestState = currentState;
        }

        // 如果没深度了，就不继续往下拓展了
        if (depth === 0) {
            return currentState; // 返回当前状态
        }

        // 获取当前状态的所有可能后续状态，注意只有1步
        const possibleNextStates = this.getPossibleNextStates(currentState, globalAccessGraph);
        for (const nextState of possibleNextStates) {
            const result = this.dfs(nextState, depth - 1, globalAccessGraph);
            if (result) {
                return result; // 如果找到了目标状态，则返回
            }
        }

        return null; // 回溯时返回 null
    }

    /**
     * 获取当前状态的所有可能的后续状态
     * 这个方法可以根据游戏规则进行调整
     * @param currentState 当前状态
     * @param globalAccessGraph 无向图实例
     * @returns 所有可能的后续状态
     */
    private getPossibleNextStates(currentState: GameStateX, globalAccessGraph: UndirectedGraph): GameStateX[] {
        const possibleStates: GameStateX[] = [];

        // 遍历所有的节点
        currentState.nodes.forEach((node) => {
            if (node.camp !== this.camp) {
                return; // 只处理己方节点
            }

            // 如果节点等级不够，则跳过
            if (currentState.connectionManager.getConnections(node.nodeId).size >= node.level) {
                return;
            }

            // 取得这个节点能够输出的目标节点
            const accessNodeIDVec = globalAccessGraph.getNeighbors(node.nodeId);

            // 生成所有可能的后续状态
            accessNodeIDVec.forEach((iTargetID) => {
                // 复制当前状态
                const newNodes = Array.from(currentState.nodes.values()).map(
                    (node) => new NodeManager(node.nodeId, node.camp, node.hp)
                );
                const newConn = currentState.connectionManager.deepCopy(); // 获取连接的深拷贝

                // 添加新连接
                newConn.addConnection(node.nodeId, iTargetID);

                // 如果目标节点是同阵营的，移除反向连接
                if (currentState.nodes.get(iTargetID)?.camp === node.camp) {
                    newConn.removeConnection(iTargetID, node.nodeId);
                }

                const newState = new GameStateX(newNodes, newConn);
                possibleStates.push(newState);
            });
        });

        return possibleStates;
    }













}


