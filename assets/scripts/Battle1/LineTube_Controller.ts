import { _decorator, Component, Node, UITransform } from 'cc';
import { TowerGraph } from '../baseclass3/TowerGraph';
import { TowerManager_Controller } from './TowerManager_Controller';
const { ccclass, property } = _decorator;

@ccclass('LineTube_Controller')
export class LineTube_Controller extends Component {

    // 注意
    // 管道是我们自己提出的一个概念
    // 管道连接了两个塔A，B，是承载连接线的上层节点,管道只管图像，其他都不管，拓扑图记录在上层manager中
    // 不管A->B的连接，还是B->A的连接，抑或是双向连接，都存在于一个管道中
    // 管道没有方向



    //---- 变量
    // private local_graph1: TowerGraph = new TowerGraph(true);    // 记录管道中的连接,有向图

    private origin_arrow_length = 23;   // 箭头最开始宽度

    //---- 重载







    start() {

    }

    update(deltaTime: number) {

    }


    // 建立一个有向连接
    EstablishSingleConnection(from_name: string, to_name: string) {
        // 确立连接线的颜色
        const towerscript_from = TowerManager_Controller.Instance.GetTowerScript(from_name)
        const towerscript_to = TowerManager_Controller.Instance.GetTowerScript(to_name)
        if (towerscript_from == undefined || towerscript_to == undefined)   // 安全检查
        {
            console.error("from或to塔不存在, 严重错误")
            return
        }
        const party_from = towerscript_from.cur_Party;   // 获取两个塔的party
        const party_to = towerscript_to.cur_Party;      // 获取两个塔的party

        const colorID = this._get_line_ColorID(party_from)  // 获取线的颜色，colorID对应child编号

        // 起始和终止点的世界坐标
        const pos_from_x = towerscript_from.node.getWorldPosition().x;
        const pos_from_y = towerscript_from.node.getWorldPosition().y;
        const pos_to_x = towerscript_to.node.getWorldPosition().x;
        const pos_to_y = towerscript_to.node.getWorldPosition().y;

        const dt_x = pos_from_x - pos_to_x;
        const dt_y = pos_from_y - pos_to_y;
        const tmpdist = Math.sqrt(dt_x * dt_x + dt_y * dt_y);  // 自此我们可以计算出两个塔距离


        // 画箭头

        let node_arrow = this.node.children[colorID];   // 找到对应箭头
        node_arrow.setWorldPosition(pos_to_x, pos_to_y, 0);
        node_arrow.getComponent(UITransform).width = tmpdist

        let angle = Math.atan2(dt_y, dt_x) * 180 / Math.PI;
        node_arrow.setRotationFromEuler(0, 0, angle)
        node_arrow.active = true;   // 激活箭头

    }

    // 建立一个双向连接
    EstablishDoubleConnection(from_name: string, to_name: string) {
        //未完成
    }


    // 清理目前连接
    ClearAllConnection() {
        for (const ichild of this.node.children)
            ichild.active = false;
    }

    // 让管道建立一个有向连接
    EstablishConnection(from_name: string, to_name: string) {
        // 判断这个连接是否存在
        if (this.local_graph1.hasConnection(from_name, to_name))
            return;

        // 连接不存在，那么建立连接
        // 确立连接线的颜色
        const towerscript_from = TowerManager_Controller.Instance.GetTowerScript(from_name)
        const towerscript_to = TowerManager_Controller.Instance.GetTowerScript(to_name)
        if (towerscript_from == undefined || towerscript_to == undefined)   // 安全检查
        {
            console.error("from或to塔不存在, 严重错误")
            return
        }
        const party_from = towerscript_from.cur_Party;   // 获取两个塔的party
        const party_to = towerscript_to.cur_Party;      // 获取两个塔的party

        const colorID = this._get_line_ColorID(party_from)  // 获取线的颜色，colorID对应child编号

        // 起始和终止点的世界坐标
        const pos_from_x = towerscript_from.node.getWorldPosition().x;
        const pos_from_y = towerscript_from.node.getWorldPosition().y;
        const pos_to_x = towerscript_to.node.getWorldPosition().x;
        const pos_to_y = towerscript_to.node.getWorldPosition().y;

        const dt_x = pos_from_x - pos_to_x;
        const dt_y = pos_from_y - pos_to_y;
        const tmpdist = Math.sqrt(dt_x * dt_x + dt_y * dt_y);  // 自此我们可以计算出两个塔距离

        // 是否有反方向的连接
        let isReverseConnection = this.local_graph1.hasConnection(to_name, from_name)

        // 如果两个塔都是同一阵营
        if (party_from == party_to) {

            // 如果有反向连接，删除反向连接，然后直接画箭头过去
            if (isReverseConnection) {
                // 删除反向连接
                // 注意，我们这里不用 this.DisConnection(to_name,from_name) 来删除
                // 因为我们不需要把图像关闭，只需要把原来的箭头调转方向就行。
                // 同时我们要在local_graph1中删除链接
                this.local_graph1.removeConnection(to_name, from_name);
            }
            // 画箭头和下面一起画
            // 如果没有反向连接，直接画图箭头过去就行
            // 画箭头

            let node_arrow = this.node.children[colorID];
            node_arrow.setWorldPosition(pos_to_x, pos_to_y, 0);
            node_arrow.getComponent(UITransform).width = tmpdist

            let angle = Math.atan2(dt_y, dt_x) * 180 / Math.PI;
            node_arrow.setRotationFromEuler(0, 0, angle)
            node_arrow.active = true;


        }


        // 未完成


        this.local_graph1.addConnection(from_name, to_name)  // 添加局部有向图的记录
        console.log("管道建立连接" + from_name + " -> " + to_name)
    }

    // 让管道删除一个有向连接
    DisConnection(from_name: string, to_name: string) {
        console.log("管道删除连接" + from_name + " -> " + to_name)
    }


    // 获取管道里，一条线的颜色ID，ID对应child编号
    private _get_line_ColorID(partyID: number): number {
        switch (partyID)  // 塔所属阵营，-1 -2 -3 -4是敌人  0中立 1自己
        {
            case 1:
                return 0;
            case -1:
                return 1;
            default:
                console.error("未知的party编号")
                return -100

        }
    }


}


