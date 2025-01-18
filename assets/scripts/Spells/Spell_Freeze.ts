import { ISpell } from './ISpell';
import { IAttackable } from './IAttackable';

export class Spell_Freeze implements ISpell {


    private _frozenlevel: number; // 被冰冻的程度  1=20%  2=50% 3=0.8%
    private _frozen_probability: number;  // 概率被冰冻概率
    private _frozentime: number; // 冻结时间
    constructor() {
        this.spellname = "Freeze";
    }

    public SetDamage(level1: number, fromname: string, fromparty: number) {
        this._frozenlevel = level1;
        this.fromName = fromname;
        this.fromParty = fromparty;

        switch (level1) {
            case 1:
                this._frozentime = 3;
                this._frozen_probability = 0.2;
                break;
            case 2:
                this._frozentime = 3;
                this._frozen_probability = 0.5;
                break;
            case 3:
                this._frozentime = 3;
                this._frozen_probability = 0.8;
                break;
            default:
                this._frozentime = 3;
                this._frozen_probability = 0;
        }
    }

    // 实现ISpell接口部分
    spellname: string;
    fromName: string;
    fromParty: number;
    apply(target: IAttackable): void {


        // 根据被冰冻的概率计算
        if (Math.random() < this._frozen_probability)   // 如果小于概率，那就是抽中了
        {
            target.takeFrozen(this._frozentime, this);    // 施放法术
        }

        // 如果没抽中，啥也不做

    }
}


