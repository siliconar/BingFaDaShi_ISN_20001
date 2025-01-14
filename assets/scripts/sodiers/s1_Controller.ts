import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, tween, Tween, Vec3 } from 'cc';
import { interface_soldierbatter } from '../baseclass3/interface_soldierbatter';
import { Utils } from '../baseclass3/Utils';
import { TowerNode_Controller } from '../Battle1/TowerNode_Controller';
import { baseSoldier1 } from '../baseclass3/baseSoldier1';
import { ISpell } from '../Spells/ISpell';
import { Spell_Physical } from '../Spells/Spell_Physical';
import { IAttackable } from '../Spells/IAttackable';
import { Spell_toTowerAttack } from '../Spells/Spell_toTowerAttack';
const { ccclass, property } = _decorator;

@ccclass('s1_Controller')
export class s1_Controller extends baseSoldier1  {





    @property({ displayName: "攻击力" })
    Attack: number = 1

    @property({ displayName: "对塔攻击力" })
    TowerAttack:number =1;

    @property({ displayName: "防御力" })
    Defend: number = 5


    protected onDestroy(): void {

        super.onDestroy();


    }


    start() {
        super.start()

        // 设置法术
        this.basicspell1.SetDamage(this.Attack,this.node.name, this.soldier_party);
        this.towerspell.SetDamage(this.TowerAttack,this.node.name, this.soldier_party);
    }

    update(deltaTime: number) {
        super.update(deltaTime)
    }



    // 碰撞回调，继承类要重载
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        const soldier_script = otherCollider.getComponent(baseSoldier1)
        if (soldier_script)  // 如果碰撞体是一个士兵
        {
            // 士兵是敌对的，且目的地是自己的塔，那么才发生交互
            // 只有uuid小的那个人执行代码，大的那个不执行
            if(soldier_script.soldier_party!=this.soldier_party && soldier_script.toTowername==this.fromTowername && selfCollider.uuid< otherCollider.uuid)
            {
                console.log("s1士兵碰撞")
            }

            需要测试一下拐弯士兵是否能碰撞
            但是目前士兵速度不对
            
        }
    }



    //----- 注意接口部分，继承类是一定要重载的
    //--- 接口IAttackable实现
    // @property({ displayName: "士兵生命" })
    health: number =1; // 健康值
    takePhysicalDamage(damage: number, spell1:ISpell): void  // 被物理攻击时的方法
    {
        console.log("士兵s1-物理伤害")
        this.health -= (damage-this.Defend);
    }

    //--- 接口ISpellCaster实现
    basicspell1 = new Spell_Physical();
    towerspell = new Spell_toTowerAttack();
    spells: ISpell[] = [];     // 其他一次性法术
    castSpell(spell: ISpell, target: IAttackable): void   
    {
        // 继承类要判断要不要改动
        spell.apply(target);   // 释放法术
    }

}


