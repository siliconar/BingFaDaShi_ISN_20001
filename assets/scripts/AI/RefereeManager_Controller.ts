import { _decorator, Component, Node } from 'cc';
import { TowerManager_Controller } from '../Battle1/TowerManager_Controller';
import { ProcessBarManager_Controller } from '../UI/ProcessBarManager_Controller';
const { ccclass, property } = _decorator;

@ccclass('RefereeManager_Controller')
export class RefereeManager_Controller extends Component {

// 这个节点应该放在最后，等运动员都入场

    //---- 单例
    static Instance: RefereeManager_Controller

    protected onLoad(): void {
        RefereeManager_Controller.Instance = this;

    }


    //---- 变量
    MaxTowerCnt:number;  // 塔的总数量
    MaxUpdateScore_Interval:number = 0.5;  // 得分刷新间隔
    private cur_updatescore_time:number =0;    // 得分刷新时间
    private last_Player_TowerCnt =0;   // player占塔数量
    private last_Enemy_TowerCnt =0;    // enemy占塔数量


    start() {
        // 这个节点应该放在最后，等运动员都入场

        // 组件和变量初始化
        this.MaxTowerCnt = TowerManager_Controller.Instance.Receiver_List.size  // 塔的总数量
        
        
    }

    update(deltaTime: number) {

        // 更新时间
        this.cur_updatescore_time+=deltaTime

        // 判断得分并刷新上面的条
        if(this.cur_updatescore_time>=this.MaxUpdateScore_Interval)
        {
            this.cur_updatescore_time =0;  // 更新时间归0

            // ----- 刷新分数，并判断输赢
            // 刷新分数
            [this.last_Player_TowerCnt, this.last_Enemy_TowerCnt] = this.Calc_CurScore();

            // 更新进度条
            this.Referee_UpdateProcessBar(this.last_Player_TowerCnt, this.last_Enemy_TowerCnt, this.MaxTowerCnt-this.last_Player_TowerCnt-this.last_Enemy_TowerCnt)
        }
    }


    // 判断当前分数
    // 返回值:
    // player的占塔数量
    Calc_CurScore():[number,number]
    {
        let leftTower_player:number =0;   // 塔剩余数-玩家
        let leftTower_enemy:number =0;   // 塔剩余数-玩家
        // 统计占塔情况
        for(const i_script of TowerManager_Controller.Instance.Receiver_List.values())
        {
            if(1 == i_script.cur_Party)
                leftTower_player++;
            else if(-1==i_script.cur_Party)
                leftTower_enemy++;
        }


        return [leftTower_player,leftTower_enemy]
    }

    // 更新进度条
    Referee_UpdateProcessBar(playercnt:number, enemycnt:number, neutralcnt:number)
    {
        const totallen = 406;  // 从面板得到的总长度
        const width_player = Math.floor(playercnt/this.MaxTowerCnt*totallen);
        const width_enemy = Math.floor(enemycnt/this.MaxTowerCnt*totallen);
        const width_neutral = totallen - width_player - width_enemy;   // 中立宽度

        // 更新图像
        ProcessBarManager_Controller.Instance.UpdateProcessImage(width_player,width_enemy, width_neutral);


    }

}


