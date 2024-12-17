import { _decorator } from 'cc';
import { GObjectbase1 } from './GObjectbase1';
import { Message3 } from './Message3';


const { ccclass, property } = _decorator;

@ccclass('MessageCenter3')
export class MessageCenter3 {


    // --------工厂生产线<场景名，自己instance>
    static Map_Instance = new Map<string, MessageCenter3>();

    // 创建一个Instance，并且加入生产线队列，注意，这个外部不调用
    static createInstance(scenename1:string)
    {
        let tmp_instance = new MessageCenter3();
        MessageCenter3.Map_Instance.set(scenename1, tmp_instance)
    }

    // 调取某个场景的MessageCenter3
    static getInstance(scenename1:string) : MessageCenter3
    {
        if(!MessageCenter3.Map_Instance.has(scenename1))
        {
            MessageCenter3.createInstance(scenename1)
        }

        return MessageCenter3.Map_Instance.get(scenename1)
    }

    // 注意
    // 使用的办法是MessageCenter3.getInstance("场景1").RegisterReceiver()


    //---------- 消息中心Instance独有部分，非静态
    // GObjectbase1对象Hash表,<对象名称，instance>
    Hash_map = new Map<string, GObjectbase1>();

    // 注册消息监听
    RegisterReceiver(obj_name:string, node1: GObjectbase1) {
        this.Hash_map.set(obj_name, node1)
    }

    // 组装一个消息，然后发送给对应的对象
    SendCustomerMessage(senderID:string, receiverID_list:string[], command: number, content: any) {
        
        for (const i_receiver of receiverID_list)
        {
            let msg1 = new Message3(senderID, i_receiver, command, content)
            // 发送消息
            this.Hash_map.get(i_receiver).ReceiveMessage(msg1)
        }
    }


}


