import { _decorator, Component, Node } from 'cc';
import { Message2, MessageType2 } from '../baseclass2/Message2';
import { Battle1_MessageCenter } from './Battle1_MessageCenter';
import { ManagerBase2 } from '../baseclass2/ManagerBase2';
const { ccclass, property } = _decorator;

@ccclass('LinesManager_Controller')
export class LinesManager_Controller extends ManagerBase2 {


    // 单例
    static Instance: LinesManager_Controller

    protected onLoad(): void {
        super.onLoad();
        LinesManager_Controller.Instance = this;
    }

    // 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnMessageType() {
        return MessageType2.Manager_Tower;
    }
    // 处理消息(等待后续重载)
    _processMessage(msg: Message2) {
        // 暂时不需要处理
    }

    start() {
        // 注册父节点
        // 注册messagecenter
        Battle1_MessageCenter.Instance.RegisterReceiver(this)
        未完成
    }







    // start() {

    // }

    // update(deltaTime: number) {

    // }
}


