import { IAttackable } from "./IAttackable";
import { ISpell } from "./ISpell";


// 物理攻击
export class Spell_toTowerAttack implements ISpell {

    private _toTower_DamageNum:number; // 对塔攻击伤害

    constructor() {
        this.spellname = "toTowerAttack";
    }

    public SetDamage(n1:number, fromname:string, fromparty:number)
    {
        this._toTower_DamageNum = n1;
        this.fromName = fromname;
        this.fromParty = fromparty;
    }
    // 实现ISpell接口部分
    spellname: string;
    fromName: string;
    fromParty: number;
    apply(target: IAttackable): void {
        target.takeTowerDamage(this._toTower_DamageNum, this);  // 对塔攻击
    }
}