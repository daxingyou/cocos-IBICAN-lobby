
import { ErrResp } from "../../../protocol/protocols/protocols";
import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import PopularizeServer from "../server/PopularizeServer";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import PopularizeReceiveRecordsPanel from "../views/PopularizeReceiveRecordsPanel";
import RefreshDrawCommissionRecordsTask from "../task/RefreshDrawCommissionRecordsTask";
import ReqDrawCommissionRecordsTask from "../task/ReqDrawCommissionRecordsTask";

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
export default class PopularizeReceiveRecordsMediator extends JPMediator {
    @riggerIOC.inject(PopularizeReceiveRecordsPanel)
    protected view: PopularizeReceiveRecordsPanel;

    @riggerIOC.inject(PopularizeServer)
    private popularizeServer: PopularizeServer;
    
    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    constructor() {
        super();
    }

    private isWaitForRefreshList: boolean = false;
    private refreshListTask: RefreshDrawCommissionRecordsTask;
    
    onInit() {
        if(!this.refreshListTask) this.refreshListTask = new RefreshDrawCommissionRecordsTask();
        this.view.recordList.setUpdateTask(this.refreshListTask);
    }

    onShow() {
        this.initOrderList();
        this.upDownToRefreshList();
    }

    onHide() {
        if(this.refreshListTask.isWaitting()) this.refreshListTask.cancel('on hide');
        this.isWaitForRefreshList = false;
    }

    async initOrderList() {
        BaseWaitingPanel.show("正在登录");
        let requestDrawCommissionRecordsTask: ReqDrawCommissionRecordsTask = this.popularizeServer.requestDrawCommissionRecords();
        let result = await requestDrawCommissionRecordsTask.wait();
        if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
        if(result.isOk) {
            this.view.updateList(result.result.drawCommissionRecordItems);
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
        if(!this.view.recordList.node.active) return;
        this.isWaitForRefreshList = true;
        while(this.isWaitForRefreshList) {
            this.refreshListTask.reset();
            let result = await this.refreshListTask.wait();
            if(result.isOk) {
                this.view.updateList(result.result.drawCommissionRecordItems);
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
