import { IAttackable } from "./IAttackable";

// 主要是运算出伤害有多少

export interface ISpell {
    spellname: string;
    fromName: string;
    fromParty: number;
    apply(target: IAttackable): void; // 法术对目标的效果,这个去调用IAttack各种攻击方式实现
  }