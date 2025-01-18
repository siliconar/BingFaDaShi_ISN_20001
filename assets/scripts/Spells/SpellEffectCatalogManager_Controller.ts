import { _decorator, Component, instantiate, Node, Vec3 } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
import { EffectManager_Controller } from '../Battle1/EffectManager_Controller';
import { baseEffect } from './Spells_Effect/baseEffect';
const { ccclass, property } = _decorator;

@ccclass('SpellEffectCatalogManager_Controller')
export class SpellEffectCatalogManager_Controller extends GObjectbase1 {


    //---- 单例
    static Instance: SpellEffectCatalogManager_Controller

    protected onLoad(): void {
        super.onLoad();
        SpellEffectCatalogManager_Controller.Instance = this;

    }


    //---- 变量
    map_effect_idx: Map<string, number> = new Map();    // 法术名称和渲染序号的查询

    // ----- 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnNodeName(): string {
        return "SpellEffectCatalogManager"
    }
    // 处理消息(等待后续重载)
    _processMessage(msg: Message3) {
        // 消息列表
        // 暂时没啥

    }



    // 生产一个法术渲染(法术名称，阵营，起点，终点, 所属塔，攻击塔)
    GenNewSpellEffect(spellname:string,w1:number,h1:number,world_pos:Vec3):Node {

        // 确定effect ID
        const effectID = this.map_effect_idx.get(spellname)

        // 复制一个法术效果
        let effectCopy = this._copyOneEffct(effectID);

        // 挂节点
        EffectManager_Controller.Instance.node.addChild(effectCopy)

        // 设置行动，出发
        effectCopy.active = true;
        effectCopy.getComponent(baseEffect).InitEffect(w1,h1,world_pos)
        effectCopy.getComponent(baseEffect).StartEffect();

        return effectCopy;
    }


    // 复制一个effect
    private _copyOneEffct(spellID: number): Node
    {
        let nodeCopy = instantiate(this.node.children[spellID]);

        return nodeCopy;
    }






    start() {
        // 注册messagecenter
        MessageCenter3.getInstance(this.BelongedSceneName).RegisterReceiver(this.OwnNodeName, this);

        // 初始化effect序号
        this.map_effect_idx.set("Freeze",0)
    }


}


