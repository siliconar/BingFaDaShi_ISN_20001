import { _decorator, Component, director, Node, input, Input, EventTouch, Prefab, instantiate } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
import { TowerGraph } from '../baseclass3/TowerGraph';
import { ConnectionInfo1 } from '../baseclass3/ConnectionInfo1';
import { TowerManager_Controller } from './TowerManager_Controller';
import { LineTube_Controller } from './LineTube_Controller';
import { Utils } from '../baseclass3/Utils';
const { ccclass, property } = _decorator;

@ccclass('LinesManager_Controller')
export class LinesManager_Controller extends GObjectbase1 {


    //---- 单例
    static Instance: LinesManager_Controller

    protected onLoad(): void {
        super.onLoad();
        LinesManager_Controller.Instance = this;

        // 清空表
        // this.ConnectionInfo2.clearAll()
        this.ConnectionInfo3.clearAll()
    }


    //---- 变量


    @property(Prefab)
    TubePrefab: Prefab = null;       // 管道的预制体



    // ConnectionInfo2: ConnectionInfo1 = new ConnectionInfo1(true)  // 用一个【有向图】来表示连接
    private ConnectionInfo3: TowerGraph = new TowerGraph(true)  // 用一个【有向图】来表示连接

    private TubeList: Map<string, LineTube_Controller> = new Map<string, LineTube_Controller>();   // 注册所有的Tube


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

        // 判断管道中的链接是否已经存在 
        if(this.ConnectionInfo3.hasConnection(from_name,to_name))
            return


        // 是否有管道？没有就新建一个
        if (!this.isTubeExist(from_name, to_name))   // 如果管道不存在
        {
            // 新建管道
            let newtube = instantiate(this.TubePrefab)  // 新建一个管道
            let tubename = Utils.generateUniqueString(from_name, to_name)
            newtube.name = tubename
            this.node.addChild(newtube)

            let tubescript = newtube.getComponent(LineTube_Controller)
            this.TubeList.set(tubename, tubescript);        // 注册进管道管理列表里
            console.log("创建管道" + tubename)
        }

        // 让管道建立连接图像,调用Utils.generateUniqueString是为了自动生成一个名字
        this.TubeList.get(Utils.generateUniqueString(from_name, to_name)).EstablishConnection(from_name, to_name)// 未完成，不能这么写


        // 如果toname是敌对塔
        // 如果有反向的connection，那么就做对半路程

        // 如果没有反向connection，那么直接全程链接过去

        // 如果toname是自己方塔
        // 如果有反向的connection，那么就删除原有的,然后直接全程连接过去
        // 如果没有反向connection，那么直接全程链接过去

        //--- 数据表中，添加真实连接
        // this.ConnectionInfo2.addConnection(from_name, to_name)
        this.ConnectionInfo3.addConnection(from_name, to_name)
    }


    // 删除一个单向连接
    RemoveOneConnection(from_name: string, to_name: string) {


        // 让管道删除连接图像
        this.TubeList.get(Utils.generateUniqueString(from_name, to_name)).DisConnection(from_name, to_name)

        // 数据表中，删除真实连接
        this.ConnectionInfo3.removeConnection(from_name, to_name)
    }


    // 获取某节点作为起点，的连接数
    getConnectionCount(towername: string): number {
        return this.ConnectionInfo3.getConnectionCount(towername)
    }

    // 管道是否存在，注意，管道没有方向
    isTubeExist(name1: string, name2: string): boolean {

        let tmpname = Utils.generateUniqueString(name1,name2)
        return this.TubeList.has(tmpname)
    }

}


