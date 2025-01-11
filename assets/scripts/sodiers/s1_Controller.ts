import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, tween, Tween, Vec3 } from 'cc';
import { interface_soldierbatter } from '../baseclass3/interface_soldierbatter';
import { Utils } from '../baseclass3/Utils';
import { TowerNode_Controller } from '../Battle1/TowerNode_Controller';
import { baseSoldier1 } from '../baseclass3/baseSoldier1';
const { ccclass, property } = _decorator;

@ccclass('s1_Controller')
export class s1_Controller extends baseSoldier1  {











    protected onDestroy(): void {

        super.onDestroy();


    }


    start() {
        super.start()


    }

    update(deltaTime: number) {
        super.update(deltaTime)
    }



    // // 碰撞回调
    // onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    //     super.onBeginContact(selfCollider, otherCollider, contact)
    //     console.log("继承类碰撞")
    // }











}


