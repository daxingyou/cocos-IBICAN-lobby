import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";

import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LobbySceneNames from "../../scene/LobbySceneNames";
import ExitLoginSignal from "../signals/ExitLoginSignal";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class OnLobbyLoginFailedCommand extends riggerIOC.Command {
    @riggerIOC.inject(ExitLoginSignal)
    private exitLoginSignal: ExitLoginSignal;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    constructor() {
        super();
    }

    execute(reason: string) {
        cc.log(`login Failed: ${reason}`);
        if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
        let currentSceneName = cc.director.getScene().name;
        if(currentSceneName && currentSceneName == LobbySceneNames.MainScene) {
            this.exitLoginSignal.dispatch();
            setTimeout(() => {
                cc.log(`重连失败,请重新登录游戏尝试`);
                this.pushTipsQueueSignal.dispatch(`重连失败,请重新登录游戏尝试!`);
            }, 500);
        }  
        else {
            if(reason && reason.length > 0) {
                this.pushTipsQueueSignal.dispatch(reason);
            }
        }
    }
}
