import { _decorator, Component, Node } from 'cc';
import { Message2, MessageType2 } from '../baseclass2/Message2';
import { MessageCenter2 } from '../baseclass2/MessageCenter2';
import { ManagerBase2 } from '../baseclass2/ManagerBase2';
const { ccclass, property } = _decorator;

@ccclass('choosebattle1_MessageSenter')
export class choosebattle1_MessageSenter extends ManagerBase2 {

    // 单例
    static Instance: choosebattle1_MessageSenter

    protected onLoad(): void {
        super.onLoad();
        choosebattle1_MessageSenter.Instance = this;
    }

    // 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnMessageType() {
        return MessageType2.Scene_Choose;
    }
    // 处理消息(等待后续重载)
    _processMessage(msg: Message2) {
        // 暂时不需要处理
    }

    start() {
        // 注册父节点
        // 注册messagecenter
        MessageCenter2.RegisterReceiver(this)
    }


}


