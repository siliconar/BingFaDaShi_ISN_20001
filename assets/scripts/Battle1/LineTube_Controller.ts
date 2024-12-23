import { _decorator, Component, Node } from 'cc';
import { TowerGraph } from '../baseclass3/TowerGraph';
const { ccclass, property } = _decorator;

@ccclass('LineTube_Controller')
export class LineTube_Controller extends Component {

    // 注意
    // 管道是我们自己提出的一个概念
    // 管道连接了两个塔A，B，是承载连接线的上层节点,管道只管图像，其他都不管，拓扑图记录在上层manager中
    // 不管A->B的连接，还是B->A的连接，抑或是双向连接，都存在于一个管道中
    // 管道没有方向



    //---- 变量
    private graph1:TowerGraph = new TowerGraph(true);    // 记录管道中的连接


    //---- 重载



    



    start() {

    }

    update(deltaTime: number) {
        
    }

    // 让管道建立一个有向连接
    EstablishConnection(from_name:string, to_name:string)
    {
        // this.graph1 未完成
        console.log("管道建立连接"+from_name+" -> "+to_name)
    }

    // 让管道删除一个有向连接
    DisConnection(from_name:string, to_name:string)
    {
        console.log("管道删除连接"+from_name+" -> "+to_name)
    }



}


