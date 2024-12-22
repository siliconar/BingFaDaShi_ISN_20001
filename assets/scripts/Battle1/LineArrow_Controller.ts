import { _decorator, Collider2D, Color, Component, Contact2DType, IPhysics2DContact, Node, Sprite, Vec3 } from 'cc';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { TowerNode_Controller } from './TowerNode_Controller';
import { TowerManager_Controller } from './TowerManager_Controller';
import { LinesManager_Controller } from './LinesManager_Controller';
const { ccclass, property } = _decorator;

@ccclass('LineArrow_Controller')
export class LineArrow_Controller extends GObjectbase1 {


    // 注意，LineArrow是顶层，碰撞体一直在移动，但是不可锁定
    // 下面LineArrowImage只是图像载体，无碰撞体，可以移动，可以锁定
    // 这么设计是因为，可以让碰撞体自由移动，但是箭头锁定不动。

    //---- 变量
    bStartConnect: boolean = false;   // 是否开始连接了
    start_wx: number = -1;       // 箭头起始绘图点世界坐标
    start_wy: number = -1;
    previous_end_wx: number = -1;
    previous_end_wy: number = -1;
    end_wx: number = -1;     // 箭头终止绘图点世界坐标
    end_wy: number = -1;
    starttower_name: string = "";    // 箭头从哪个塔出发
    connecttower_name_List: string[];    // 箭头可以连接的塔

    block_end = false;   // 是否锁住终点
    lock_end_name:string;  // 锁住节点的名字
    lock_endx: number = -1;
    lock_endy: number = -1;

    readonly arrow_width: number = 180 + 15;  // 原始的箭头宽度

    arrow_Image: Node = null;  // 承载整个箭头图像的Node
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

        this.arrow_Image = this.node.children[0];
        this.arrow_head = this.arrow_Image.children[0];
        this.arrow_body = this.arrow_Image.children[1];
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

        // 如果真的需要绘制
        if (this.bStartConnect) {

            // 绘图部分
            if (this.previous_end_wx == this.end_wx && this.previous_end_wy == this.lock_endy)  // 如果终点没变化，就不用绘图了
                return

            this.previous_end_wx = this.end_wx
            this.previous_end_wy = this.end_wy


            // 记得还要绘制碰撞体
            this.node.setWorldPosition(this.end_wx, this.end_wy, 0)

            // 先绘制箭头
            if (this.block_end)   // 如果是锁定了，那就绘制锁定位置
            {
                let dt_x = this.start_wx - this.lock_endx;
                let dt_y = this.start_wy - this.lock_endy;
                let tmpdist = Math.sqrt(dt_x * dt_x + dt_y * dt_y);  // 自此我们可以计算出宽度

                let angle = Math.atan2(dt_y, dt_x) * 180 / Math.PI;

                this.arrow_Image.setWorldPosition(this.lock_endx, this.lock_endy, 0)
                this.arrow_Image.setRotationFromEuler(0, 0, angle + 180)
                this.arrow_body.setScale(tmpdist / this.arrow_width, 1, 1)

            }
            else {
                let dt_x = this.start_wx - this.end_wx;
                let dt_y = this.start_wy - this.end_wy;
                let tmpdist = Math.sqrt(dt_x * dt_x + dt_y * dt_y);  // 自此我们可以计算出宽度

                let angle = Math.atan2(dt_y, dt_x) * 180 / Math.PI;

                this.arrow_Image.setWorldPosition(this.end_wx, this.end_wy, 0)
                this.arrow_Image.setRotationFromEuler(0, 0, angle + 180)
                this.arrow_body.setScale(tmpdist / this.arrow_width, 1, 1)
                // console.log((this.end_wx).toString()+"_"+(this.end_wy).toString())
            }


        }
    }


    // 设置起始绘图点并开始绘图
    SetDrawStartPoint(starttower_name: string, w_x: number, w_y: number) {
        this.start_wx = w_x;
        this.start_wy = w_y;
        this.end_wx = w_x;
        this.end_wy = w_y;
        this.bStartConnect = true;   // 开始作图模式
        this.arrow_head.setScale(1, 1, 1)  //放出箭头

        this._ArrowColorRed()  // 变更为红色
        this.starttower_name = starttower_name;   // 获取原始塔的名字
        // 查询可以连接的塔有哪些
        this.connecttower_name_List = TowerManager_Controller.Instance.towerGraph1.getConnections(this.starttower_name)
        // 让可以连接的塔上面有箭头
        if (this.connecttower_name_List != null)
            MessageCenter3.getInstance(this.BelongedSceneName).SendCustomerMessage("", this.connecttower_name_List, 1, true)

        // 重要，打开碰撞器
        this.local_collider.enabled = true;

    }

    // 随着鼠标移动，改变终止绘图点
    SetDrawEndPoint(w_x: number, w_y: number) {
        this.end_wx = w_x;
        this.end_wy = w_y;
    }

    // 停止绘图
    StopDraw() {

        console.log("停止作图")

        this.bStartConnect = false;   // 关闭作图模式
        this.arrow_body.setScale(0, 0, 1)
        this.arrow_head.setScale(0, 0, 1)

        // 停止所有箭头
        MessageCenter3.getInstance(this.BelongedSceneName).SendCustomerMessage("", ["TowerManager"], 1, false)


        // 发送消息，需要建立一个真实连接
        // 需要注意的是，我们这里只管玩家试图连接，至于是否真的能连接，怎么建立连接，比如塔还是否有连接点，这些都不关我们
        if(this.block_end)  // 如果玩家真的试图建立一个有效连接
        {
            // 我觉得不用这个，还是通过另外函数可以
            // LinesManager_Controller.Instance.ConnectionInfo2.addConnection(this.starttower_name, this.lock_end_name)
            // 建立真实连接，不需要上面手动修改队列了，事情交给LineManager做
            LinesManager_Controller.Instance.CreateOneConnection(this.starttower_name, this.lock_end_name);

        }
        
        
        // 重要，关闭碰撞器
        this.local_collider.enabled = false;

    }


    // 锁住箭头终点（为了制造磁吸效果）
    private _lock_end(endname:string, endpoint: Vec3) {
        this.block_end = true;
        this.lock_endx = endpoint.x;
        this.lock_endy = endpoint.y;
        this.lock_end_name = endname;
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

            // 判断能不能碰撞,主要是这两个塔拓扑上是否可连接
            const bAllowConnect = this.connecttower_name_List !== undefined && this.connecttower_name_List.indexOf(tower_com.OwnNodeName) !== -1;

            // 能碰撞就锁死 变蓝
            if (bAllowConnect) {
                this._lock_end(tower_com.OwnNodeName, tower_com.node.getWorldPosition())
                this._ArrowColorBlue();
            }
            else //不能碰撞就箭头标红
            {
                this._ArrowColorRed();
            }

            return
        }

    }

    //碰撞回调
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        // 箭头解锁
        this._unlock_end();
        // 箭头标红
        this._ArrowColorRed();
    }



}


