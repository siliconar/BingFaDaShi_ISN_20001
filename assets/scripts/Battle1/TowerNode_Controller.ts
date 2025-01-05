import { _decorator, Component, Label, math, Node, NodeEventType, Sprite, input, Input, EventTouch } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
import { DrawLineMaskManager_Controller2 } from './DrawLineMaskManager_Controller2';
import { LinesManager_Controller } from './LinesManager_Controller';
import { TowerManager_Controller } from './TowerManager_Controller';
const { ccclass, property } = _decorator;

@ccclass('TowerNode_Controller')
export class TowerNode_Controller extends GObjectbase1 {

    @property
    cur_soldier_cnt: number = 10;    // 塔中当前的士兵数量

    @property
    cur_Tower_Level: number = 2;           // 塔的等级

    @property
    cur_Party: number = -1;          // 塔所属阵营，-1 -2 -3 -4是敌人  0中立 1自己

    @property(Node)
    Arrow: Node = null;


    @property
    Interval_Soidier:number = 3;   // 出兵间隔
    cur_invtime:number = 0;            // 当前的时间间隔


    cur_ActiveTowerID = 0;          // 当前激活的塔图片的编号
    child_label: Label = null;      // 塔上的数字

    HasSpaceConnect: boolean = true;   // 是否允许发射线


    protected onLoad(): void {
        super.onLoad()

        this.node.on(Node.EventType.TOUCH_START, this.onTowerTouchStart, this)
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTowerTouchMove, this)
        this.node.on(Node.EventType.TOUCH_END, this.onTowerTouchEnd, this)
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTowerTouchCancel, this)
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTowerTouchStart, this)
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTowerTouchMove, this)
        this.node.off(Node.EventType.TOUCH_END, this.onTowerTouchEnd, this)
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTowerTouchCancel, this)
    }

    start() {
        // 注册messagecenter
        MessageCenter3.getInstance(this.BelongedSceneName).RegisterReceiver(this.OwnNodeName, this);

        // 注册Manager
        TowerManager_Controller.Instance.RegisterReceiver(this.OwnNodeName, this);

        // 获取组件
        this.child_label = this.node.children[this.node.children.length - 1].getComponent(Label);


        // 换图片
        this.ChangeImage(this.cur_Tower_Level, this.cur_Party)
        // 换数字
        this.ChangeLabel(this.cur_soldier_cnt)
    }

    update(deltaTime: number) {

        // 时间迭代
        this.cur_invtime+=deltaTime

        // 如果到了出兵的时间
        if(this.cur_invtime > this.Interval_Soidier)
        {
            this.cur_invtime =0;

            //--- 出兵

            // 判断用什么兵种
            const soldierID = this._getCurSoldierID()
            

            // 迭代每个connection，出兵
            // for()
            // {
            //     // 建设兵

            //     // 扣数量 未完成

            //     // 挂节点

            //     // 设置动画   
            //     // 设置行动，出发
            // }

        }
    }

    // 重载
    // 设置自己接受消息的类型
    _setOwnNodeName(): string {
        return this.node.name  // 塔node，使用自己的名称注册
    }

    // 处理消息
    _processMessage(msg: Message3) {
        // cmd =1 该单个塔节点执行箭头, Content= bool 开关

        if (1 == msg.Command) // md =1 该单个塔节点执行箭头, Content= bool 开关
        {
            let bshow = msg.Content;
            this.ShowArrow(bshow)
        }


    }



    // 塔添加了兵,可能敌对，可能自己方
    // TowerConflictSoilder(dt_Soldier:number, Soldier_party:number)
    // {


    // }


    // 换图片
    private ChangeImage(level: number, party: number) {
        let id_child = -1;
        if (party == 1)   // 如果是自己
        {
            id_child = (level - 1) * 2;
        }
        else // 如果是敌人
        {
            id_child = (level - 1) * 2 + 1;
        }

        this.node.children[this.cur_ActiveTowerID].active = false;  // 关闭当前塔的显示
        this.node.children[id_child].active = true;  // 激活要显示的塔的显示
        this.cur_ActiveTowerID = id_child;
    }



    // 替换数字
    private ChangeLabel(soldier_cnt: number) {
        this.child_label.string = soldier_cnt.toString();  // 最后一个节点一定是label
    }

    ShowArrow(bshow: boolean) {
        this.Arrow.active = bshow;
    }

    // 由塔的on消息调用，给DrawLineMaskManager发消息
    onTowerTouchStart(event: EventTouch) {
        // event.preventSwallow = true   //因为塔在Line之上，消息被塔捕获了，所以一定要转发消息

        // 首先要判断是否还有连接的空间
        if (this.cur_Tower_Level <= LinesManager_Controller.Instance.getConnectionCount(this.OwnNodeName)) {
            // 如果没有空间了，不响应
            this.HasSpaceConnect = false;
            return;
        }
        else {
            // 如果有空间，那就开启连接
            this.HasSpaceConnect = true;

            let tx = this.node.getWorldPosition().x
            let ty = this.node.getWorldPosition().y
            tx = Math.floor(tx)
            ty = Math.floor(ty)
            DrawLineMaskManager_Controller2.Instance.arrow_Script.SetDrawStartPoint(this.OwnNodeName, tx, ty)
        }
    }

    // 由塔的on消息调用
    onTowerTouchMove(event: EventTouch) {

        // 如果塔空间满了，不允许发射射线，不响应
        if (false == this.HasSpaceConnect)
            return;

        // event.preventSwallow = true  //因为塔在Line之上，消息被塔捕获了，所以一定要转发消息
        let tx = event.getUILocation().x
        let ty = event.getUILocation().y
        tx = Math.floor(tx)
        ty = Math.floor(ty)
        DrawLineMaskManager_Controller2.Instance.arrow_Script.SetDrawEndPoint(tx, ty)
    }

    // 由塔的on消息调用
    onTowerTouchEnd(event: EventTouch) {
        // 如果塔空间满了，不允许发射射线，不响应
        if (false == this.HasSpaceConnect)
            return;

        // event.preventSwallow = true //因为塔在Line之上，消息被塔捕获了，所以一定要转发消息
        DrawLineMaskManager_Controller2.Instance.arrow_Script.StopDraw()
    }

    // 由塔的on消息调用
    onTowerTouchCancel(event: EventTouch) {
        // 如果塔空间满了，不允许发射射线，不响应
        if (false == this.HasSpaceConnect)
            return;
        // event.preventSwallow = true //因为塔在Line之上，消息被塔捕获了，所以一定要转发消息
        DrawLineMaskManager_Controller2.Instance.arrow_Script.StopDraw()
    }




    // 判断用什么兵种
    private _getCurSoldierID():number
    {
        // 未完成,后续完成
        return 0;
    }

}


