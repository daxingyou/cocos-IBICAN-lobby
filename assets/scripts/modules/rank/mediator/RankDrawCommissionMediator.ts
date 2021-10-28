
import { ErrResp } from "../../../protocol/protocols/protocols";
import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import RankDrawCommissionView from "../views/RankDrawCommissionView";
import RankServer from "../server/RankServer";
import RefreshCommissionRankTask from "../task/RefreshCommissionRankTask";

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
export default class RankDrawCommissionMediator extends JPMediator {
    @riggerIOC.inject(RankDrawCommissionView)
    protected view: RankDrawCommissionView;

    @riggerIOC.inject(RankServer)
    private rankServer: RankServer;
    
    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    constructor() {
        super();
    }

    private isWaitForRefreshList: boolean = false;
    private refreshListTask: RefreshCommissionRankTask;
    
    onInit() {
        if(!this.refreshListTask) this.refreshListTask = new RefreshCommissionRankTask();
        this.view.rankList.setUpdateTask(this.refreshListTask);
    }

    onShow() {
        this.initDrawCommissionList();
        this.upDownToRefreshList();
    }

    onHide() {
        if(this.refreshListTask.isWaitting()) this.refreshListTask.cancel('on hide');
        this.isWaitForRefreshList = false;
    }

    async initDrawCommissionList() {
        BaseWaitingPanel.show("正在登录");
        let requestDirectCommissionTask = this.rankServer.requestCommissionRank();
        let result = await requestDirectCommissionTask.wait();
        console.log("initDrawCommissionList", result)
        if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
        if(result.isOk) {
            this.view.updateView(result.result);
        }
        else {
            let reason = result.reason;
            if(reason instanceof ErrResp) {
                this.pushTipsQueueSignal.dispatch(reason.errMsg);
            }
            else {
                this.pushTipsQueueSignal.dispatch(reason);
            }
        }
    }

    /**
     * 下拉刷新
     */
    private async upDownToRefreshList() {
        if(!this.view.rankList.node.active) return;
        this.isWaitForRefreshList = true;
        while(this.isWaitForRefreshList) {
            this.refreshListTask.reset();
            let result = await this.refreshListTask.wait();
            if(result.isOk) {
                this.view.updateView(result.result);
            }
            else {
                let reason = result.reason;
                if(reason instanceof ErrResp) {
                    this.pushTipsQueueSignal.dispatch(reason.errMsg);
                }
                else {
                    cc.log(reason);
                }
            }
        }
    }
}
