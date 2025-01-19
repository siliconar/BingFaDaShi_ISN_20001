import { _decorator, Component, EventTouch, Node } from 'cc';
import { TowerManager_Controller } from './TowerManager_Controller';
import { Utils } from '../baseclass3/Utils';
import { CardManager_Controller } from './CardManager_Controller';
const { ccclass, property } = _decorator;

@ccclass('cardmask_Controller')
export class cardmask_Controller extends Component {





    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onCardMaskTouchStart, this)

    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onCardMaskTouchStart, this)
    }






    start() {

    }

    update(deltaTime: number) {
        
    }


    //设置要替换的兵种
    private _chosen_soldierID:number = -1;
    SetSoldierID(id1:number)
    {
        this._chosen_soldierID = id1;
    }

    // 由card的on消息调用
    // 让CardManager在全局贴上一层透明膜
    // 如果触点在塔附近，那么挂上塔
    // 否则，膜取消，卡牌变小
    onCardMaskTouchStart(event: EventTouch) {
        // event.preventSwallow = true   //因为塔在Line之上，消息被塔捕获了，所以一定要转发消息

        this.node.active = false;
        // 判断出点是否在塔附近
        const towermap = TowerManager_Controller.Instance.Receiver_List
        for (const i_towerscript of towermap.values()) {
            
            const world_towerpos = i_towerscript.node.getWorldPosition()  // 塔的世界坐标
            const touchpos = event.getUILocation()

            // 未完成，这个位置还得调整一下，并没有覆盖塔
            if(Utils.calculate_dist32(world_towerpos, touchpos)<60)   // 如果跟塔的距离足够小，说明点中塔了
            {
                i_towerscript.ChangeSoldierType(this._chosen_soldierID)
            }

          }
        // 取消所有卡牌的选中
        CardManager_Controller.Instance.SetAllCards_Unchosen()

    }

}


