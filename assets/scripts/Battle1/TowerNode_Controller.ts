import { _decorator, Component, Label, math, Node, NodeEventType, Sprite, input, Input, EventTouch, Vec3, Collider2D, IPhysics2DContact, Contact2DType, CCInteger, director, Director, UITransform } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
import { DrawLineMaskManager_Controller2 } from './DrawLineMaskManager_Controller2';
import { LinesManager_Controller } from './LinesManager_Controller';
import { TowerManager_Controller } from './TowerManager_Controller';
import { ArmyCatalogManager_Controller } from '../sodiers/ArmyCatalogManager_Controller';
import { baseSoldier1 } from '../baseclass3/baseSoldier1';
import { IAttackable } from '../Spells/IAttackable';
import { ISpell } from '../Spells/ISpell';
import { SpellEffectCatalogManager_Controller } from '../Spells/SpellEffectCatalogManager_Controller';
import { BattleSourceManager_Controller } from '../ChooseBattle1/BattleSourceManager_Controller';
const { ccclass, property } = _decorator;

@ccclass('TowerNode_Controller')
export class TowerNode_Controller extends GObjectbase1 implements IAttackable {

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
    LevelThreshold: number[] = [15, 45, 90];



    cur_ActiveTowerID:number;          // 当前激活的塔图片的编号
    private readonly bias_towerID2pic:number=0;       // towerID和塔图片在child位置的换算关系
    child_label: Label = null;      // 塔上的数字

    HasSpaceConnect: boolean = true;   // 是否允许发射线

    local_collider: Collider2D = null;  // 碰撞器

    readonly beAble_Gua_Soildier:boolean = true;  // 塔是否可以挂兵牌

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

