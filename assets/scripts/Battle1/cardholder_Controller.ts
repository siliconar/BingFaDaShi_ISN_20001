import { _decorator, Animation, Component, EventTouch, Label, Node, Sprite } from 'cc';
import { CardManager_Controller } from './CardManager_Controller';
import { cardmask_Controller } from './cardmask_Controller';
import { TowerManager_Controller } from './TowerManager_Controller';
const { ccclass, property } = _decorator;

@ccclass('cardholder_Controller')
export class cardholder_Controller extends Component {


    //---- 内部变量
    private CardPicNode: Node = null;
    private card_silver_edge: Node = null;     // 卡牌银色边框

    private card_name: string
    private card_holderID: number      // 卡座编号
    private card_soldier_ID: number      // 卡座上的士兵编号


    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onCardTouchStart, this)
        // this.node.on(Node.EventType.TOUCH_MOVE, this.onCardTouchMove, this)
        // this.node.on(Node.EventType.TOUCH_END, this.onCardTouchEnd, this)
        // this.node.on(Node.EventType.TOUCH_CANCEL, this.onCardTouchCancel, this)
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onCardTouchStart, this)
    }

    start() {
        // 初始化组件
        this.card_silver_edge = this.node.children[1]
    }

    update(deltaTime: number) {

    }

    // 添加兵种
    Init_CardHolder(cardpic: Node, cardname: string, card_holderID: number, card_soldier_ID: number) {

        this.ClearCardPic();   // 移除当前的pic
        this.node.addChild(cardpic);  // 添加node
        this.card_holderID = card_holderID;        // 卡座ID
        this.card_name = cardname;   // 卡牌名称
        this.card_soldier_ID = card_soldier_ID;        // 卡牌士兵ID


        // 设置pic的大小
        cardpic.setScale(2, 2)
        cardpic.setPosition(3, -71, 0)
        cardpic.active = true;

    }

    // 更新数量
    UpdateCount(n1: number) {
        this.node.children[0].getComponent(Label).string = "x" + n1.toString()
        if (0 == n1) // 如果没牌了
        {
            this.node.getComponent(Sprite).grayscale = true;  // 设置灰色
            this.ChangeChosen(false)  // 取消选中
        }
        else {
            this.node.getComponent(Sprite).grayscale = false;
        }
    }

    // 清空card picture
    ClearCardPic() {
        if (this.CardPicNode != null) {
            this.CardPicNode.destroy()
            this.CardPicNode = null;
        }
    }



    // 选中与非选中 cardholder切换
    bCardChosen: boolean = false;    // 卡牌是否被选中
    ChangeChosen(b1: boolean) {
        if (this.bCardChosen == b1)   // 如果状态本来就是，那么不需要切换
            return;

        if (this.node.getComponent(Sprite).grayscale == true) // 如果是灰色的，说明不能选中
        {
            return;
        }

        this.bCardChosen = b1
        if (true == this.bCardChosen)  // 如果的确要变大
        {
            this.node.setScale(1.1, 1.1);
            this.card_silver_edge.active = true;


            // 激活mask
            CardManager_Controller.Instance.node_cardmask.getComponent(cardmask_Controller).SetActive_CardMask(true);
            // 告诉mask当前被选中的是哪个士兵
            CardManager_Controller.Instance.node_cardmask.getComponent(cardmask_Controller).SetMaskSoldierID(this.card_soldier_ID)
            // 所有自己的塔放出箭头
            for (const i_script of TowerManager_Controller.Instance.Receiver_List.values()) {
                // 如果不是自己的塔，不放出箭头
                if (i_script.cur_Party != 1)
                    return;

                // 如果不能挂兵牌，不放出箭头
                if (false == i_script.beAble_Gua_Soildier)
                    return;

                // 放箭头
                i_script.ShowArrow(true);
            }
        }
        else  // 如果是恢复原样
        {
            this.node.setScale(1, 1);
            this.card_silver_edge.active = false;

            // 不激活mask
            CardManager_Controller.Instance.node_cardmask.getComponent(cardmask_Controller).SetActive_CardMask(false);
            // 所有自己的塔切回箭头
            for (const i_script of TowerManager_Controller.Instance.Receiver_List.values()) {
                // 收箭头
                i_script.ShowArrow(false);
            }
        }
    }


    // 由card的on消息调用
    // 这里逻辑比较复杂
    // 首先，让卡牌变大或变小
    // 紧接着，让CardManager在全局贴上一层透明膜
    // 如果触点在塔附近，那么挂上塔
    // 否则，膜取消，卡牌变小
    onCardTouchStart(event: EventTouch) {
        // event.preventSwallow = true   //因为塔在Line之上，消息被塔捕获了，所以一定要转发消息

        // 如果是要选中卡座，那么首先得通知其他卡座取消选中
        if (false == this.bCardChosen)  // 如果是要选中卡座
        {
            CardManager_Controller.Instance.SetAllCards_Unchosen();  // 先取消所有的卡座的选中效果

        }
        this.ChangeChosen(!this.bCardChosen)

    }

}


