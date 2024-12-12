import { _decorator, Component } from 'cc';
import { Message } from './Message';
const { ccclass, property } = _decorator;

@ccclass('ComponentBase')
export class ComponentBase extends Component {

    // 接收消息(等待后续重载)
    ReceiveMessage(msg:Message)
    {

    }


}


