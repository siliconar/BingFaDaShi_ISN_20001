import { _decorator, Collider2D, Color, Component, Contact2DType, IPhysics2DContact, Node, Sprite, Vec3 } from 'cc';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { TowerNode_Controller } from './TowerNode_Controller';
const { ccclass, property } = _decorator;

@ccclass('LineArrow_Controller')
export class LineArrow_Controller extends GObjectbase1 {



    //---- 变量
    bStartConnect: boolean = false;   // 是否开始连接了
    start_wx: number = -1;       // 箭头起始绘图点世界坐标
    start_wy: number = -1;
    previous_end_wx: number = -1;
    previous_end_wy: number = -1;
    end_wx: number = -1;     // 箭头终止绘图点世界坐标
    end_wy: number = -1;


    block_end = false;   // 是否锁住终点
    lock_endx: number = -1;
    lock_endy: number = -1;

    readonly arrow_width: number = 180 + 15;  // 原始的箭头宽度


    arrow_head: Node = null;    // 箭头
    arrow_body: Node = null;    // 箭头


    local_collider: Collider2D = null; // 箭头尖尖的小碰撞体

    // ----- 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnNodeName(): string {
        return "LineArrow"
    }
    // 处理消息(等待后续重载)
    _processMessage(msg: Message3) {
        // 消息列表
        // 暂无
    }



    protected onDestroy(): void {
        if (this.local_collider) {
            this.local_collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.local_collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }


    start() {
        // 注册messagecenter
        MessageCenter3.getInstance(this.BelongedSceneName).RegisterReceiver(this.OwnNodeName, this);


        this.arrow_head = this.node.children[0];
        this.arrow_body = this.node.children[1];
        this.arrow_body.setScale(0, 0, 1)   // 把箭头隐藏掉
        this.arrow_head.setScale(0, 0, 1) // 把箭头隐藏掉

        // 碰撞体
        this.local_collider = this.getComponent(Collider2D);
        if (this.local_collider) {
            this.local_collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.local_collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    update(deltaTime: number) {
        if (this.bStartConnect) {
            if (this.previous_end_wx == this.end_wx && this.previous_end_wy == this.end_wy)  // 如果终点没变化，就不用绘图了
                return

            this.previous_end_wx = this.end_wx
            this.previous_end_wy = this.end_wy


            let dt_x = this.start_wx - this.end_wx;
            let dt_y = this.start_wy - this.end_wy;
            let tmpdist = Math.sqrt(dt_x * dt_x + dt_y * dt_y);  // 自此我们可以计算出宽度

            let angle = Math.atan2(dt_y, dt_x) * 180 / Math.PI;

            this.node.setWorldPosition(this.end_wx, this.end_wy, 0)
            this.node.setRotationFromEuler(0, 0, angle + 180)
            this.arrow_body.setScale(tmpdist / this.arrow_width, 1, 1)
            // console.log((this.end_wx).toString()+"_"+(this.end_wy).toString())

        }
    }


    // 设置起始绘图点并开始绘图
    SetDrawStartPoint(w_x: number, w_y: number) {
        this.start_wx = w_x;
        this.start_wy = w_y;
        this.end_wx = w_x;
        this.end_wy = w_y;
        this.bStartConnect = true;   // 开始作图模式
        this.arrow_head.setScale(1, 1, 1)  //放出箭头

        this._ArrowColorRed()  // 变更为红色
    }

    // 随着鼠标移动，改变终止绘图点
    SetDrawEndPoint(w_x: number, w_y: number) {
        this.end_wx = w_x;
        this.end_wy = w_y;
    }

    // 停止绘图
    StopDraw() {
        this.bStartConnect = false;   // 关闭作图模式
        this.arrow_body.setScale(0, 0, 1)
        this.arrow_head.setScale(0, 0, 1)
    }


    // 锁住箭头终点（为了制造磁吸效果）
    private _lock_end(endpoint: Vec3) {
        this.block_end = true;
        this.lock_endx = endpoint.x;
        this.lock_endy = endpoint.y;
    }
    // 解锁箭头终点
    private _unlock_end() {
        this.block_end = false;
    }

    // 箭头变红
    private _ArrowColorRed() {
        this.arrow_head.getComponent(Sprite).color = new Color().fromHEX("#AD2014");
        this.arrow_body.getComponent(Sprite).color = new Color().fromHEX("#AD2014");
    }

    // 箭头变蓝
    private _ArrowColorBlue() {
        this.arrow_head.getComponent(Sprite).color = new Color().fromHEX("#143FAD");
        this.arrow_body.getComponent(Sprite).color = new Color().fromHEX("#143FAD");
    }
    // 碰撞回调
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        // 如果碰撞的是塔
        let tower_com = otherCollider.getComponent(TowerNode_Controller)
        if (tower_com != null) {

            // 判断能不能碰撞
            let bAllowConnect = 未完成;

            // 能碰撞就锁死 变蓝
            if (bAllowConnect) {
                this._lock_end(tower_com.node.getWorldPosition())
                this._ArrowColorBlue();
            }
            else //不能碰撞就箭头标红
            {
                this._ArrowColorRed();
            }

            return
        }

    }

    // 碰撞回调
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        // 箭头标红
        this._ArrowColorRed();
    }



}


