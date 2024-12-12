import { _decorator, Component } from 'cc';
import { ComponentBase } from './ComponentBase';
import { Message, MessageType } from './Message';
import { MessageCenter } from './MessageCenter';
const { ccclass, property } = _decorator;

@ccclass('ManagerBase')
export class ManagerBase extends ComponentBase {

    // 管理消息接收者的数组
    Receiver_List: ComponentBase[] = [];

    // 只接受那种类型的消息
    OwnMessageType:MessageType;  



    protected onLoad(): void {
        // 每次实例化的时候，都要指定自己接收消息的类型
        this.OwnMessageType = this._setOwnMessageType()
        // 每次实例化的时候，都要注册到消息中心MessageCenter中
        MessageCenter.Manager_List.push(this);
    }

    // 设置自己接受消息的类型，等待继承重写。
    _setOwnMessageType()
    {
        return MessageType.Type_Empty;
    }

    

    // 注册消息监听
    RegisterReceiver(node:ComponentBase)
    {
        this.Receiver_List.push(node);
    }

    // 重写：接受消息
    ReceiveMessage(msg:Message)
    {
        super.ReceiveMessage(msg);
        // 判断消息类型，只接受自己的消息
        if(msg.Type != this.OwnMessageType)
            return;

        // 转发为所有注册者，让他们自己判断是不是自己的消息
        for(let i_receiver of this.Receiver_List)
        {
            i_receiver.ReceiveMessage(msg);
        }
    }


}


