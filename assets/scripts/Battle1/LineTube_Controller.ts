import { _decorator, Animation, BoxCollider2D, Collider2D, Component, Node, Size, UITransform, Vec2 } from 'cc';
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

    private origin_arrow_length:number = 23;   // 箭头最开始宽度

    // 两个塔的名称
    Tower1name:string;
    Tower1PartyID:number;
    Tower2name:string;
    Tower2PartyID:number;
    //---- 重载







    start() {

    }

    update(deltaTime: number) {

    }



    Init(tower1name:string, tower2name:string)
    {
        this.Tower1name = tower1name
        this.Tower2name = tower2name
        // 确立party
        this.Tower1PartyID = TowerManager_Controller.Instance.GetTowerScript(tower1name).cur_Party;
        this.Tower2PartyID = TowerManager_Controller.Instance.GetTowerScript(tower2name).cur_Party;
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
        const angle = Math.atan2(dt_y, dt_x) * 180 / Math.PI;

        // 画箭头
        this._paint_connection(colorID, pos_to_x, pos_to_y, tmpdist, angle)

        if(party_from == 1)  // 如果是玩家，记得暂停变色
        {
            this.StopChangeColor_playerLine()
        }
    }

    // 建立一个双向连接
    EstablishDoubleConnection(from_name: string, to_name: string) {
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

        const colorID1 = this._get_line_ColorID(party_from)  // 获取线的颜色，colorID对应child编号
        const colorID2 = this._get_line_ColorID(party_to)  // 获取线的颜色，colorID对应child编号
        // 起始和终止点的世界坐标
        const pos_from_x = towerscript_from.node.getWorldPosition().x;
        const pos_from_y = towerscript_from.node.getWorldPosition().y;
        const pos_to_x = towerscript_to.node.getWorldPosition().x;
        const pos_to_y = towerscript_to.node.getWorldPosition().y;

        const dt_x = pos_from_x - pos_to_x;
        const dt_y = pos_from_y - pos_to_y;
        const tmpdist = Math.sqrt(dt_x * dt_x + dt_y * dt_y);  // 自此我们可以计算出两个塔距离

        const pos_half_x = (pos_from_x + pos_to_x) / 2;         // 两条线只能划到一半
        const pos_half_y = (pos_from_y + pos_to_y) / 2;         // 两条线只能划到一半

        const angle1 = Math.atan2(dt_y, dt_x) * 180 / Math.PI;
        const angle2 = Math.atan2(dt_y, dt_x) * 180 / Math.PI + 180;

        // 画箭头1 from
        if (party_from == 1)  // 如果是玩家阵营，记住，箭头需要画到头,这么做是为了方便玩家cancle
        {
            this._paint_connection(colorID1, pos_to_x, pos_to_y, tmpdist, angle1)
            this.StopChangeColor_playerLine()   // 玩家阵营一定要暂停变色
        }
        else {
            this._paint_connection(colorID1, pos_half_x, pos_half_y, tmpdist / 2, angle1)
        }

        // 画箭头2 to
        if (party_to == 1)   // 如果是玩家阵营，记住，箭头需要画到头,这么做是为了方便玩家cancle
        {
            this._paint_connection(colorID2, pos_from_x, pos_from_y, tmpdist, angle2)
            this.StopChangeColor_playerLine()   // 玩家阵营一定要暂停变色
        }
        else {
            this._paint_connection(colorID2, pos_half_x, pos_half_y, tmpdist / 2, angle2)
        }

        // // 内部有向图中添加连接，为了删除的时候好查询
        // this.local_graph1.addConnection(from_name, to_name)
        // this.local_graph1.addConnection(to_name, from_name)

    }


    // 清理目前连接
    ClearAllConnection() {
        for (const ichild of this.node.children)
            ichild.active = false;

        // // 内部有向图中删除连接，为了删除的时候好查询
        // this.local_graph1.clearAll()
    }

    // 依据party，隐藏某个连接
    // ClearConnectionByParty(partyID: number) {
    //     const colorID = this._get_line_ColorID(partyID);  // 找到玩家箭头
    //     const playernode_arrow = this.node.children[colorID];
    //     if (partyID == 1)  // 如果是玩家
    //         this.StopChangeColor_playerLine()   // 停止变色
    //     playernode_arrow.active = false;

    // }

    // 画箭头1个
    private _paint_connection(colorID: number, pos_to_x: number, pos_to_y: number, dist1: number, angle1: number) {
        // 画箭头
        const node_arrow = this.node.children[colorID];   // 找到对应箭头
        node_arrow.setWorldPosition(pos_to_x, pos_to_y, 0);
        node_arrow.getComponent(UITransform).width = dist1

        node_arrow.setRotationFromEuler(0, 0, angle1)

        // 如果是玩家阵营，记住，tmd还得变化collider
        if (colorID == 0) {
            const collider_size = node_arrow.getComponent(BoxCollider2D).size
            node_arrow.getComponent(BoxCollider2D).size = new Size(dist1, collider_size.height)
            node_arrow.getComponent(BoxCollider2D).offset = new Vec2(dist1 / 2, 0)
        }


        node_arrow.active = true;   // 激活箭头
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


    // 让玩家的那条线变色
    ChangeColor_playerLine() {
        const colorID = this._get_line_ColorID(1);  // 找到玩家箭头
        const node_arrow = this.node.children[colorID];

        if (node_arrow.active == true)  // 如果激活了，那就变色
        {
            node_arrow.getComponent(Animation).play()
        }
    }

    // 停止变色
    StopChangeColor_playerLine() {
        // console.log(this.node.name +"取消变色")
        const colorID = this._get_line_ColorID(1);  // 找到玩家箭头
        const node_arrow = this.node.children[colorID];

        if (node_arrow.active == true)  // 如果激活了，那就停止变色
        {
            const animation1 = node_arrow.getComponent(Animation)
            animation1.stop()
            const animState = animation1.getState("line_connect_changecolor");
            animState.time = 0
            animState.sample()
            console.log("停止变色")
        }
    }

}


