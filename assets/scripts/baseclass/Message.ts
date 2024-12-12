import { _decorator } from 'cc';
const { ccclass, property } = _decorator;


export class Message {

    //类型 123
    Type: number;
    //命令 100 101 200 201
    Command: number;
    //参数
    Content: any;
    //构造方法
    constructor(type,command, content)
    {
        this.Type = type;
        this.Command = command;
        this.Content = content;
    }


}





export class MessageType
{
    static Type_Empty = 0;
    static Type_UI  = 1;
    static Type_NPC = 2;
    static Type_Enemy = 3;
    static Type_Audio = 4;


    static UI_RefreshHP = 101;
}


// export class MessageCMD
// {
    


// }
