import { _decorator, Component, Node } from 'cc';
import { UndirectedGraph } from './UndirectedGraph';
import { GameAI } from './GameAI';
import { GameStateX } from './GameStateX';
import { NodeManager } from './NodeManager';
import { TowerManager_Controller } from '../Battle1/TowerManager_Controller';
const { ccclass, property } = _decorator;

@ccclass('AI_Manager_Controller')
export class AI_Manager_Controller extends Component {


    //---- 单例
    static Instance: AI_Manager_Controller

    protected onLoad(): void {
        AI_Manager_Controller.Instance = this;

    }



    //---- 变量
    async_AIstatus_dps:number=0   // 异步ai当前工作状态 0是未工作，1是工作中，2是已经完成
    global_access_graph:UndirectedGraph = new UndirectedGraph();   // 无向图，这个是AI专用的，跟游戏无关。无向图表示“塔和塔可以连接，但不一定是真的连接了”

    gameAI1:GameAI = new GameAI(-1)   // AI内核
    bestState:GameStateX            // 用于存储ai运算结果

    start() {

        // 根据游戏中的情况，初始化无向图，无向图表示“塔和塔可以连接，但不一定是真的连接了”
        this.global_access_graph.addEdge(1,4)
        this.global_access_graph.addEdge(1,6)
        this.global_access_graph.addEdge(1,2)
        this.global_access_graph.addEdge(4,6)
        this.global_access_graph.addEdge(4,2)
        this.global_access_graph.addEdge(2,3)
        this.global_access_graph.addEdge(2,5)
        this.global_access_graph.addEdge(3,5)



    }

    update(deltaTime: number) {

        if(this.async_AIstatus_dps==0) // 如果ai未工作
        {
            // --------- 获取当前游戏状态
            //------ 创建节点
            // 从towermanager获取节点，然后转化成新节点
            let nodes:NodeManager[] = [];
            for (let i_node of TowerManager_Controller.Instance.Receiver_List.values()) {
                // 从towermanager获取节点，然后转化成新节点
                const i_nodeid = this.towerconvert_name2num(i_node.OwnNodeName)
                nodes.push(new NodeManager(i_nodeid, i_node.cur_Party, i_node.cur_soldier_cnt))
            }
            //------ 创建连接
            
            


            // 让ai开始工作
            this.async_AIstatus_dps=1;
            this.runAI(new GameStateX(nodes,))
        }
        else if(this.async_AIstatus_dps==1)  // 如果ai工作中
        {
            // 什么也不做
        }
        else if(this.async_AIstatus_dps==2)  // 如果ai已经完成
        {
            // 收取结果
            // 重置状态
            this.async_AIstatus_dps=0
        }
        
    }


    async runAI(currentState:GameStateX)
    {
        this.async_AIstatus_dps=1;  // 标记ai状态为工作中

        this.bestState = this.gameAI1.dfs(currentState,3,this.global_access_graph)

        console.log("dps end")
        this.async_AIstatus_dps=2;  // 标记ai状态为已完成
    }

    sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    towerconvert_name2num(towername:string):number
    {
        switch(towername)
        {
            case "TowerNode1":
                return 1
            case "TowerNode2":
                return 2
            case "TowerNode3":
                return 3
            case "TowerNode4":
                return 4
            case "TowerNode5":
                return 5
            case "TowerNode6":
                return 6
            case "TowerNode7":
                return 7
            case "TowerNode8":
                return 8
            case "TowerNode9":
                return 9
            case "TowerNode10":
                return 10
            case "TowerNode11":
                return 11              
        }
    }
    towerconvert_num2name(towerID:number):string
    {
        let tmpstr = "TowerNode"
        tmpstr += towerID.toString()

        return tmpstr
    }

    

}


