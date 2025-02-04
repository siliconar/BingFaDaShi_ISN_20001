import { _decorator, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ProcessBarManager_Controller')
export class ProcessBarManager_Controller extends Component {

    //---- 单例
    static Instance: ProcessBarManager_Controller

    protected onLoad(): void {
        ProcessBarManager_Controller.Instance = this;

    }

    //---- 变量
    Node_PlayerSplash:Node = null;
    Node_EnemySplash:Node = null;
    Node_NeutralSplash:Node = null;


    start() {
        this.Node_PlayerSplash = this.node.children[1].children[0];
        this.Node_EnemySplash = this.node.children[1].children[2];
        this.Node_NeutralSplash = this.node.children[1].children[1];
    }

    // update(deltaTime: number) {
        
    // }



    UpdateProcessImage(widthplayer:number,widthenemy:number,widthneutral:number)
    {
        this.Node_PlayerSplash.getComponent(UITransform).width = widthplayer
        this.Node_EnemySplash.getComponent(UITransform).width = widthenemy 
        this.Node_NeutralSplash.getComponent(UITransform).width = widthneutral

        // 还得设置中立的位置
        const tmp_pos = this.Node_NeutralSplash.getPosition()
        this.Node_NeutralSplash.setPosition(widthplayer,tmp_pos.y,tmp_pos.z)   // 以player的宽度作为起点
    }


}


