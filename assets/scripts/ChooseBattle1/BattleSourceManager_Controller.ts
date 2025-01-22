import { _decorator, Component, director, game, Node } from 'cc';
import { CardManager_Controller } from '../Battle1/CardManager_Controller';
const { ccclass, property } = _decorator;

@ccclass('BattleSourceManager_Controller')
export class BattleSourceManager_Controller extends Component {
    //---- 单例
    static Instance: BattleSourceManager_Controller

    protected onLoad(): void {

        BattleSourceManager_Controller.Instance = this;

        // 声明常驻节点
        director.addPersistRootNode(BattleSourceManager_Controller.Instance.node);
    }
    protected onDestroy(): void {

    }

    //---- 内部变量
    map_HoldCard_player: Map<number, number> = new Map<number, number>();    // 玩家本局所持卡牌数量，key = soldierID value=数量
    map_HoldCard_enemy: Map<number, number> = new Map<number, number>();    // 玩家本局所持卡牌数量，key = soldierID value=数量

    map_cardPos_player:Map<number, number>= new Map<number, number>();      // 每一张卡座对应的牌 key=卡座位置   value = soldierID


    //---- 内部组件

    // 未完成，记得最后，要把Battle场景中的 BattleSourceManager 删除掉，这个是跨场景的




    start() {

        // 发牌  未完成
        this.test_givePlayerCard() 
        this.test_giveEnemyCard()

    }

    update(deltaTime: number) {

    }



    // 获取某个兵种数量
    GetCardCount(soldierID:number, soldierParty:number):number
    {
        let tmpmap;
        if(1 == soldierParty)  // 如果查询玩家阵营
        {
            tmpmap = this.map_HoldCard_player;
        }
        else
        {
            tmpmap = this.map_HoldCard_enemy;
        }

        const cnt1 = tmpmap.get(soldierID); // 查询
        if(undefined == cnt1)
            return 0;
        else
            return cnt1;
    }


    // 改变某个兵种数量
    ChangeCardCount(soldierID:number, soldierParty:number, delta_cnt:number)
    {
        let tmpmap;
        if(1 == soldierParty)  // 如果查询玩家阵营
        {
            tmpmap = this.map_HoldCard_player;
        }
        else
        {
            tmpmap = this.map_HoldCard_enemy;
        }

        const cnt1 = tmpmap.get(soldierID); // 查询
        if(undefined == cnt1)
        {
            console.error("严重错误，让不存在的兵种改变数量")
        }

        const finalcnt = cnt1+delta_cnt>0?  cnt1+delta_cnt:0    // 计算减少后的数量
        tmpmap.set(soldierID, finalcnt)   // 设置数量
        // 注意，如果是player，那么卡座也得设置
        this.change_holder_cnt(soldierID, finalcnt);
    }

    // 根据soldierID设置卡座显示的数量
    private change_holder_cnt(soldierID:number, cnt1:number)
    {
        for (const [i_holdID, i_soldierID] of this.map_cardPos_player.entries()) {
            if(soldierID == i_soldierID) // 如果找到了对应的卡座
            {
                // 改变这个卡座的数量
                CardManager_Controller.Instance.Update_One_Holder_Count(i_holdID, cnt1) 
                return;
            }
        }
        // 如果找遍了都没找到
        console.error("严重错误，让不存在的卡座改变数量,soldierID:" +soldierID)
    }

    // 测试发给玩家卡牌 未完成最后删除
    test_givePlayerCard() {
        this.map_cardPos_player.set(2, 1)               // 每一张卡座对应的牌 key=位置   value = soldierID
        this.map_HoldCard_player.set(1, 200);  // 玩家本局所持卡牌数量，key = soldierID value=数量
    }

    test_giveEnemyCard()
    {
        this.map_HoldCard_player.set(1, 200);  // 玩家本局所持卡牌数量，key = soldierID value=数量
    }
}


