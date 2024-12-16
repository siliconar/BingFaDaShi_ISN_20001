import { _decorator, Component, Label, math, Node, NodeEventType, Sprite } from 'cc';
import { ComponentBase2 } from '../baseclass2/ComponentBase2';
import { ManagerBase2 } from '../baseclass2/ManagerBase2';
import { Message2, MessageType2 } from '../baseclass2/Message2';
const { ccclass, property } = _decorator;

@ccclass('TowerNode_Controller')
export class TowerNode_Controller extends ComponentBase2 {

    @property
    cur_soldier_cnt:number = 10;    // 塔中当前的士兵数量

    @property
    cur_Tower_Level:number = 2;           // 塔的等级

    @property
    cur_Party:number = -1;          // 塔所属阵营，-1 -2 -3 -4是敌人  0中立 1自己

    
    cur_ActiveTowerID = 0;          // 当前激活的塔的编号

    start() {
        // 注册自己
        this.node.parent.getComponent(ManagerBase2).RegisterReceiver(this)
        // 换图片
        this.ChangeImage(this.cur_Tower_Level, this.cur_Party)
        // 换数字
        this.ChangeLabel(20)
    }

    update(deltaTime: number) {

    }

    // 重载
    // 设置自己接受消息的类型
    _setOwnMessageType() {
        return MessageType2.Tower_TowerNode;
    }

    // 处理消息
    _processMessage(msg: Message2) {
    }


    // 换图片
    ChangeImage(level:number, party:number)
    {
        let id_child = -1;
        if(party == 1)   // 如果是自己
        {
            id_child = (level-1)*2;
        }
        else // 如果是敌人
        {
            id_child = (level-1)*2+1;
        }

        this.node.children[this.cur_ActiveTowerID].active = false;  // 关闭当前塔
        this.node.children[id_child].active = true;  // 激活要显示的塔
        this.cur_ActiveTowerID = id_child;
    }


    // 替换数字
    ChangeLabel(soldier_cnt:number)
    {
        this.node.children[this.node.children.length-1].getComponent(Label).string = soldier_cnt.toString();
        this.cur_soldier_cnt = soldier_cnt;
    }
}


