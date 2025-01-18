import { _decorator, Component, Node } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
const { ccclass, property } = _decorator;

@ccclass('EffectManager_Controller')
export class EffectManager_Controller extends GObjectbase1 {
 //---- 单例
    static Instance: EffectManager_Controller

    protected onLoad(): void {
        super.onLoad();
        EffectManager_Controller.Instance = this;

    }


    //---- 变量



    // ----- 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnNodeName(): string {
        return "SoldierManager"
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

}


