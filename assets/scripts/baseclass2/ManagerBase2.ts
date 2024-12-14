import { _decorator, Component } from 'cc';
import { ComponentBase2 } from './ComponentBase2';
import { Message2, MessageType2 } from './Message2';

const { ccclass, property } = _decorator;

@ccclass('ManagerBase')
export class ManagerBase2 extends ComponentBase2 {

    // 管理消息接收者的数组
    Receiver_List: ComponentBase2[] = [];

    // 注册消息监听
    RegisterReceiver(node:ComponentBase2)
    {
        this.Receiver_List.push(node);
    }

    // 重写：接受消息，带转发功能
    ReceiveMessage(msg:Message2)
    {
        // 判断消息类型，只接受自己的消息
        if(msg.Type[0] != this.OwnMessageType)
            return;

        // 调取基类,处理消息
        super.ReceiveMessage(msg);

        // 转发消息，记得先把自己的消息头去掉
        // 去掉自己的路由头
        let newmsg = new Message2(msg.Type,msg.Command,msg.Content)
        newmsg.Type.shift() // 删除第一个路由

        // 转发为所有注册者，让他们自己判断是不是自己的消息
        for(let i_receiver of this.Receiver_List)
        {
            i_receiver.ReceiveMessage(newmsg);
        }


    }


}


