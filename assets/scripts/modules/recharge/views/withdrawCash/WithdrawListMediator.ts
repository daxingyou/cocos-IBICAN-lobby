import JPMediator from "../../../../../libs/common/scripts/utils/JPMediator";
import WithdrawListView from "./WithdrawListView";
import RechargeServer from "../../servers/RechargeServer";
import WithdrawOrderListTask from "../../task/WithdrawOrderListTask";
import { WithdrawOrderListResp, ErrResp } from "../../../../protocol/protocols/protocols";
import PushTipsQueueSignal from "../../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import BaseWaitingPanel from "../../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import UIManager from "../../../../../libs/common/scripts/utils/UIManager";
import RefreshWithdrawListTask from "../../task/RefreshWithdrawListTask";

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
export default class WithdrawListMeditator extends JPMediator {
    @riggerIOC.inject(WithdrawListView)
    protected view: WithdrawListView;

    @riggerIOC.inject(RechargeServer)
    private rechargeServer: RechargeServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    constructor() {
        super();
    }

    private isWaitForRefreshList: boolean = false;
    private refreshListTask: RefreshWithdrawListTask;
    onInit() {
        if(!this.refreshListTask) this.refreshListTask = new RefreshWithdrawListTask();
        this.view.withdrawList.setUpdateTask(this.refreshListTask);
    }

    async onShow() {
        this.initList();
        this.upDownToRefreshList();
    }

    onHide() {
        if(this.refreshListTask && this.refreshListTask.isWaitting()) this.refreshListTask.cancel('on hide');
        this.isWaitForRefreshList = false;
    }

    private async initList() {
        BaseWaitingPanel.show("正在登录");
        let task: WithdrawOrderListTask = this.rechargeServer.requestWithdrawOrderList();
        let result = await task.wait();
        if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
        if(result.isOk) {
            this.view.updateList(result.result.withdrawOrderList);
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

    private async upDownToRefreshList() {
        this.isWaitForRefreshList = true;
        while(this.isWaitForRefreshList) {
            this.refreshListTask.reset();
            let result = await this.refreshListTask.wait();
            if(result.isOk) {
                this.view.updateList(result.result.withdrawOrderList);
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
