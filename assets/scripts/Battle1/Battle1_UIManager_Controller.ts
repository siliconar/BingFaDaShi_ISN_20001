import { _decorator, Component, Node } from 'cc';
import { ManagerBase2 } from '../baseclass2/ManagerBase2';
import { Message2, MessageType2 } from '../baseclass2/Message2';
import { Battle1_MessageCenter } from './Battle1_MessageCenter';
const { ccclass, property } = _decorator;

@ccclass('Battle1_UIManager_Controller')
export class Battle1_UIManager_Controller extends ManagerBase2 {

    // 单例
    static Instance: Battle1_UIManager_Controller

    protected onLoad(): void {
        super.onLoad();
        Battle1_UIManager_Controller.Instance = this;
    }

    // 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnMessageType() {
        return MessageType2.Manager_UI;
    }
    // 处理消息(等待后续重载)
    _processMessage(msg: Message2) {
        // 暂时不需要处理
    }

    start() {
        // 注册父节点
        // 注册messagecenter
        Battle1_MessageCenter.Instance.RegisterReceiver(this)
    }



}


