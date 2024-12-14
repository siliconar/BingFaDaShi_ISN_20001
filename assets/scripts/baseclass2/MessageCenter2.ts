import { _decorator } from 'cc';
import { ManagerBase2 } from './ManagerBase2';
import { Message2 } from './Message2';

const { ccclass, property } = _decorator;

@ccclass('MessageCenter')
export class MessageCenter2 {

    // 管理类列表
    static Manager_List: ManagerBase2[] = [];




    // 注册消息监听
    static RegisterReceiver(node: ManagerBase2) {
        MessageCenter2.Manager_List.push(node);
    }

    // 发送消息，任何人都可以给MessageCenter发消息，由MessageCentre往下转发
    static TransferMessage(msg: Message2) {
        for (let i_manager of this.Manager_List) {
            i_manager.ReceiveMessage(msg);
        }
    }


    // 组装一个消息，然后转发
    static SendCustomerMessage(type: number[], command: number, content: any) {
        let msg1 = new Message2(type, command, content)
        this.TransferMessage(msg1);
    }


}


