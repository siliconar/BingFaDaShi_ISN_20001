import { _decorator, Component, Node } from 'cc';
import { ComponentBase } from '../baseclass/ComponentBase';
const { ccclass, property } = _decorator;

@ccclass('ShaderCover_Controller')
export class ShaderCover_Controller extends ComponentBase {
    // start() {

    // }


    @property
    MoveSpeed:number = 2;



    bMove:number = 0;  // -1是开，1是关，0是不动
    rangePos:number[] = [-300,0];   // 窗帘的限位
    cover_curPos:number = -300;  // 窗帘当前的位置

    topcover:Node = null;
    bottomcover:Node = null;

    protected start(): void {
        this.topcover = this.node.children[0];
        this.bottomcover = this.node.children[1];
    }



    update(deltaTime: number) {

        if(this.bMove==0)
            return;

        if(this.bMove==1)  // 如果是关窗帘
        {
            if(this.cover_curPos<this.rangePos[1])  // 如果窗帘没拉到位
            {
                123的
            }
            else // 如果窗帘拉到位了，停止拉窗帘
            {
                this.bMove = 0;  
            }
        }
        else // 如果是开窗帘
        {

        }
    }

    SetMove(movedir:number)
    {
        this.bMove = movedir;   // -1是开，1是关，0是不动
    }
    

    
}


