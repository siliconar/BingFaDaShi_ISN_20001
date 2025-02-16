import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UndirectedGraph')
export class UndirectedGraph {
    private graph: Map<number, Set<number>>;

    constructor() {
        this.graph = new Map<number, Set<number>>();
    }

    /**
     * 添加节点，如果节点已存在则不作任何操作。
     * @param nodeId 节点编号
     */
    public addNode(nodeId: number): void {
        if (!this.graph.has(nodeId)) {
            this.graph.set(nodeId, new Set<number>());
        }
    }

    /**
     * 添加无向边，即在 node1 与 node2 之间建立连接。
     * 如果节点不存在，会自动先添加节点。
     * @param node1 第一个节点编号
     * @param node2 第二个节点编号
     */
    public addEdge(node1: number, node2: number): void {
        if (!this.graph.has(node1)) {
            this.addNode(node1);
        }
        if (!this.graph.has(node2)) {
            this.addNode(node2);
        }
        this.graph.get(node1)!.add(node2);
        this.graph.get(node2)!.add(node1);
    }

    /**
     * 返回与给定节点 nodeId 相连的所有节点编号。
     * 如果节点不存在，则返回空集合。
     * @param nodeId 节点编号
     * @returns 相邻节点编号集合
     */
    public getNeighbors(nodeId: number): Set<number> {
        return this.graph.get(nodeId) || new Set<number>();
    }

    /**
     * 打印图的所有节点及其连接信息。
     */
    public print(): void {
        console.log("Graph nodes and their connections:");
        this.graph.forEach((neighbors, nodeId) => {
            console.log(`Node ${nodeId}: [${Array.from(neighbors).join(", ")}]`);
        });
    }
}


