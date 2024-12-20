import { _decorator, Component, Node } from 'cc';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
const { ccclass, property } = _decorator;

@ccclass('LineArrow_Controller')
export class LineArrow_Controller extends GObjectbase1 {



    //---- 变量
    bStartConnect: boolean = false;   // 是否开始连接了
    start_wx: number = -1;       // 箭头起始绘图点世界坐标
    start_wy: number = -1;
    previous_end_wx: number = -1;
    previous_end_wy: number = -1;
    end_wx: number = -1;     // 箭头终止绘图点世界坐标
    end_wy: number = -1;

    readonly arrow_width: number = 180 + 15;  // 原始的箭头宽度


    arrow_head: Node = null;
    arrow_body: Node = null;


    // ----- 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnNodeName(): string {
        return "LineArrow"
    }
    // 处理消息(等待后续重载)
    _processMessage(msg: Message3) {
        // 消息列表
        // 暂无
    }




    start() {
        // 注册messagecenter
        MessageCenter3.getInstance(this.BelongedSceneName).RegisterReceiver(this.OwnNodeName, this);


        this.arrow_head = this.node.children[0];
        this.arrow_body = this.node.children[1];
        this.arrow_body.setScale(0, 0, 1)   // 把箭头隐藏掉
        this.arrow_head.setScale(0,0,1) // 把箭头隐藏掉
    }

    update(deltaTime: number) {
        if (this.bStartConnect) {
            if (this.previous_end_wx == this.end_wx && this.previous_end_wy == this.end_wy)  // 如果终点没变化，就不用绘图了
                return

            this.previous_end_wx = this.end_wx
            this.previous_end_wy = this.end_wy


            let dt_x = this.start_wx - this.end_wx;
            let dt_y = this.start_wy - this.end_wy;
            let tmpdist = Math.sqrt(dt_x * dt_x + dt_y * dt_y);  // 自此我们可以计算出宽度

            let angle = Math.atan2(dt_y, dt_x) * 180 / Math.PI;

            this.node.setWorldPosition(this.end_wx, this.end_wy, 0)
            this.node.setRotationFromEuler(0, 0, angle + 180)
            this.arrow_body.setScale(tmpdist / this.arrow_width, 1, 1)
            // console.log((this.end_wx).toString()+"_"+(this.end_wy).toString())

        }
    }


    // 设置起始绘图点并开始绘图
    SetDrawStartPoint(w_x: number, w_y: number) {
        this.start_wx = w_x;
        this.start_wy = w_y;
        this.end_wx = w_x;
        this.end_wy = w_y;
        this.bStartConnect = true;   // 开始作图模式
        this.arrow_head.setScale(1,1,1)
    }

    // 随着鼠标移动，改变终止绘图点
    SetDrawEndPoint(w_x: number, w_y: number) {
        this.end_wx = w_x;
        this.end_wy = w_y;
    }

    // 停止绘图
    StopDraw() {
        this.bStartConnect = false;   // 关闭作图模式
        this.arrow_body.setScale(0, 0, 1)
        this.arrow_head.setScale(0,0,1)
    }
}


