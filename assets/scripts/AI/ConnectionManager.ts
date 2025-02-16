import { _decorator} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ConnectionManager')
export class ConnectionManager {


    private connections: Map<number, Set<number>>;

    constructor() {
        this.connections = new Map<number, Set<number>>();
    }

    /**
     * 添加一个连接，从 source 到 target。
     * @param source 源节点 ID
     * @param target 目标节点 ID
     */
    public addConnection(source: number, target: number): void {
        if (!this.connections.has(source)) {
            this.connections.set(source, new Set<number>());
        }
        this.connections.get(source)!.add(target);
    }

    /**
     * 移除一个连接，从 source 到 target。
     * @param source 源节点 ID
     * @param target 目标节点 ID
     */
    public removeConnection(source: number, target: number): void {
        if (this.connections.has(source)) {
            this.connections.get(source)!.delete(target);
        }
    }

    /**
     * 删除某个节点发出的所有连接。
     * @param source 源节点 ID
     */
    public removeNodeAllConnections(source: number): void {
        this.connections.delete(source);
    }

    /**
     * 获取指定节点的所有目标连接集合。
     * @param nodeId 节点 ID
     * @returns 一个 Set，包含所有连接到的节点 ID
     */
    public getConnections(nodeId: number): Set<number> {
        return this.connections.get(nodeId) || new Set<number>();
    }

    /**
     * 判断从 source 到 target 的连接是否存在。
     * @param source 源节点 ID
     * @param target 目标节点 ID
     * @returns 存在则返回 true，否则返回 false
     */
    public connectionExists(source: number, target: number): boolean {
        return this.connections.has(source) && this.connections.get(source)!.has(target);
    }

    /**
     * 判断两个 ConnectionManager 实例是否相等。
     * @param other 另一个 ConnectionManager 实例
     * @returns 如果相等返回 true，否则返回 false
     */
    public equals(other: ConnectionManager): boolean {
        if (!(other instanceof ConnectionManager)) {
            return false;
        }
        if (this.connections.size !== other.connections.size) {
            return false;
        }
        for (let [key, setVal] of this.connections.entries()) {
            const otherSet = other.connections.get(key);
            if (!otherSet || setVal.size !== otherSet.size) {
                return false;
            }
            for (let item of setVal) {
                if (!otherSet.has(item)) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 返回该 ConnectionManager 的字符串表示形式。
     * @returns 字符串表示
     */
    public toString(): string {
        const obj: { [key: number]: number[] } = {};
        this.connections.forEach((value, key) => {
            obj[key] = Array.from(value);
        });
        return `ConnectionManager(${JSON.stringify(obj)})`;
    }

    /**
     * 创建当前 ConnectionManager 的深拷贝。
     * @returns 新的 ConnectionManager 实例
     */
    public deepCopy(): ConnectionManager {
        const newCopy = new ConnectionManager();
        this.connections.forEach((setVal, key) => {
            newCopy.connections.set(key, new Set<number>(setVal));
        });
        return newCopy;
    }
}


