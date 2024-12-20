import { _decorator, Component, Node } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
import { TowerNode_Controller } from './TowerNode_Controller';
import { TowerGraph } from '../baseclass3/TowerGraph';
const { ccclass, property } = _decorator;

@ccclass('TowerManager_Controller')
export class TowerManager_Controller extends GObjectbase1 {

    //---- 单例
    static Instance: TowerManager_Controller

    protected onLoad(): void {
        super.onLoad();
        TowerManager_Controller.Instance = this;
    }

    //---- 变量
    towerGraph1:TowerGraph = new TowerGraph();   // 存储着所有塔的连接信息，每张图都不一样

    //----  重载
    // 设置自己接受消息的类型
    _setOwnNodeName():string
    {
        return this.node.name  // Manager，使用自己的名称注册
    }

    // 处理消息
    _processMessage(msg: Message3) {
        // 消息列表
        // cmd =1 所有塔节点执行箭头, Content= bool 开关


        if(1 == msg.Command) // cmd =1 所有塔节点执行箭头, Content= bool 开关
        {
            let bshow = msg.Content;
            for (const ichild of this.node.children) {
                ichild.getComponent(TowerNode_Controller).ShowArrow(bshow)
            } 
        }

    }




    start() {
        // 注册messagecenter
        MessageCenter3.getInstance(this.BelongedSceneName).RegisterReceiver(this.OwnNodeName, this);

        // 初始化塔信息
        this._init_TowerGraph();
    }

    // update(deltaTime: number) {
        
    // }


    // 初始化所有塔的连接信息，每张图都不一样
    private _init_TowerGraph()
    {
        if ("Battle1" == this.BelongedSceneName)
        {
            this.towerGraph1.clearAll();  // 先清空一下
            this.towerGraph1.addConnection("TowerNode1", "TowerNode2")
        }
    }

}


