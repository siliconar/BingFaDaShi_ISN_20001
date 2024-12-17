import { _decorator, Component, director, Node } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
const { ccclass, property } = _decorator;

@ccclass('LinesManager_Controller')
export class LinesManager_Controller extends GObjectbase1 {


    // 单例
    static Instance: LinesManager_Controller

    protected onLoad(): void {
        super.onLoad();
        LinesManager_Controller.Instance = this;
    }

    // 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnNodeName():string
    {
        return "LinesManager"
    }
    // 处理消息(等待后续重载)
    _processMessage(msg: Message3) {
        // 暂时不需要处理
    }

    start() {
        
        // 注册messagecenter
        MessageCenter3.getInstance(this.BelongedSceneName).RegisterReceiver(this.OwnNodeName, this);
    }


    // update(deltaTime: number) {

    // }
}


