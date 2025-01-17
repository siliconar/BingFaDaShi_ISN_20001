import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, tween, Tween, Vec3, director, Director } from 'cc';
import { interface_soldierbatter } from '../baseclass3/interface_soldierbatter';
import { Utils } from '../baseclass3/Utils';
import { TowerNode_Controller } from '../Battle1/TowerNode_Controller';
import { baseSoldier1 } from '../baseclass3/baseSoldier1';
import { ISpell } from '../Spells/ISpell';
import { Spell_Physical } from '../Spells/Spell_Physical';
import { IAttackable } from '../Spells/IAttackable';
import { Spell_toTowerAttack } from '../Spells/Spell_toTowerAttack';
import { Spell_Freeze } from '../Spells/Spell_Freeze';
const { ccclass, property } = _decorator;

@ccclass('s1_Controller')
export class s1_Controller extends baseSoldier1  {



    @property({ displayName: "最大血量" })
    MaxHP:number =20;

    @property({ displayName: "攻击力" })
    Attack: number = 20 

    @property({ displayName: "对塔攻击力" })
    TowerAttack:number =1;

    @property({ displayName: "防御力" })
    Defend: number = 10
    private real_defend_factor:number;


    protected onDestroy(): void {

        super.onDestroy();


    }


    start() {
        super.start()

        // 设置法术
        this.basicspell.SetDamage(this.Attack,this.node.name, this.soldier_party);
        this.towerspell.SetDamage(this.TowerAttack,this.node.name, this.soldier_party);

        this.freezspell.SetDamage(3,this.node.name, this.soldier_party);   // 冰冻法术3级
        // 设置防御系数
        this.real_defend_factor = this.Defend/(this.Defend + 33)
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
                // 交互逻辑
                while(soldier_script.health>0 && this.health>0)  // 当两个人都活着，继续战斗
                {
                    this.castSpell(this.basicspell,soldier_script);   // 我方释放基础攻击
                    soldier_script.castSpell(this.basicspell,this);     // 敌方释放基础攻击
                    // 继续循环，看谁还活着
                }

                if(soldier_script.health<=0)   // 如果敌方死球了，把他干了
                {
                    director.once(Director.EVENT_AFTER_PHYSICS, () => {
                        otherCollider.node.destroy()    // 直接把子弹销毁
                    })
                }
                if(this.health<=0)  // 如果自己也死了，把自己也干了
                {
                    director.once(Director.EVENT_AFTER_PHYSICS, () => {
                        this.node.destroy()    // 直接把子弹销毁
                    })
                }

            }
            
        }
    }



    //----- 注意接口部分，继承类是一定要重载的
    //--- 接口IAttackable实现
    // @property({ displayName: "士兵生命" })
    health: number =1; // 健康值
    takePhysicalDamage(damage: number, spell1:ISpell): void  // 被物理攻击时的方法
    {
        console.log("士兵s1-互相物理伤害:damange"+damage+" res:"+(damage*(1-this.real_defend_factor)) + " factor:" +this.real_defend_factor)
        this.health -= (damage*(1-this.real_defend_factor));
    }

    //--- 接口ISpellCaster实现
    basicspell = new Spell_Physical();
    towerspell = new Spell_toTowerAttack();

    // 其他一次性法术设置，每个兵种不一样
    freezspell = new Spell_Freeze();
    
    spells: ISpell[] = [this.freezspell];     // 其他一次性法术
    castSpell(spell: ISpell, target: IAttackable): void   
    {
        // 继承类要判断要不要改动
        spell.apply(target);   // 释放法术
    }

}


