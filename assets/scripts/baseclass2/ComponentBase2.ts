import { _decorator, Component } from 'cc';
import { Message2, MessageType2 } from './Message2';
const { ccclass, property } = _decorator;

@ccclass('ComponentBase')
export class ComponentBase2 extends Component {


    //--- 注意
    // 继承类首先要注册自己
    // 要重载_setOwnMessageType ，设定自己的消息类型
    // 其次重载_processMessage

    // 只接受那种类型的消息
    OwnMessageType:MessageType2; 
    
    // 自身注册得到的ID，实际是在父节点列表中的位置，用于非广播消息使用
    RegisterID:number = -1
    
    protected onLoad(): void {
        // 每次实例化的时候，都要指定自己接收消息的类型
        this.OwnMessageType = this._setOwnMessageType()
    }


    // 设置自己接受消息的类型，等待继承重写。
    _setOwnMessageType()
    {
        return MessageType2.Type_Empty;
    }

    // 接收消息(等待其他基类重载)
    ReceiveMessage(msg:Message2)
    {
        // 判断消息类型，只接受自己的消息
        if(msg.Type[0] != this.OwnMessageType)
            return;

        this._processMessage(msg);
    }

    // 处理消息(等待后续重载)
    _processMessage(msg:Message2)
    {
    }
    

    
}


