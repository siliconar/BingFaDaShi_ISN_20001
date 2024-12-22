import { _decorator, Component, director, Node, input, Input, EventTouch } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
import { TowerGraph } from '../baseclass3/TowerGraph';
import { ConnectionInfo1 } from '../baseclass3/ConnectionInfo1';
import { TowerManager_Controller } from './TowerManager_Controller';
const { ccclass, property } = _decorator;

@ccclass('LinesManager_Controller')
export class LinesManager_Controller extends GObjectbase1 {


    //---- 单例
    static Instance: LinesManager_Controller

    protected onLoad(): void {
        super.onLoad();
        LinesManager_Controller.Instance = this;

        // 清空表
        this.ConnectionInfo2.clearAll()
    }


    //---- 变量
    ConnectionInfo2: ConnectionInfo1 = new ConnectionInfo1(true)  // 用一个【有向图】来表示连接




    // ----- 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnNodeName(): string {
        return "LinesManager"
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


    // update(deltaTime: number) {

    // }




}


