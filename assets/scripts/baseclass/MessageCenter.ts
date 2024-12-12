import { _decorator } from 'cc';
import { ManagerBase } from './ManagerBase';
import { Message } from './Message';
const { ccclass, property } = _decorator;

@ccclass('MessageCenter')
export class MessageCenter {

    // 管理类列表
    static Manager_List:ManagerBase[] = [];

    // 发送消息，任何人都可以给MessageCenter发消息，由MessageCentre往下转发
    static TransferMessage(msg:Message)
    {
        for(let i_manager of this.Manager_List)
        {
            i_manager.ReceiveMessage(msg);
        }
    }


    // 组装一个消息，然后转发
    static SendCustomerMessage(type: number, command:number, content:any)
    {
        let msg1 = new Message(type,command, content)
        this.TransferMessage(msg1);
    }

    
} 


