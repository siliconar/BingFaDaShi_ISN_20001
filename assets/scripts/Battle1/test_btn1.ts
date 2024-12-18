import { _decorator, Component, Node } from 'cc';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
const { ccclass, property } = _decorator;

@ccclass('test_btn1')
export class test_btn1 extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }


    bshow:boolean = false;

    onClick_btn1()
    {

        this.bshow = !this.bshow;
        // 消息中心发送消息，开关所有箭头测试
        MessageCenter3.getInstance("Battle1").SendCustomerMessage("",["TowerManager"],1,this.bshow)

    }

}


