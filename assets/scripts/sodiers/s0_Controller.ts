import { _decorator, Component, Node } from 'cc';
import { baseSoldier1 } from '../baseclass3/baseSoldier1';
import { ISpell } from '../Spells/ISpell';
import { Spell_Physical } from '../Spells/Spell_Physical';
import { Spell_toTowerAttack } from '../Spells/Spell_toTowerAttack';
import { Spell_Freeze } from '../Spells/Spell_Freeze';
import { IAttackable } from '../Spells/IAttackable';
const { ccclass, property } = _decorator;

@ccclass('s0_Controller')
export class s0_Controller extends baseSoldier1 {




    @property({ displayName: "最大血量" })
    MaxHP: number = 5;

    @property({ displayName: "攻击力" })
    Attack: number = 4

    @property({ displayName: "对塔攻击力" })
    TowerAttack: number = 1;

    @property({ displayName: "防御力" })
    Defend: number = 1
    







    start() {
        super.start()

        // 设置法术
        this.basicspell.SetDamage(this.Attack, this.node.name, this.soldier_party);
        this.towerspell.SetDamage(this.TowerAttack, this.node.name, this.soldier_party);
        // 设置士兵ID
        this.soldier_ID = 0
    }

    update(deltaTime: number) {
        super.update(deltaTime)
    }


    //----- 注意接口部分，继承类是一定要重载的
    //--- 接口IAttackable实现
    // @property({ displayName: "士兵生命" })
    health: number = 1; // 健康值


    //--- 接口ISpellCaster实现
    basicspell = new Spell_Physical();
    towerspell = new Spell_toTowerAttack();

    // 其他一次性法术设置，每个兵种不一样
    spells: ISpell[] = [];     // 其他一次性法术

}


