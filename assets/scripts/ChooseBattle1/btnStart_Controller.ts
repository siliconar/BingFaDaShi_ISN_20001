import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('btnStart_Controller')
export class btnStart_Controller extends Component {

    

    start() {

    }

    update(deltaTime: number) {
        
    }



    onClick_ChooseBattle()
    {
        // 播放shader动画


        // 延时加载场景
        director.loadScene("Battle1")
    }

}


