import { _decorator, Component, instantiate, Node, Vec3 } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
import { SoldierManager_Controller } from '../Battle1/SoldierManager_Controller';
import { s1_Controller } from './s1_Controller';
const { ccclass, property } = _decorator;

@ccclass('ArmyCatalogManager_Controller')
export class ArmyCatalogManager_Controller extends GObjectbase1 {


    //---- 单例
    static Instance: ArmyCatalogManager_Controller

    protected onLoad(): void {
        super.onLoad();
        ArmyCatalogManager_Controller.Instance = this;

    }


    //---- 变量


    // ----- 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnNodeName(): string {
        return "ArmyCatalogManager"
    }
    // 处理消息(等待后续重载)
    _processMessage(msg: Message3) {
        // 消息列表
        // 暂时没啥

    }


    // 生产一个兵(士兵id，阵营，起点，终点, 所属塔，攻击塔)
    GenNewSoldier(soldierid: number, partyid: number, world_startpos: Vec3, world_endpos: Vec3, fromTowername: string, toTowername: string) {

        // 建设兵
        let nodeCopy = this._copyOneSoldier(soldierid);

        // 挂节点
        SoldierManager_Controller.Instance.node.addChild(nodeCopy)

        // 设置行动，出发
        nodeCopy.getComponent(s1_Controller).Init_Soldier(partyid,world_startpos,world_endpos,fromTowername, toTowername);
        nodeCopy.getComponent(s1_Controller).SoldierMove();


    }



    // 复制一个士兵
    private _copyOneSoldier(soldierid: number): Node
    {
        let nodeCopy = instantiate(this.node.children[soldierid-1]);

        return nodeCopy;
    }





    start() {
        // 注册messagecenter
        MessageCenter3.getInstance(this.BelongedSceneName).RegisterReceiver(this.OwnNodeName, this);
    }

    update(deltaTime: number) {

    }
}


