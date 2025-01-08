import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;



// 定义基础接口
export interface interface_soldierbatter {
    nameID: string;
    cur_health: number;
    attack: () => number; // 定义攻击方式
    takeDamage: (damage: number) => void; // 定义受伤逻辑
}