import { _decorator, Component, Director, director, Node } from 'cc';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
const { ccclass, property } = _decorator;

@ccclass('btnStart_Controller')
export class btnStart_Controller extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    onClick_ChooseBattle()
    {
        // 消息中心发送消息，让shader开始合并
        MessageCenter3.getInstance("ChooseBattle1").SendCustomerMessage("",["shader_1"],1,"")

        // 延时加载场景
        this.scheduleOnce(function(){
            director.loadScene("Battle1")
        },0.5)   // 延时1秒加载场景
    }

    
}


