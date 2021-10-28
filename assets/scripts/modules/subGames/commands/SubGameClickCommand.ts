
import UpdateSubGameSignal from "../signals/UpdateSubGameSignal";
import LaunchSubGameSignal from "../signals/LaunchSubGameSignal";
import GameListItemView from "../../lobby/views/GameListItemView";
import RecommonCellView from "../../lobby/views/RecommonCellView";
import SubGameEntity, { GameState } from "../models/SubGameEntity";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import SubGamesModel from "../models/SubGamesModel";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;


export default class SubGameClickCommand extends riggerIOC.WaitableCommand {

    @riggerIOC.inject(PushTipsQueueSignal)
    pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(UpdateSubGameSignal)
    private updateSubGameSignal: UpdateSubGameSignal;

    @riggerIOC.inject(LaunchSubGameSignal)
    protected launchSignal: LaunchSubGameSignal;

    @riggerIOC.inject(SubGamesModel)
    private subGamesModel: SubGamesModel;

    execute(item: SubGameEntity): void {

        let info: SubGameEntity = item;
        let isMaintain: boolean = info.status == GameState.MAINTAIN || info.status == GameState.CLOSE;
        //维护中
        if (isMaintain) {
            this.pushTipsQueueSignal.dispatch(`${info.gameName}正在维护中,请稍候...`)
            return;
        } else if ((info.downloadUrl === undefined || info.downloadUrl === "") && !isMaintain) {
            this.pushTipsQueueSignal.dispatch(`敬请期待...`)
            return;
        }

        // 是否需要更新
        if (!info.isLatest) {
            this.updateSubGameSignal.dispatch(item.gameId);
            return;
        } else {
            // 启动游戏
            if(this.subGamesModel.runningSubGameId) return;
            cc.log(`is latest, to start`)
            this.launchSignal.dispatch(info.gameId);
        }
    }

    onCancel(): void {

    }

}
