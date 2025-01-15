import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, tween, Tween, Vec3 } from 'cc';
import { IAttackable } from '../Spells/IAttackable';
import { ISpell } from '../Spells/ISpell';
import { ISpellCaster } from '../Spells/ISpellCaster';
import { interface_soldierbatter } from './interface_soldierbatter';
import { Utils } from './Utils';
const { ccclass, property } = _decorator;

@ccclass('baseSoldier1')
export class baseSoldier1 extends Component implements IAttackable, ISpellCaster {



    MaxHP:number =1;
    Attack: number = 1
    TowerAttack:number =1;
    Defend: number = 1

    @property
    Speed: number = 120;


    //---- 内部变量
    soldier_party: number = 0   // 士兵的阵营 1自己 0中立  -1无
    mytween: Tween<Node> = null;        // 注册一个缓动系统
    fromTowername: string;          // 所属塔和要攻击的塔
    toTowername: string;            // 所属塔和要攻击的塔

    local_collider: Collider2D = null;



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

        // 初始化状态
        this.RecoverStatus()
    }

    update(deltaTime: number) {

    }



    // 设置
    Init_Soldier(partyID: number, world_startpos1: Vec3, world_endpos1: Vec3, fromTowername: string, toTowername: string) {

        // 先把缓动系统停了
        if (this.mytween != null) {
            this.mytween.stop()
            this.mytween = null;
        }


        this.soldier_party = partyID;
        this.fromTowername = fromTowername;
        this.toTowername = toTowername;


        // 移动到初始位置
        this.node.setWorldPosition(world_startpos1)

        // 设置动画   
        if (1 == partyID) {
            this.node.children[0].active = true;
        }
        else if (-1 == partyID) {
            this.node.children[1].active = true;
        }

        // 坐标转换
        let world_startpos_tmp = world_startpos1.clone()
        let world_endpos_tmp = world_endpos1.clone()
        const diff_pos = world_startpos_tmp.add(this.node.getPosition().multiplyScalar(-1)).multiplyScalar(-1)   // 注意这个运算会改变vec3的值
        const end_pos_local = world_endpos_tmp.add(diff_pos);   // 注意这个运算会改变vec3的值

        // 设置缓动系统
        this.mytween = tween(this.node)
        const pathtime = Utils.Cal_time_bypos(world_startpos1, world_endpos1, this.Speed)
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

    // 重设属性状态
    RecoverStatus()
    {
        this.health = this.MaxHP;
    }

    // 碰撞回调，继承类要重载
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        const soldier_script = otherCollider.getComponent(baseSoldier1)
        if (soldier_script)  // 如果碰撞体是一个士兵
        {
            console.log("基类士兵碰撞")

        }



    }


    //----- 注意接口部分，继承类是一定要重载的
    //--- 接口IAttackable实现
    health: number =1; // 健康值
    takePhysicalDamage(damage: number, spell1:ISpell): void  // 被物理攻击时的方法
    {
        console.log("士兵基类-物理伤害")
        this.health -= damage;
    }

    //--- 接口ISpellCaster实现
    basicspell:ISpell               // 基础攻击，这个对方不死，就一直放
    towerspell:ISpell               // 对塔攻击效果
    spells: ISpell[] = [];          // 这些只能释放一次
    castSpell(spell: ISpell, target: IAttackable): void   
    {
        // 继承类要判断要不要改动
        spell.apply(target);   // 释放法术
    }


}


