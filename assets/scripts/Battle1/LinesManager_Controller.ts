import { _decorator, Component, director, Node, input, Input, EventTouch } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
import { TowerGraph } from '../baseclass3/TowerGraph';
import { ConnectionInfo1 } from '../baseclass3/ConnectionInfo1';
import { TowerManager_Controller } from './TowerManager_Controller';
const { ccclass, property } = _decorator;

@ccclass('LinesManager_Controller')
export class LinesManager_Controller extends GObjectbase1 {


    //---- 单例
    static Instance: LinesManager_Controller

    protected onLoad(): void {
        super.onLoad();
        LinesManager_Controller.Instance = this;

        // 清空表
        this.ConnectionInfo2.clearAll()
    }


    //---- 变量
    ConnectionInfo2: ConnectionInfo1 = new ConnectionInfo1(true)  // 用一个【有向图】来表示连接




    // ----- 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnNodeName(): string {
        return "LinesManager"
    }
    // 处理消息(等待后续重载)
    _processMessage(msg: Message3) {
        // 消息列表
        // 暂时没啥

    }



    start() {

        // 注册messagecenter
        MessageCenter3.getInstance(this.BelongedSceneName).RegisterReceiver(this.OwnNodeName, this);



    }


    // update(deltaTime: number) {

    // }

    // 建立真实的单向连接
    CreateOneConnection(from_name: string, to_name: string) {


        //--- 下面绘制图像
        // 确定颜色

        // 如果toname是敌对塔
        // 如果有反向的connection，那么就做对半路程

        // 如果没有反向connection，那么直接全程链接过去

        // 如果toname是自己方塔
        // 如果有反向的connection，那么就删除原有的


        //--- 数据表中，添加真实连接
        this.ConnectionInfo2.addConnection(from_name, to_name)
    }


    // 删除一个单向连接
    RemoveOneConnection(from_name: string, to_name: string) {
        

        //-- 下面绘制图像
        // 如果有反向的connection，那么对方做全程

        // 数据表中，删除真实连接
    }

}