        // 变量初始化
        this.cur_ActiveTowerID = this.bias_towerID2pic;   //  当前激活的塔图片的编号，注意这个是默认值，和下面换图片无关，必须给，否则报错
        // 换图片
        this.ChangeImage(this.cur_Tower_Level, this.cur_Party)
        // 换数字
        this.ChangeLabel(this.cur_soldier_cnt)
    }

    update(deltaTime: number) {


        // 如果被冰冻了，啥都做不了了，返回吧
        if (this.cur_frozentime > 0) {
            this.cur_frozentime -= deltaTime;   // 减少冰冻时间

            if (this.cur_frozentime <= 0)  // 如果冻结时间从大于0，跳变为小于0，那么取消冰冻的effect
            {
                this.effect_Frozen.destroy()  // 摧毁这个法术
            }

            return;
        }

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

            if (conn_str_vec != undefined && conn_str_vec.length>0) {

                for (const i_conn of conn_str_vec) {

                    if (cnt_GenSoldier==0)  // 如果无兵可派，直接跳出。因为有可能本来3个连接，但是塔被打降级了，支撑不了3个连接了。
                        break;

                    this.sendSoldier(i_conn, soldierID)   // 派1个兵出去
                    cnt_GenSoldier-=1
                }
            }


            if (this.cur_soldier_cnt >= this.LevelThreshold[this.MaxLevel - 1] && conn_str_vec!=undefined && conn_str_vec.length>0)  // 如果士兵已经满了，且有连接，就不屯兵了，强行派发
            {
                console.log("强行发兵剩余:"+cnt_GenSoldier)
                this.schedule(function () {
                    
                    // 随机选一个目的地
                    const i_idx1 = Math.floor(Math.random() * conn_str_vec.length); // 随机生成一个索引
                    const i_conn1 = conn_str_vec[i_idx1]   // 随机选中一个连接
                    // 发兵
                    this.sendSoldier(i_conn1, soldierID)   // 派1个兵出去
                }, 0.3, cnt_GenSoldier-1)   // 注意shedule的执行次数要-1，否则会多一次
                cnt_GenSoldier = 0;

            }
            else // 如果士兵还没有满  或 虽然满了但没有连接(注意，没有连接会自动屯兵，但是屯不上，因此新增兵自动消失)
            {
                // 剩余的兵回归自身屯兵  或  继续强行出兵
                if (cnt_GenSoldier > 0) {
                    this._attack_bySoldier(cnt_GenSoldier)  // 利用这个函数，可以升级，还可以改标签
                    // this.cur_soldier_cnt += cnt_GenSoldier;
                    // this.ChangeLabel(this.cur_soldier_cnt);  // 记得更改标签
                    cnt_GenSoldier = 0;
                }
                else if (cnt_GenSoldier < 0) {
                    console.error("不应该出现这个, 说明connection的数量过多了") 
                }
            }


        }
    }

    // 派兵（不管数量，数量外部扣）
    private sendSoldier(toname: string, soldierID1: number) {

        // 判断数量够不够 ，同时扣数量
        let tmp_soldier_ID = soldierID1
        if(0==soldierID1)   // 如果是0号兵,无限，不需要判断
        {
            tmp_soldier_ID = soldierID1
        }
        else  // 如果不是0号兵，需要判断兵够不够
        {
            const tmp_soldier_cnt = BattleSourceManager_Controller.Instance.GetCardCount(soldierID1,this.cur_Party)  // 查询还剩多少卡牌
            if(tmp_soldier_cnt==0 || tmp_soldier_cnt==undefined)  // 如果兵不足了，取消兵牌
            {
                this.ChangeSoldierType(0)  // 取消兵牌
                tmp_soldier_ID = 0;
            }
            else  // 如果兵足够,那么扣数量
            {
                BattleSourceManager_Controller.Instance.ChangeCardCount(tmp_soldier_ID,this.cur_Party,-1);
            }
        }


        // 出兵
        const world_startpos = this.node.getWorldPosition();
        const world_endpos = TowerManager_Controller.Instance.GetTowerScript(toname).node.getWorldPosition();
        ArmyCatalogManager_Controller.Instance.GenNewSoldier(tmp_soldier_ID, this.cur_Party, world_startpos, world_endpos, this.OwnNodeName, toname);   // 生产士兵
    }


    // 换图片
    private ChangeImage(level: number, party: number) {
        let id_child = -1;
        if (party == 1)   // 如果是自己
        {
            id_child = (level - 1) * 2 + this.bias_towerID2pic;
        }
        else if(party==0) // 如果是中立
        {
            id_child = 6+ this.bias_towerID2pic;
        }
        else // 如果是敌人
        {
            id_child = (level - 1) * 2 + 1 + this.bias_towerID2pic;
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


    // [重要]升级或易主（可以自动判断是否升级）
    private _attack_bySoldier(n1: number, sodier_party: number = 0) {
        let tmp_soldier_cnt = this.cur_soldier_cnt + n1;    // 先改变一下数量
        const cur_level_maxthreshold = this.LevelThreshold[this.cur_Tower_Level - 1]   // 当前等级最大屯兵数
        const cur_level_minthreshold = this.cur_Tower_Level > 1 ? this.LevelThreshold[this.cur_Tower_Level - 2] : 0   // 当前等级小屯兵数
        if (tmp_soldier_cnt >= cur_level_maxthreshold)    // 如果大于了阈值，说明要升级
        {
            if (this.cur_Tower_Level < this.MaxLevel)    // 如果还有升级空间，那就升级
            {
                console.log("升级")
                this.cur_Tower_Level++;   // 升级
                this.ChangeImage(this.cur_Tower_Level, this.cur_Party)    // 未完成，升级图片更改，注意不在这里更改，由update执行
            }
            else    // 如果没法升级了，那就什么都不做
            {
                tmp_soldier_cnt = cur_level_maxthreshold   // 就卡在这里，不能涨了
            }
        }
        else if (tmp_soldier_cnt <= cur_level_minthreshold)   // 如果要降级
        {
            if (this.cur_Tower_Level == 1)  // 如果已经是最低级了，说明要易主了
            {
                console.log("易主")
                tmp_soldier_cnt = 0;   //有可能被干成负数，所以要归零
                this.cur_Party = sodier_party   // 易主
                this.cur_Tower_Level = 1;
                this.cur_invtime = 0;  // 易主时刻，刷兵时间要归零
                this.ChangeImage(1, sodier_party)    // 易主图片更改，注意不在这里更改，由update执行
                this.ChangeSoldierType(0)    // 易主，切换普通兵，取消兵牌
                // 易主后，要删除它原来的发出的所有连接
                director.once(Director.EVENT_AFTER_PHYSICS, () => {
                    // 请注意，这里用director来处理，是因为Tube处理的时候，会删除线，线上有collider
                    // 但是，易主函数可能被碰撞回调调用，碰撞回调不能处理collider的开关。
                    LinesManager_Controller.Instance.RemoveConnections_fromTower(this.OwnNodeName)
                })

            }
            else  // 如果只降级，不易主
            {
                this.cur_Tower_Level -= 1;
                this.ChangeImage(this.cur_Tower_Level, this.cur_Party)    // 降级图片更改，注意不在这里更改，由update执行
            }
        }

        this.cur_soldier_cnt = tmp_soldier_cnt   // 最后改变士兵的数量
        this.health = this.cur_soldier_cnt;      // 接口里的值也得改
        this.ChangeLabel(this.cur_soldier_cnt);  // 记得更改标签
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
            // 未完成，这里逻辑有问题，我们应当改为兵直接进塔，除非塔满了

            if (soldier_script.toTowername != this.OwnNodeName)  // 如果士兵目标不是自己
            {
                return;
            }

            // 如果士兵的目标是自己，那就往下走

            if (soldier_script.soldier_party == this.cur_Party)  // 如果士兵是自己方的，交互
            {
                //     如果有路出去，那么直接出去
                const cur_lines_cnt = LinesManager_Controller.Instance.getConnectionCount(this.OwnNodeName)
                if (cur_lines_cnt > 0) {
                    // 先把士兵隐藏了，因为我们要调整它了
                    // 随机选择一个方向
                    const choosen_line = Math.floor(Math.random() * cur_lines_cnt)   // 随机选择哪条路线
                    const to_name1 = LinesManager_Controller.Instance.getConnections(this.OwnNodeName)[choosen_line]   // 提取目的地名称
                    const world_endpos1 = TowerManager_Controller.Instance.GetTowerScript(to_name1).node.getWorldPosition();

                    // 重新调整兵种的方向，让他继续行动
                    const playerID1 = this.cur_Party;
                    const world_startpos1 = this.node.getWorldPosition()

                    soldier_script.Init_Soldier(playerID1, world_startpos1, world_endpos1, this.OwnNodeName, to_name1)

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
                    this._attack_bySoldier(+1, this.cur_Party);
                    // 交还卡牌
                    if(soldier_script.soldier_ID!=0)   // 如果需要交还卡牌
                        BattleSourceManager_Controller.Instance.ChangeCardCount(soldier_script.soldier_ID,soldier_script.soldier_party,+1)
                } 
                return;
            }
            else if (soldier_script.soldier_party != this.cur_Party)  // 如果士兵是敌方的，交互
            {
                // 士兵是敌方的
                // 逻辑如下
                // 1. 士兵先把所有的法术对塔释放一遍
                for (const ispell of soldier_script.spells) {
                    soldier_script.castSpell(ispell, this)
                }
                // 1. 士兵对塔开始攻击
                soldier_script.castSpell(soldier_script.towerspell, this)  // 对这个塔释放，[对塔攻击]
                // 1. 士兵消失
                // 执行销毁
                soldier_script.local_collider.enabled = false;
                director.once(Director.EVENT_AFTER_PHYSICS, () => {
                    otherCollider.node.destroy()    // 直接把子弹销毁
                })
            }


        }   // if (soldier_script)




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







    //---- 兵种部分
    // 判断用什么兵种
    private _cur_soldierID: number = 0
    private _getCurSoldierID(): number {
        return this._cur_soldierID;
    }

    // 挂兵种
    ChangeSoldierType(soldierID: number) {
        if (soldierID == this._cur_soldierID)   // 如果没变化，就不需要替换兵牌了
            return;

        console.log(this.OwnNodeName + "替换兵种:" + soldierID)
        // 下一步就是替换兵种
        this._cur_soldierID = soldierID;
        // 塔上方兵牌显示
        const node_towercardholder = this.node.children[this.node.children.length - 2];  // 塔的卡托的node
        if (0 == soldierID)  // 如果是普通兵种，那么取消兵排显示
        {
            node_towercardholder.active = false;
        }
        else {
            // 获取兵牌
            const tmp_card = ArmyCatalogManager_Controller.Instance.CopyOneSoldierCard(soldierID)
            tmp_card.setPosition(0, -42);  // 设置大小
            tmp_card.setScale(1.2, 1.2); // 设置大小
            // 激活显示
            node_towercardholder.active = true;
            const node_cardbackground_player = node_towercardholder.children[0].children[0]   // 卡托的背景色
            const node_cardbackground_enemy = node_towercardholder.children[0].children[1]      // 卡托的背景色
            if (this.cur_Party == 1)  // 如果是player
            {
                node_cardbackground_player.active = true;
                node_cardbackground_enemy.active = false;

                node_cardbackground_player.removeAllChildren();  // 移除所有子节点
                node_cardbackground_player.addChild(tmp_card);
                tmp_card.active = true;
            }
            else  // 如果是敌人
            {
                node_cardbackground_player.active = false;
                node_cardbackground_enemy.active = true;

                node_cardbackground_enemy.removeAllChildren();  // 移除所有子节点
                node_cardbackground_enemy.addChild(tmp_card);
                tmp_card.active = true;
            }
        }
    }

    //--- 接口IAttackable实现
    health: number; // 健康值
    takeTowerDamage(damage: number, spell1: ISpell): void  // 可选，攻击塔时的方法
    {
        this._attack_bySoldier(-damage, spell1.fromParty)
    }

    cur_frozentime: number = 0; // 剩余被冻结时间
    effect_Frozen: Node;    // 非继承，冻结特效
    takeFrozen(frozentime: number, spell1: ISpell): void   // 可选，被冰冻的程度
    {
        if (frozentime == 0)
            return;


        // 添加冰冻法术
        if (this.cur_frozentime <= 0) // 如果还没有冰冻法术，那么就需要添加
        {
            const com_UITransform = this.node.getComponent(UITransform)
            this.effect_Frozen = SpellEffectCatalogManager_Controller.Instance.GenNewSpellEffect(spell1.spellname, com_UITransform.width, com_UITransform.height, this.node.getWorldPosition())
        }

        // 添加冰冻持续时间
        this.cur_frozentime = frozentime;
        console.log("塔-遭受冰冻法术:" + frozentime)
    }


}


