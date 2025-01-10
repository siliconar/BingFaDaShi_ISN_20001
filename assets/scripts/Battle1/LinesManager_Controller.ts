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
        if (this.ConnectionInfo3.hasConnection(from_name, to_name))
            return


        // 是否有管道？没有就新建一个
        if (!this.isTubeExist(from_name, to_name))   // 如果管道不存在
        {
            // 新建管道
            let newtube = instantiate(this.TubePrefab)  // 新建一个管道
            let tubename = Utils.generateUniqueString(from_name, to_name)
            newtube.name = tubename
            newtube.getComponent(LineTube_Controller).Init(from_name,to_name)

            this.node.addChild(newtube)

            let tubescript = newtube.getComponent(LineTube_Controller)
            this.TubeList.set(tubename, tubescript);        // 注册进管道管理列表里
            console.log("创建管道" + tubename)
        }


        //--- 数据表中，添加真实连接
        this.ConnectionInfo3.addConnection(from_name, to_name)

        //---- 让管道建立连接图像,
        const cur_TubeScript = this.TubeList.get(Utils.generateUniqueString(from_name, to_name))

        // 首先获取两个塔的party
        const towerscript_from = TowerManager_Controller.Instance.GetTowerScript(from_name)
        const towerscript_to = TowerManager_Controller.Instance.GetTowerScript(to_name)
        if (towerscript_from == undefined || towerscript_to == undefined)   // 安全检查
        {
            console.error("from或to塔不存在, 严重错误")
            return
        }
        const party_from = towerscript_from.cur_Party;   // 获取两个塔的party
        const party_to = towerscript_to.cur_Party;      // 获取两个塔的party

        // 如果有反向连接
        if (this.ConnectionInfo3.hasConnection(to_name, from_name)) {
            if (party_from == party_to)  // 如果是同一阵营，那么删除反向连接，重新构建一个
            {
                this.ConnectionInfo3.removeConnection(to_name, from_name)   // 删除反向连接
                //管道建立连接图像, 调用Utils.generateUniqueString是为了自动生成一个名字
                cur_TubeScript.ClearAllConnection()
                cur_TubeScript.EstablishSingleConnection(from_name, to_name)    // 建立单向连接
            }
            else // 如果不是同一阵营,要建立双向连接
            {
                //管道建立连接图像, 调用Utils.generateUniqueString是为了自动生成一个名字
                cur_TubeScript.ClearAllConnection()
                cur_TubeScript.EstablishDoubleConnection(from_name, to_name)    // 建立双向连接
            }
        }
        else // 如果没有反向连接，直接连过去就行
        {
            cur_TubeScript.EstablishSingleConnection(from_name, to_name)    // 建立单向连接
        }

    }


    // // 删除一个单向连接
    // RemoveOneConnection(from_name: string, to_name: string) {


    //     // 让管道删除连接图像
    //     this.TubeList.get(Utils.generateUniqueString(from_name, to_name)).DisConnection(from_name, to_name)

    //     // 数据表中，删除真实连接
    //     this.ConnectionInfo3.removeConnection(from_name, to_name)
    // }




    // 删除连接

    RemoveConnection_by_tubename_party(tubename: string, partyID: number) {

        const tubescript = this.TubeList.get(tubename)
        const tower1name = tubescript.Tower1name;
        const tower2name = tubescript.Tower2name;
        const tower1PartyID = tubescript.Tower1PartyID;
        const tower2PartyID = tubescript.Tower2PartyID;


        // 判断
        if(tower1PartyID == partyID &&this.ConnectionInfo3.hasConnection(tower1name,tower2name)) // 如果要删除的是从Tower1出发的线
        {
            tubescript.ClearAllConnection()  // 先把图像都删除，不管是不是有两条线
            if(this.ConnectionInfo3.hasConnection(tower2name,tower1name))  // 如果本来就有反向的连接
            {
                tubescript.EstablishSingleConnection(tower2name,tower1name)
            }
            this.ConnectionInfo3.removeConnection(tower1name, tower2name)   // 数据表中，删除真实连接
        }
        else if(tower2PartyID == partyID && this.ConnectionInfo3.hasConnection(tower2name,tower1name)) // 如果要删除的是从Tower2出发的线
        {
            tubescript.ClearAllConnection()  // 先把图像都删除，不管是不是有两条线
            if(this.ConnectionInfo3.hasConnection(tower1name,tower2name))  // 如果本来就有反向的连接
            {
                tubescript.EstablishSingleConnection(tower1name,tower2name)
            }
            this.ConnectionInfo3.removeConnection(tower2name, tower1name)   // 数据表中，删除真实连接
        }
        else
        {
            console.error("RemoveConnection中,"+tubename+"不含有partyID")
        }

        if(partyID ==1)
            this.cur_changecolor_name = ""


        // 测试，打印
        // this.ConnectionInfo3.printGraph()

    }



    // 获取某节点作为起点，的连接数
    getConnectionCount(towername: string): number {
        return this.ConnectionInfo3.getConnectionCount(towername)
    }


    // 获取某节点作为起点，的连接，注意不是连接数
    getConnections(towername:string):string[]
    {
        return this.ConnectionInfo3.getConnections(towername)
    }




    // 管道是否存在，注意，管道没有方向
    isTubeExist(name1: string, name2: string): boolean {

        let tmpname = Utils.generateUniqueString(name1, name2)
        return this.TubeList.has(tmpname)
    }


    // 通知tube，让某一条玩家的线变色,只对player有效
    cur_changecolor_name: string = "";       // 当前变色的tube
    ChangeColor_Tube(tubename: string) {
        if (this.cur_changecolor_name == tubename)   // 如果已经变色了，那么返回，不要重复执行
            return;
        // 那么现在需要变色，首先我们把老的取消变色
        this.StopChangeColor_Tube()
        // 新的tube变色
        this.TubeList.get(tubename).ChangeColor_playerLine()
        this.cur_changecolor_name = tubename;   // 记录下当前变色的tube
    }

    // 通知tube，停止变色,只对player有效
    StopChangeColor_Tube() {
        if (this.cur_changecolor_name == "")   // 如果目前没有变色的tube
            return;

        this.TubeList.get(this.cur_changecolor_name).StopChangeColor_playerLine()   // 取消变色
        this.cur_changecolor_name = "";
    }
}


