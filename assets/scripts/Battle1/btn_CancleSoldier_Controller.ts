import { _decorator, Component, Node } from 'cc';
import { CardManager_Controller } from './CardManager_Controller';
import { cardmask_Controller } from './cardmask_Controller';
const { ccclass, property } = _decorator;

@ccclass('btn_CancleSoldier_Controller')
export class btn_CancleSoldier_Controller extends Component {
    // start() {

    // }

    // update(deltaTime: number) {
        
    // }


    // 是否是激活取消兵牌模式
    isCancleMode:boolean = false;  

    // 手动取消已经挂上的兵牌
    Manual_Cancle_Tower_CardHolder()
    {
        this.isCancleMode = !this.isCancleMode   // 切换状态


        // 未完成，这块逻辑，激活完马上又不激活，有点怪

        if( true == this.isCancleMode )  // 如果现在是想手动取消
        {
            console.log("激活")
            // 激活mask
            CardManager_Controller.Instance.node_cardmask.getComponent(cardmask_Controller).SetActive_CardMask(true);
            // 告诉mask当前被选中的是哪个士兵
            CardManager_Controller.Instance.node_cardmask.getComponent(cardmask_Controller).SetMaskSoldierID(0)
            this.isCancleMode = !this.isCancleMode   // 切换状态
        }
        else // 如果现在是关闭
        {
            console.log("不激活")
            // 不激活mask
            CardManager_Controller.Instance.node_cardmask.getComponent(cardmask_Controller).SetActive_CardMask(false);
        }
    }


    // 取消选中
    Btn_UnChosen()
    {
        
    }

}


