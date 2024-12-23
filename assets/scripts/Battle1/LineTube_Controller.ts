import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LineTube_Controller')
export class LineTube_Controller extends Component {

    // 注意
    // 管道是我们自己提出的一个概念
    // 管道连接了两个塔A，B
    // 不管A->B的连接，还是B->A的连接，抑或是双向连接，都存在于一个管道中
    // 管道没有方向


    //---- 变量



    //---- 重载



    



    start() {

    }

    update(deltaTime: number) {
        
    }

    // 让管道建立一个有向连接
    EstablishConnection(from_name:string, to_name:string)
    {

    }

    // 让管道删除一个有向连接
    DisConnection(from_name:string, to_name:string)
    {

    }



}


