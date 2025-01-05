import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('s1_Controller')
export class s1_Controller extends Component {



    @property
    HP:number = 1

    @property
    Attack:number =1

    @property
    Defend:number = 1



    soldier_party:number = 0

    // 吸血

    // 反弹

    start() {

    }

    update(deltaTime: number) {
        
    }



    // 设置
    SetSoldierPath()
    {

    }

    // 开始行动
    SoldierMove()
    {

    }




}


