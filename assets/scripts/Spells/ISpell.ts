import { IAttackable } from "./IAttackable";



export interface ISpell {
    spellname: string;
    apply(target: IAttackable): void; // 法术对目标的效果,这个去调用IAttack各种攻击方式实现
  }