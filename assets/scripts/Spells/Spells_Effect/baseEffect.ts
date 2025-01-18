import { _decorator, Component, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('baseEffect')
export class baseEffect extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }


    InitEffect(w1:number, h1:number, world_pos:Vec3)
    {
        // 设置大小
        this.node.getComponent(UITransform).setContentSize(w1,h1);  
        // 设置位置
        this.node.setWorldPosition(world_pos);
    }


    StartEffect()
    {
       
    }











}


