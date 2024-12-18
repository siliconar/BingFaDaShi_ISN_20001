import { _decorator, Component, Label, math, Node, NodeEventType, Sprite, input, Input, EventTouch } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
const { ccclass, property } = _decorator;

@ccclass('TowerNode_Controller')
export class TowerNode_Controller extends GObjectbase1 {

    @property
    cur_soldier_cnt:number = 10;    // 塔中当前的士兵数量

    @property
    cur_Tower_Level:number = 2;           // 塔的等级

    @property
    cur_Party:number = -1;          // 塔所属阵营，-1 -2 -3 -4是敌人  0中立 1自己

    @property(Node)
    Arrow:Node = null;

    
    cur_ActiveTowerID = 0;          // 当前激活的塔的编号

    child_label:Label = null;

    protected onLoad(): void {
        super.onLoad()

        input.on(Input.EventType.c, this.onTouchMove,this);

        
    }
    
    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouchMove(event:EventTouch)
    {
        console.log(event.getDeltaX, event.getDeltaY)

    }

    start() {
        // 注册messagecenter
        MessageCenter3.getInstance(this.BelongedSceneName).RegisterReceiver(this.OwnNodeName, this);

        // 获取组件
        this.child_label = this.node.children[this.node.children.length-1].getComponent(Label);
        

        // 换图片
        this.ChangeImage(this.cur_Tower_Level, this.cur_Party)
        // 换数字
        this.ChangeLabel(this.cur_soldier_cnt)
    }

    update(deltaTime: number) {

    }

    // 重载
    // 设置自己接受消息的类型
    _setOwnNodeName():string
    {
        return this.node.name  // 塔node，使用自己的名称注册
    }

    // 处理消息
    _processMessage(msg: Message3) {
    }



    // 塔添加了兵,可能敌对，可能自己方
    // TowerConflictSoilder(dt_Soldier:number, Soldier_party:number)
    // {


    // }


    // 换图片
    private ChangeImage(level:number, party:number)
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

        this.node.children[this.cur_ActiveTowerID].active = false;  // 关闭当前塔的显示
        this.node.children[id_child].active = true;  // 激活要显示的塔的显示
        this.cur_ActiveTowerID = id_child;
    }


    // 替换数字
    private ChangeLabel(soldier_cnt:number)
    {
        this.child_label.string = soldier_cnt.toString();  // 最后一个节点一定是label
    }

    ShowArrow(bshow:boolean)
    {
        this.Arrow.active = bshow;
    }
}


