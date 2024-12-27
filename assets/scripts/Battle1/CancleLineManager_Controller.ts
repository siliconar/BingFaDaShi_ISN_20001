import { _decorator, Component, EventTouch, Node } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
const { ccclass, property } = _decorator;

@ccclass('CancleLineManager_Controller')
export class CancleLineManager_Controller extends GObjectbase1 {



    //---- 单例
    static Instance: CancleLineManager_Controller

    protected onLoad(): void {
        super.onLoad();
        CancleLineManager_Controller.Instance = this;

    }
    protected onDestroy(): void {

    }

    //---- 变量

    // ----- 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnNodeName(): string {
        return "CancelLineManager"
    }
    // 处理消息(等待后续重载)
    _processMessage(msg: Message3) {
        // 消息列表
        // 暂时没啥
    
    }





    start() {
        // 注册messagecenter
        MessageCenter3.getInstance(this.BelongedSceneName).RegisterReceiver(this.OwnNodeName, this);

    }

    update(deltaTime: number) {

    }


    // 是否开始Cancle Line模式
    SetActiveCancleLine(bactive:boolean)
    {
        this.node.children[0].active =bactive
    }


}


