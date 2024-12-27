import { _decorator, Component, Node } from 'cc';
import { CancleLineManager_Controller } from './CancleLineManager_Controller';
const { ccclass, property } = _decorator;

@ccclass('test_btn_cancle')
export class test_btn_cancle extends Component {
    // start() {

    // }

    // update(deltaTime: number) {
        
    // }

    is_activeCancleLine:boolean = false;

    ActivateCancleLine()
    {
        CancleLineManager_Controller.Instance.SetActiveCancleLine(!this.is_activeCancleLine)
        this.is_activeCancleLine = !this.is_activeCancleLine;
    }


}


