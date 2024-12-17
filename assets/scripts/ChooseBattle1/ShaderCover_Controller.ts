import { _decorator, Component, Node } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
const { ccclass, property } = _decorator;

@ccclass('ShaderCover_Controller')
export class ShaderCover_Controller extends GObjectbase1 {
    // start() {

    // }


    @property
    MoveSpeed: number = 70;  // 开关速度

    @property
    bMove: number = 0;  // -1是开，1是关，0是不动


    rangePos: number[] = [-896, 0];   // 窗帘的限位

    @property
    cover_curPos: number = -896;  // 窗帘当前的位置

    topcover: Node = null;
    bottomcover: Node = null;

    protected start(): void {


        // 注册messagecenter
        MessageCenter3.getInstance(this.BelongedSceneName).RegisterReceiver(this.OwnNodeName, this);

        this.topcover = this.node.children[0];
        this.bottomcover = this.node.children[1];


    }

    // 重载
    // 设置自己接受消息的类型
    _setOwnNodeName(): string {
        return "shader_1"
    }

    // 处理消息
    _processMessage(msg: Message3) {
        this.bMove = msg.Command
    }


    update(deltaTime: number) {

        if (this.bMove == 0)
            return;
        else if (this.bMove == 1)  // 如果是关窗帘
        {
            if (this.cover_curPos < this.rangePos[1])  // 如果窗帘没拉到位
            {
                this.cover_curPos = this.cover_curPos + this.MoveSpeed   // 更新进度条
                let top_pos = this.topcover.getPosition()
                this.topcover.setPosition(top_pos.x, top_pos.y - this.MoveSpeed * this.bMove)
                let bottom_pos = this.bottomcover.getPosition()
                this.bottomcover.setPosition(bottom_pos.x, bottom_pos.y + this.MoveSpeed * this.bMove)
            }
            else // 如果窗帘拉到位了，停止拉窗帘
            {
                this.bMove = 0;
            }
        }
        else if (this.bMove == -1)  // 如果是开窗帘
        {
            if (this.cover_curPos > this.rangePos[0])  // 如果窗帘没拉到位
            {
                this.cover_curPos = this.cover_curPos - this.MoveSpeed   // 更新进度条
                let top_pos = this.topcover.getPosition()
                this.topcover.setPosition(top_pos.x, top_pos.y - this.MoveSpeed * this.bMove)
                let bottom_pos = this.bottomcover.getPosition()
                this.bottomcover.setPosition(bottom_pos.x, bottom_pos.y + this.MoveSpeed * this.bMove)
            }
            else // 如果窗帘拉到位了，停止拉窗帘
            {
                this.bMove = 0;
            }
        }
    }

    SetMove(movedir: number) {
        this.bMove = movedir;   // -1是开，1是关，0是不动
    }



}


