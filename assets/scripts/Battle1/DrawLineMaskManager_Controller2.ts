import { _decorator, Component, Node, EventTouch } from 'cc';
import { GObjectbase1 } from '../baseclass3/GObjectbase1';
import { Message3 } from '../baseclass3/Message3';
import { MessageCenter3 } from '../baseclass3/MessageCenter3';
const { ccclass, property } = _decorator;

@ccclass('DrawLineMaskManager_Controller2')
export class DrawLineMaskManager_Controller2 extends GObjectbase1 {

    //---- 单例
    static Instance: DrawLineMaskManager_Controller2

    protected onLoad(): void {
        super.onLoad();
        DrawLineMaskManager_Controller2.Instance = this;
    }

    //---- 变量
    bStartConnect: boolean = false;   // 是否开始连接了
    start_wx: number = -1;       // 箭头起始绘图点世界坐标
    start_wy: number = -1;
    previous_end_wx: number = -1;
    previous_end_wy: number = -1;
    end_wx: number = -1;     // 箭头终止绘图点世界坐标
    end_wy: number = -1;

    // ----- 重载
    // 设置自己接受消息的类型，等待继承重写。
    _setOwnNodeName(): string {
        return "DrawLineMaskManager"
    }
    // 处理消息(等待后续重载)
    _processMessage(msg: Message3) {
        // 消息列表
        // 暂无
    }


    start() {
        // 注册messagecenter
        MessageCenter3.getInstance(this.BelongedSceneName).RegisterReceiver(this.OwnNodeName, this);


    }

    update(deltaTime: number) {


        if (this.bStartConnect) {
            if (this.previous_end_wx == this.end_wx && this.previous_end_wy == this.end_wy)  // 如果终点没变化，就不用绘图了
                return

            this.previous_end_wx = this.end_wx
            this.previous_end_wy = this.end_wy

            console.log(this.start_wx.toString() + "_" + this.end_wx.toString())
        }

    }


    // 设置起始绘图点并开始绘图
    SetDrawStartPoint(w_x: number, w_y: number) {
        this.start_wx = w_x;
        this.start_wy = w_y;
        this.end_wx = w_x;
        this.end_wy = w_y;
        this.bStartConnect = true;   // 开始作图模式
    }

    // 随着鼠标移动，改变终止绘图点
    SetDrawEndPoint(w_x: number, w_y: number) {
        this.end_wx = w_x;
        this.end_wy = w_y;
    }

    // 停止绘图
    StopDraw() {
        this.bStartConnect = false;   // 关闭作图模式
    }


}


