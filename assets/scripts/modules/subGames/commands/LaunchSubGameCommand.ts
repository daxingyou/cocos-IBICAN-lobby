import SubGamesServer from "../servers/SubGamesServer";
import { SubGameId } from "../models/SubGameEntity";
import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import SubGameUtils from "../utils/SubGameUtils";
import NativeUtils from "../../../../libs/native/NativeUtils";
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

export default class LaunchSubGameCommand extends riggerIOC.WaitableCommand {
    @riggerIOC.inject(SubGamesServer)
    private server: SubGamesServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSig: PushTipsQueueSignal;

    @riggerIOC.inject(SubGamesModel)
    private subGameModel: SubGamesModel;

    async execute(subGameId: SubGameId, ifContinue: boolean) {
        console.time(`*** 启动子游戏:${subGameId} ***`);
        if (!ifContinue) return this.done();
        if(this.subGameModel.runningSubGameId) return this.done();

        // 显示等待界面
        cc.log(`*** now wait for playing sub game:${subGameId}, and show waitting panel ***`);
        let waitingPanel: BaseWaitingPanel = BaseWaitingPanel.show(`正在为您启动游戏,请稍候`);
        cc.log(`*** success to show waitting panel ***`);
        let task = this.server.launchSubGame(subGameId);
        let ret = await task.wait();
        UIManager.instance.hidePanel(waitingPanel);
        if (ret.isFailed) {
            this.pushTipsQueueSig.dispatch("启动游戏失败");
        }

        cc.log(`========orientation:${SubGameUtils.getSubGameSettings(this.subGameModel.getSubGame(subGameId)).orientation}=========`);
        switch(SubGameUtils.getSubGameSettings(this.subGameModel.getSubGame(subGameId)).orientation) {
            case 'landscape':
                NativeUtils.setOrientation(1);
                break;
            case 'portrait':
                NativeUtils.setOrientation(2);
                break;
            default:
                NativeUtils.setOrientation(3);
                break;
        }

        this.done();
        console.timeEnd(`*** 启动子游戏:${subGameId} ***`);
        console.timeEnd("*** 启动子游戏 ***");
    }

}
