import { _decorator, Component, Node } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
import { cardholder_Controller } from './cardholder_Controller';
import { ArmyCatalogManager_Controller } from '../sodiers/ArmyCatalogManager_Controller';
const { ccclass, property } = _decorator;

@ccclass('CardManager_Controller')
export class CardManager_Controller extends GObjectbase1 {


    //---- 单例
    static Instance: CardManager_Controller

    protected onLoad(): void {
        super.onLoad();
        CardManager_Controller.Instance = this;

    }
    protected onDestroy(): void {

    }

    //---- 内部变量
    map_playerHoldCard: Map<number, number> = new Map<number, number>();    // 玩家本局所持卡牌数量，key = soldierID value=数量
    map_cardPos:Map<number, number>= new Map<number, number>();      // 每一张卡座对应的牌 key=卡座位置   value = soldierID


    readonly Max_Num_CardHolder = 6;    // 卡座的最大数量，注意，这是个设定值，程序不可改变
    readonly idx_bias_cardholder = 2;   // 卡座偏移，也就是cardholder的0号，对应child的几号？

    //---- 内部组件
    node_cardmask:Node=null;   // cardmask组件

    // ----- 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnNodeName(): string {
        return "CardManager"
    }
    // 处理消息(等待后续重载)
    _processMessage(msg: Message3) {
        // 消息列表
        // 暂时没啥

    }





    start() {
        // 注册messagecenter
        MessageCenter3.getInstance(this.BelongedSceneName).RegisterReceiver(this.OwnNodeName, this);

        // 组件
        this.node_cardmask = this.node.children[0];

        this.test_givePlayerCard()     // 测试发给玩家卡牌,未完成，最后删除
        this.placeCards()    // 放置所有卡牌，未完成，最后删除
    }


    update(deltaTime: number) {

    }


    // 依据玩家所持卡牌给卡托放牌
    private placeCards() {


        for (let i = 0; i < this.Max_Num_CardHolder; i++) {

            const holderID = i;    // 当前卡托的ID
            const tmp_soldier_ID = this.map_cardPos.get(i);   // 获取卡托ID应当仿制的士兵

            if(undefined == tmp_soldier_ID)  // 如果这个卡托没放东西
            {
                continue;
            }

            // 往卡托里放士兵
            const cardholder_script = this.node.children[holderID+this.idx_bias_cardholder].getComponent(cardholder_Controller)  // 获取卡托的脚本
            this.node.children[holderID+this.idx_bias_cardholder].active = true;   // 激活卡座

            let tmp_soldier_pic = ArmyCatalogManager_Controller.Instance.CopyOneSoldierCard(tmp_soldier_ID)  // 获取兵的节点
            cardholder_script.Init_CardHolder(tmp_soldier_pic,"", holderID, tmp_soldier_ID)   // 让士兵添加进卡座

            // 设置卡座中士兵数量
            cardholder_script.UpdateCount(this.map_playerHoldCard.get(tmp_soldier_ID))
          }

    }


    // 所有卡座变为未选中状态
    SetAllCards_Unchosen()
    {
        // 遍历所有卡座
        for (let i_holdID = 0; i_holdID < this.Max_Num_CardHolder; i_holdID++) {
            if(false == this.node.children[i_holdID+this.idx_bias_cardholder].active)  // 如果卡托根本没激活，说明没东西
            {
                continue;
            }

            const cardscript = this.node.children[i_holdID+this.idx_bias_cardholder].getComponent(cardholder_Controller)
            cardscript.ChangeChosen(false);
        }
    }

    // // 激活CardMask
    // ActiveCardMask()
    // {
    //     this.node.children[1].active = true;
    // }


    // 测试发给玩家卡牌
    test_givePlayerCard() {
        this.map_cardPos.set(2,1)               // 每一张卡座对应的牌 key=位置   value = soldierID
        this.map_playerHoldCard.set(1, 200);  // 玩家本局所持卡牌数量，key = soldierID value=数量

        this.map_cardPos.set(0,1)           // 每一张卡座对应的牌 key=位置   value = soldierID
        this.map_playerHoldCard.set(1, 300);  // 玩家本局所持卡牌数量，key = soldierID value=数量
        
    }

}


