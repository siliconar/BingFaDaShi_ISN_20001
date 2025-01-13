import { ISpell } from "./ISpell";



export interface IAttackable {
    health: number; // 健康值
    frozen?: boolean; // 是否被冻结
    // magicResistance: number; // 魔法防御值，范围 0~1（0 表示无防御，1 表示完全免疫）

    //----- 所有的法术在下面拓展
    takePhysicalDamage(damage: number): void;  // 被物理攻击时的方法
    takeFrozen?(level:number):void;   // 可选，被冰冻的程度
  }



// export abstract class IAttackable
// {
//     health: number; // 健康值

//       //----- 所有的法术在下面拓展
//     abstract takePhysicalDamage(damage: number): void;  // 被物理攻击时的方法
  

// }