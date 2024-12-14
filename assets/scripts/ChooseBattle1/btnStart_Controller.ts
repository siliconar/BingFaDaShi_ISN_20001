import { _decorator, Component, Director, director, Node } from 'cc';
import { MessageCenter2 } from '../baseclass2/MessageCenter2';
import { MessageType2 } from '../baseclass2/Message2';
const { ccclass, property } = _decorator;

@ccclass('btnStart_Controller')
export class btnStart_Controller extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    onClick_ChooseBattle()
    {
        // 播放shader动画
        let mes_list = [MessageType2.Scene_Choose, MessageType2.Manager_UI, MessageType2.UI_SHaderMove]
        MessageCenter2.SendCustomerMessage(mes_list,1,1)

        // 延时加载场景
        this.scheduleOnce(function(){
            director.loadScene("Battle1")
        },0.5)   // 延时1秒加载场景
    }

    
}


