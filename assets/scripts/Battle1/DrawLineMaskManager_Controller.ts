import { _decorator, Component, Node, EventTouch } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
const { ccclass, property } = _decorator;

@ccclass('DrawLineMaskManager_Controller')
export class DrawLineMaskManager_Controller extends GObjectbase1 {

    //---- 单例
    static Instance: DrawLineMaskManager_Controller

    protected onLoad(): void {
        super.onLoad();
        DrawLineMaskManager_Controller.Instance = this;
    }

    //---- 变量
    bStartConnect:boolean = false;

    // ----- 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnNodeName(): string {
        return "DrawLineMaskManager"
    }
    // 处理消息(等待后续重载)
    _processMessage(msg: Message3) {
        // 消息列表
        // 暂时没啥
    }


    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEND, this)
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancle, this)
    }

    start() {
        // 注册messagecenter
        MessageCenter3.getInstance(this.BelongedSceneName).RegisterReceiver(this.OwnNodeName, this);

        // 消息
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEND, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancle, this);


        this.setSmallSize()
    }

    update(deltaTime: number) {

    }


    // 由触摸命令触发
    onTouchStart(event: EventTouch) {
        // 啥都不用做，只是为了监听，不监听Move走不了
        console.log("start")
    }


    // 由触摸命令触发
    onTouchMove(event: EventTouch) {
        // if(true == this.bStartConnect)
        // {
        //     console.log(event.getLocation())
        // }
        console.log(event.getLocation())

    }
    // 由触摸命令触发
    onTouchEND(event: EventTouch) {
        // this.bStartConnect = false;
        this.setSmallSize()
    }

    // 由触摸命令触发
    onTouchCancle(event: EventTouch) {
        // this.bStartConnect = false;
        this.setSmallSize()
    }


    setBigSize()
    {
        this.node.setScale(1,1)
    }
    setSmallSize()
    {
        this.node.setScale(0.01,0.01)
    }

}


