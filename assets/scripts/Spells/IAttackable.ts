import { ISpell } from "./ISpell";



export interface IAttackable {
    health: number; // 健康值
    
    // magicResistance: number; // 魔法防御值，范围 0~1（0 表示无防御，1 表示完全免疫）

    //----- 所有的法术在下面拓展
    takePhysicalDamage?(damage: number, spell1:ISpell): void;  // 被物理攻击时的方法
    takeTowerDamage?(damage: number, spell1:ISpell): void;  // 可选，攻击塔时的方法

    cur_frozentime?: number; // 剩余被冻结时间
    takeFrozen?(frozentime:number, spell1:ISpell):void;   // 可选，被冰冻的程度
  }



// export abstract class IAttackable
// {
//     health: number; // 健康值

//       //----- 所有的法术在下面拓展
//     abstract takePhysicalDamage(damage: number): void;  // 被物理攻击时的方法
  

// }