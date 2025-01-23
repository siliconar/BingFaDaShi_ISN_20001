import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BlackMaskManager_Controller')
export class BlackMaskManager_Controller extends Component {





    //---- 单例
    static Instance: BlackMaskManager_Controller

    protected onLoad(): void {
        BlackMaskManager_Controller.Instance = this;

    }
    protected onDestroy(): void {

    }

    //---- 内部变量
    Node_blackmask:Node = null;



    start() {

        this.Node_blackmask = this.node.children[0];
    }

    // update(deltaTime: number) {
        
    // }


    SetBlackMaskActive(bactive:boolean)
    {
        this.Node_blackmask.active = bactive;
    }

}


