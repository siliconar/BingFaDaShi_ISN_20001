import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, tween, Tween, Vec3 } from 'cc';
import { interface_soldierbatter } from './interface_soldierbatter';
import { Utils } from './Utils';
const { ccclass, property } = _decorator;

@ccclass('baseSoldier1')
export class baseSoldier1 extends Component implements interface_soldierbatter {



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

    local_collider: Collider2D = null;


    //--- 接口interface_soldierbatter变量
    nameID: string;
    cur_health: number;



    protected onDestroy(): void {
        // 注销碰撞器
        if (this.local_collider) {
            this.local_collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    start() {
        // 碰撞器
        this.local_collider = this.getComponent(Collider2D);
        if (this.local_collider) {
            this.local_collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    update(deltaTime: number) {

    }



    // 设置
    Init_Soldier(partyID: number, world_startpos1: Vec3, world_endpos1: Vec3, fromTowername: string, toTowername: string) {

        // 先把缓动系统停了
        if(this.mytween!=null)
        {
            this.mytween.stop()
            this.mytween = null;
        }

        this.nameID = this.node.name;
        this.soldier_party = partyID;
        this.fromTowername = fromTowername;
        this.toTowername = toTowername;

        let world_startpos = world_startpos1.clone()
        let world_endpos = world_endpos1.clone()
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

        const diff_pos = world_startpos.add(this.node.getPosition().multiplyScalar(-1)).multiplyScalar(-1)   // 注意这个运算会改变vec3的值
        const end_pos_local = world_endpos.add(diff_pos);   // 注意这个运算会改变vec3的值

        // 设置缓动系统
        this.mytween = tween(this.node)
        const pathtime = Utils.Cal_time_bypos(world_startpos, world_endpos, this.Speed)
        const action = tween(this.node).to(pathtime, { position: end_pos_local })
        this.mytween.then(action)    // 添加action队列
    }

    // 开始行动
    SoldierMove() {
        this.mytween.start()
    }

    // 停止行动
    // SoldierStop()
    // {
    //     this.mytween.stop()
    // }

    // ChangeWorldPos(worldpos:Vec3)
    // {
    //     console.log("士兵改变位置")
    //     this.node.setWorldPosition(worldpos)
    // }

    // 碰撞回调
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        const soldier_script = otherCollider.getComponent(baseSoldier1)
        if (soldier_script)  // 如果碰撞体是一个士兵
        {
            console.log("士兵碰撞")

        }



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


