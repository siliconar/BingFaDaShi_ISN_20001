import { _decorator, Collider, Collider2D, Component, Contact2DType, EventTouch, IPhysics2DContact, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('test_collidercube_Controller')
export class test_collidercube_Controller extends Component {


    local_collider: Collider2D = null;


    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTowerTouchMove, this)
        if (this.local_collider) {
            this.local_collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.local_collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    start() {
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTowerTouchMove, this)

        // 碰撞体
        this.local_collider = this.getComponent(Collider2D);
        if (this.local_collider) {
            this.local_collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.local_collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    update(deltaTime: number) {

    }

    // 由塔的on消息调用，给DrawLineMaskManager发消息
    onTowerTouchStart(event: EventTouch) {
        // event.preventSwallow = true   //因为塔在Line之上，消息被塔捕获了，所以一定要转发消息


    }

    // 由塔的on消息调用
    onTowerTouchMove(event: EventTouch) {
        const tx = event.getUILocation().x
        const ty = event.getUILocation().y
        this.node.setWorldPosition(tx, ty, 0)
    }

    // 由塔的on消息调用
    onTowerTouchEnd(event: EventTouch) {

    }

    // 由塔的on消息调用
    onTowerTouchCancel(event: EventTouch) {

    }



    // 碰撞回调
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        console.log("撞上")

    }

    //碰撞回调
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        console.log("离开")
    }
}


