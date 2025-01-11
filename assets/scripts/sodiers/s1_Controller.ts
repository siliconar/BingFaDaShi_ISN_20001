import { _decorator, Component, Node, tween, Tween, Vec3 } from 'cc';
import { interface_soldierbatter } from '../baseclass3/interface_soldierbatter';
import { Utils } from '../baseclass3/Utils';
const { ccclass, property } = _decorator;

@ccclass('s1_Controller')
export class s1_Controller extends Component implements interface_soldierbatter {



    @property
    HP: number = 1

    @property
    Attack: number = 1

    @property
    Defend: number = 1

    @property
    Speed: number = 600;

    //---- 内部变量
    soldier_party: number = 0   // 士兵的阵营 1自己 0中立  -1无
    mytween: Tween<Node> = null;        // 注册一个缓动系统
    fromTowername: string;          // 所属塔和要攻击的塔
    toTowername: string;            // 所属塔和要攻击的塔

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
    Init_Soldier(partyID: number, world_startpos: Vec3, world_endpos: Vec3, fromTowername: string, toTowername: string) {
        this.nameID = this.node.name;
        this.soldier_party = partyID;
        this.fromTowername = fromTowername;
        this.toTowername = toTowername;


        // 移动到初始位置
        this.node.setWorldPosition(world_startpos)

        // 设置动画   
        if (1 == partyID) {
            this.node.children[0].active = true;
        }
        else if (-1 == partyID) {
            this.node.children[1].active = true;
        }

        // 坐标转换

        const diff_pos = world_startpos.add(this.node.getPosition().multiplyScalar(-1)).multiplyScalar(-1)
        const end_pos_local = world_endpos.add(diff_pos);

        // 设置缓动系统
        this.mytween = tween(this.node)
        const pathtime = Utils.Cal_time_bypos(world_startpos, world_endpos,this.Speed)
        const action = tween(this.node).to(pathtime, { position: end_pos_local })
        this.mytween.then(action)    // 添加action队列
    }

    // 开始行动
    SoldierMove() {
        this.mytween.start()
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


