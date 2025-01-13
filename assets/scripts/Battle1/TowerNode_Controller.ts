import { _decorator, Component, Label, math, Node, NodeEventType, Sprite, input, Input, EventTouch, Vec3, Collider2D, IPhysics2DContact, Contact2DType, CCInteger, director, Director } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
import { DrawLineMaskManager_Controller2 } from './DrawLineMaskManager_Controller2';
import { LinesManager_Controller } from './LinesManager_Controller';
import { TowerManager_Controller } from './TowerManager_Controller';
import { ArmyCatalogManager_Controller } from '../sodiers/ArmyCatalogManager_Controller';
import { baseSoldier1 } from '../baseclass3/baseSoldier1';
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


    @property({ displayName: "出兵间隔" })
    Interval_Soidier: number = 10;   // 出兵间隔
    cur_invtime: number = 0;            // 当前的时间间隔

    @property({ displayName: "塔最大等级" })
    MaxLevel: number = 3;      // 塔最大等级
    @property({ type: [CCInteger], displayName: "屯兵等级阈值" })
    LevelThreshold: number[] = [40, 50, 60];



    cur_ActiveTowerID = 0;          // 当前激活的塔图片的编号
    child_label: Label = null;      // 塔上的数字

    HasSpaceConnect: boolean = true;   // 是否允许发射线

    local_collider: Collider2D = null;  // 碰撞器

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

        // 注销碰撞器
        if (this.local_collider) {
            this.local_collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
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



    start() {
        // 注册messagecenter
        MessageCenter3.getInstance(this.BelongedSceneName).RegisterReceiver(this.OwnNodeName, this);

        // 注册Manager
        TowerManager_Controller.Instance.RegisterReceiver(this.OwnNodeName, this);

        // 碰撞器
        this.local_collider = this.getComponent(Collider2D);
        if (this.local_collider) {
            this.local_collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }



        // 获取组件
        this.child_label = this.node.children[this.node.children.length - 1].getComponent(Label);


        // 换图片
        this.ChangeImage(this.cur_Tower_Level, this.cur_Party)
        // 换数字
        this.ChangeLabel(this.cur_soldier_cnt)
    }

    update(deltaTime: number) {


        // 中立不出兵
        if (this.cur_Party == 0)
            return;

        // 时间迭代
        this.cur_invtime += deltaTime

        // 如果到了出兵的时间
        if (this.cur_invtime > this.Interval_Soidier) {
            this.cur_invtime = 0;

            //--- 出兵


            // 计算自己可以出几个兵
            let cnt_GenSoldier = this.cur_Tower_Level;

            // 判断用什么兵种
            const soldierID = this._getCurSoldierID()

            // 迭代每个connection，出兵
            const conn_str_vec = LinesManager_Controller.Instance.getConnections(this.OwnNodeName)  // 获取这个塔有哪些连接
            if (conn_str_vec != undefined) {
                for (const i_conn of conn_str_vec) {

                    // 判断数量够不够 未完成
                    // 扣数量 未完成

                    const world_startpos = this.node.getWorldPosition();
                    const world_endpos = TowerManager_Controller.Instance.GetTowerScript(i_conn).node.getWorldPosition();
                    ArmyCatalogManager_Controller.Instance.GenNewSoldier(soldierID, this.cur_Party, world_startpos, world_endpos, this.OwnNodeName, i_conn);   // 生产士兵
                    cnt_GenSoldier--;
                }
            }

            // 剩余的兵回归自身屯兵
            if (cnt_GenSoldier > 0) {
                this.cur_soldier_cnt += cnt_GenSoldier;
                this.ChangeLabel(this.cur_soldier_cnt);  // 记得更改标签
                cnt_GenSoldier = 0;
            }
            else if (cnt_GenSoldier < 0) {
                console.error("不应该出现这个, 说明connection的数量过多了")
            }

        }
    }


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




    // 碰撞回调
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        

        // 如果碰撞的是个士兵
        const soldier_script = otherCollider.getComponent(baseSoldier1)
        if (soldier_script) {
            // 如果士兵的目标是自己，那么往下走，否则不执行
            // 如果士兵是敌方的，交互
            // 如果士兵是己方的，比较复杂
            // {
            //     如果有路出去，那么直接出去
            //     如果没有路出去，那么进入塔，回收装备
            //   我们这里改动了设计，让攻击者想攻击的时候可以攻击，别把兵都存着。之前是兵满了才会出去。
            // }

            if (soldier_script.toTowername != this.OwnNodeName)  // 如果士兵目标不是自己
            {
                return;
            }

            // 如果士兵的目标是自己，那就往下走

            if (soldier_script.soldier_party == this.cur_Party)  // 如果士兵是自己方的，交互
            {
                //     如果有路出去，那么直接出去
                const cur_lines_cnt = LinesManager_Controller.Instance.getConnectionCount(this.OwnNodeName)
                if (cur_lines_cnt>0) 
                {
                    // 先把士兵隐藏了，因为我们要调整它了
                    // 随机选择一个方向
                    const choosen_line = Math.floor(Math.random() * cur_lines_cnt)   // 随机选择哪条路线
                    const to_name1 =  LinesManager_Controller.Instance.getConnections(this.OwnNodeName)[choosen_line]   // 提取目的地名称
                    const world_endpos1 = TowerManager_Controller.Instance.GetTowerScript(to_name1).node.getWorldPosition();

                    // 重新调整兵种的方向，让他继续行动
                    const playerID1 = this.cur_Party;
                    const world_startpos1 = this.node.getWorldPosition()
                    
                    soldier_script.Init_Soldier(playerID1, world_startpos1,world_endpos1,this.OwnNodeName, to_name1)
                   
                    // 注意，这里不需要再换士兵位置了，因为Init里已经做过了

                    // 缓动系统启动
                    soldier_script.SoldierMove()
                }
                else  // 如果外来士兵没有路出去，那么直接进塔
                {
                    // 执行销毁
                    soldier_script.local_collider.enabled = false;
                    director.once(Director.EVENT_AFTER_PHYSICS, () => {
                        otherCollider.node.destroy()    // 直接把子弹销毁
            
                    })
                    // 驻兵+1
                    this.cur_soldier_cnt++;
                    this.ChangeLabel(this.cur_soldier_cnt)
                    // 未完成，需要把装备交付玩家 
                }
                return;
            }
            else if (soldier_script.soldier_party != this.cur_Party)  // 如果士兵是敌方的，交互
            {
                // 士兵是敌方的
                // 逻辑如下
                // 1. 敌方释放法术
                

            }


        }




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
    private _getCurSoldierID(): number {
        // 未完成,后续完成
        return 1;
    }

}


