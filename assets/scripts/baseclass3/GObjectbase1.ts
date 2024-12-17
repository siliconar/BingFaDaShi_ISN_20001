import { _decorator, Component } from 'cc';
import { Message3 } from './Message3';
const { ccclass, property } = _decorator;

@ccclass('GObjectbase1')
export class GObjectbase1 extends Component {


    // 自我名称，用于路由
    OwnNodeName:string;

    // 设置自己名称，所有实例不可重复（需要每个Instance重写）
    _setOwnNodeName():string
    {
        return "Unknown"
    }


    protected onLoad(): void {
        // 每次实例化的时候，都要指定设置自己名称
        this.OwnNodeName = this._setOwnNodeName()
    }




    //--- 注意
    // 继承类首先要注册自己
    // 要重载_setOwnMessageType ，设定自己的消息类型
    // 其次重载_processMessage



    // 接收消息(等待其他基类重载)
    ReceiveMessage(msg:Message3)
    {
        this._processMessage(msg);
    }

    // 处理消息(等待后续重载)
    _processMessage(msg:Message3)
    {
    }
    

    
}


