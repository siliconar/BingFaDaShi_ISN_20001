import { _decorator } from 'cc';
const { ccclass, property } = _decorator;


export class Message2 {

    //类型 123
    Type: number[];
    //命令 100 101 200 201
    Command: number;
    //参数
    Content: any;
    //构造方法
    constructor(type,command, content)
    {
        this.Type = [...type];
        this.Command = command;
        this.Content = content;
    }


}





export class MessageType2
{
    static Type_Empty = 0;

    static Scene_Choose = 1;
    static Scene_Battle =2;

    static Manager_UI  = 101; 




    static UI_SHaderMove = 10101; // 拉窗帘
}


// export class MessageCMD
// {
    


// }
