import { _decorator, Component, ERaycast2DType, EventTouch, Node, PhysicsSystem2D, Vec2 } from 'cc';
import { LinesManager_Controller } from './LinesManager_Controller';
const { ccclass, property } = _decorator;

@ccclass('CancleLineNode_Controller')
export class CancleLineNode_Controller extends Component {




    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onCancleLineTouchStart, this)
        this.node.on(Node.EventType.TOUCH_MOVE, this.onCancleLineTouchMove, this)
        this.node.on(Node.EventType.TOUCH_END, this.onCancleLineTouchEnd, this)
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onCancleLineTouchCancel, this)
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onCancleLineTouchStart, this)
        this.node.off(Node.EventType.TOUCH_MOVE, this.onCancleLineTouchMove, this)
        this.node.off(Node.EventType.TOUCH_END, this.onCancleLineTouchEnd, this)
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onCancleLineTouchCancel, this)
    }

    //---- 变量
    canclelinenode: Node = null;

    private origin_linewidth = 5;

    private startx: number
    private starty: number
    private endx: number
    private endy: number


    start() {
        // 组件
        this.canclelinenode = this.node.children[0];
    }

    update(deltaTime: number) {



    }

    // 画cancle线
    DrawCancleLine(startx: number, starty: number, endx: number, endy: number) {

        const dt_x = startx - endx;
        const dt_y = starty - endy;
        const tmpdist = Math.sqrt(dt_x * dt_x + dt_y * dt_y);  // 自此我们可以计算出两个点距离

        const angle = Math.atan2(dt_y, dt_x) * 180 / Math.PI;


        this.canclelinenode.setWorldPosition(startx, starty, 0)
        this.canclelinenode.setScale(tmpdist / this.origin_linewidth, 1, 1)
        this.canclelinenode.setRotationFromEuler(0, 0, angle + 180)

        this.canclelinenode.active = true;

    }

    // 取消cancle线
    HideCancleLine() {
        this.canclelinenode.active = false;
    }


    // 由touch消息调用
    onCancleLineTouchStart(event: EventTouch) {
        // event.preventSwallow = true   //如果要转发消息，用这个，放最后
        this.startx = event.getUILocation().x
        this.starty = event.getUILocation().y
    }

    // 由touch消息调用
    onCancleLineTouchMove(event: EventTouch) {
        // event.preventSwallow = true  //如果要转发消息，用这个，放最后
        this.endx = Math.floor(event.getUILocation().x)
        this.endy = Math.floor(event.getUILocation().y)

        // 画Cancle line
        this.DrawCancleLine(this.startx, this.starty, this.endx, this.endy)


        // 发出射线，检测最近的那个
        const ph2d = PhysicsSystem2D.instance;
        const results = ph2d.raycast(new Vec2(this.startx, this.starty), new Vec2(this.endx, this.endy), ERaycast2DType.Closest, 0b01000)

        if (results.length > 0)  // 如果的确监测到了
        {
            //通知那条线【变色】
            LinesManager_Controller.Instance.ChangeColor_Tube(results[0].collider.node.parent.name);
        }
        else {
            // 通知所有线【取消变色】
            LinesManager_Controller.Instance.StopChangeColor_Tube()
        }
    }

    // 由touch消息调用
    onCancleLineTouchEnd(event: EventTouch) {
        this.HideCancleLine()

        // 删除对应的线
        const cur_changecolor_name = LinesManager_Controller.Instance.cur_changecolor_name
        if (cur_changecolor_name != "") // 如果的确有线要删除
        {
            LinesManager_Controller.Instance.RemoveConnection_by_tubename_party(cur_changecolor_name , 1)
        }

    }

    // 由touch消息调用
    onCancleLineTouchCancel(event: EventTouch) {
        this.HideCancleLine()

        // 删除对应的线
        const cur_changecolor_name = LinesManager_Controller.Instance.cur_changecolor_name
        if (cur_changecolor_name != "") // 如果的确有线要删除
        {
            LinesManager_Controller.Instance.RemoveConnection_by_tubename_party(cur_changecolor_name , 1)
        }
    }


}


