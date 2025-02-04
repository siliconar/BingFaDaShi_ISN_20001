import { _decorator, Component, instantiate, Node } from 'cc';
import { TowerManager_Controller } from './TowerManager_Controller';
const { ccclass, property } = _decorator;

@ccclass('TowerBottomManager_Controller')
export class TowerBottomManager_Controller extends Component {


    //---- 单例
    static Instance: TowerBottomManager_Controller

    protected onLoad(): void {
        TowerBottomManager_Controller.Instance = this;
    }


    //---- 内部变量

    Node_towerbottom_base: Node = null;   // 塔底座的模板
    bInit:boolean = false;   // 是否初始化过

    start() {


        // 组件
        this.Node_towerbottom_base = this.node.children[0];




    }

    update(deltaTime: number) {


        if(this.bInit==false)
        {
        // 根据塔的位置，初始化所有的底座
            this.Init_All_TowerBottom()
            this.bInit = true;
        }


    }

    // 根据塔的位置，初始化所有的底座
    Init_All_TowerBottom() {
        const towermanager_script = TowerManager_Controller.Instance.Receiver_List;
        for (const iscript of towermanager_script.values()) {
            let newnode = instantiate(this.Node_towerbottom_base);
            this.node.addChild(newnode)

            newnode.setWorldPosition(iscript.node.getWorldPosition())

            newnode.active = true;
        }
    }


    // // 生产一个底座
    // GenNewTowerBottom()
    // {

    // }
}


