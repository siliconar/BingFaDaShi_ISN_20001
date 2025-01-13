import { IAttackable } from "./IAttackable";
import { ISpell } from "./ISpell";


// 物理攻击
export class Spell_Physical implements ISpell {

    private _physical_DamageNum:number; // 物理攻击伤害

    constructor() {
        this.spellname = "Physical";
    }

    public SetDamage(n1:number)
    {
        this._physical_DamageNum = n1;
    }
    // 实现ISpell接口部分
    spellname: string;
    apply(target: IAttackable): void {
        target.takePhysicalDamage(this._physical_DamageNum);  // 物理攻击
    }

}