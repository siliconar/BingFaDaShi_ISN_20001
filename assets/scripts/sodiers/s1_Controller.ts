import { _decorator, Component, Node } from 'cc';
import { interface_soldierbatter } from '../baseclass3/interface_soldierbatter';
const { ccclass, property } = _decorator;

@ccclass('s1_Controller')
export class s1_Controller extends Component implements interface_soldierbatter {



    @property
    HP: number = 1

    @property
    Attack: number = 1

    @property
    Defend: number = 1

    //---- 内部变量
    soldier_party: number = 0   // 士兵的阵营 1自己 0中立  -1无


    //--- 接口interface_soldierbatter变量
    nameID: string;
    cur_health: number;




    // 吸血

    // 反弹

    start() {

    }

    update(deltaTime: number) {

    }



    // 设置
    SetSoldierPath() {

    }

    // 开始行动
    SoldierMove() {

    }

    // --- 接口interface_soldierbatter函数
    attack(): number {
        // 吸血攻击逻辑
        return Math.floor(Math.random() * 8) + 8; // 随机伤害 8-16
    }

    takeDamage(damage: number): void {
        // this.health -= damage;
    }


}


