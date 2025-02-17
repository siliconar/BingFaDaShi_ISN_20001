import { IAttackable } from "./IAttackable";
import { ISpell } from "./ISpell";


// 物理攻击
export class Spell_Physical implements ISpell {

    private _physical_DamageNum:number; // 物理攻击伤害


    constructor() {
        this.spellname = "Physical";
    }

    public SetDamage(n1:number, fromname:string, fromparty:number)
    {
        this._physical_DamageNum = n1;
        this.fromName = fromname;
        this.fromParty = fromparty;
    }
    // 实现ISpell接口部分
    spellname: string;
    fromName: string;
    fromParty: number;
    apply(target: IAttackable): void {
        target.takePhysicalDamage(this._physical_DamageNum, this);  // 物理攻击
    }

}