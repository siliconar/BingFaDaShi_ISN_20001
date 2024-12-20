import { _decorator, Component, Node, EventTouch } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
import { LineArrow_Controller } from './LineArrow_Controller';
const { ccclass, property } = _decorator;

@ccclass('DrawLineMaskManager_Controller2')
export class DrawLineMaskManager_Controller2 extends GObjectbase1 {

    //---- 单例
    static Instance: DrawLineMaskManager_Controller2

    protected onLoad(): void {
        super.onLoad();
        DrawLineMaskManager_Controller2.Instance = this;
    }

    //---- 变量


    // 杆子
    arrow:Node = null;
    arrow_Script:LineArrow_Controller = null;


    // ----- 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnNodeName(): string {
        return "DrawLineMaskManager"
    }
    // 处理消息(等待后续重载)
    _processMessage(msg: Message3) {
        // 消息列表
        // 暂无
    }


    start() {
        // 注册messagecenter
        MessageCenter3.getInstance(this.BelongedSceneName).RegisterReceiver(this.OwnNodeName, this);

        // 组件
        this.arrow = this.node.children[0]
        this.arrow_Script = this.arrow.getComponent(LineArrow_Controller)

    }

    update(deltaTime: number) {


    }





}


