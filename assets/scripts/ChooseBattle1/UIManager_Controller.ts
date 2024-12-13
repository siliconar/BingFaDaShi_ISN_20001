import { _decorator, Component, Node } from 'cc';
import { ManagerBase2 } from '../baseclass2/ManagerBase2';
import { Message2, MessageType2 } from '../baseclass2/Message2';
const { ccclass, property } = _decorator;

@ccclass('UIManager_Controller')
export class UIManager_Controller extends ManagerBase2 {


    // 单例
    static Instance: UIManager_Controller

    protected onLoad(): void {
        super.onLoad();
        UIManager_Controller.Instance = this;
    }

    // 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnMessageType() {
        return MessageType2.Manager_UI;
    }
    // 处理消息(等待后续重载)
    _processMessage(msg: Message2) {

    }

    start() {
        // 注册父节点
        // this.node.parent.getComponent(ManagerBase2).RegisterReceiver(this)
        注册messagecenter
    }

    // update(deltaTime: number) {

    // }




}


