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



    // // 碰撞回调
    // onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    //     super.onBeginContact(selfCollider, otherCollider, contact)
    //     console.log("继承类碰撞")
    // }



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


