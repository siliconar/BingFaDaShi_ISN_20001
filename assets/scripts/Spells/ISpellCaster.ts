import { IAttackable } from "./IAttackable";
import { ISpell } from "./ISpell";


// 定义释放法术接口
interface SpellCaster {
    // mana: number; // 魔法值

    spells: ISpell[];
    castSpell(spell: ISpell, target: IAttackable): void;
  }