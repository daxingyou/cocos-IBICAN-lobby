import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import OrderListView from "./OrderListView";
import RechargeServer from "../servers/RechargeServer";
import { ErrResp } from "../../../protocol/protocols/protocols";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import RefreshRechargeListTask from "../task/RefreshRechargeListTask";

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
export default class OrderListMediator extends JPMediator {
    @riggerIOC.inject(OrderListView)
    protected view: OrderListView;

    @riggerIOC.inject(RechargeServer)
    private rechargeServer: RechargeServer;
    
    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    constructor() {
        super();
    }

    private isWaitForRefreshList: boolean = false;
    private refreshListTask: RefreshRechargeListTask;
    onInit() {
        if(!this.refreshListTask) this.refreshListTask = new RefreshRechargeListTask();
        this.view.orderList.setUpdateTask(this.refreshListTask);
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
        let requestOrderListTask = this.rechargeServer.requestRechargeOrderList();
        let result = await requestOrderListTask.wait();
        if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
        if(result.isOk) {
            this.view.updateList(result.result.orderList);
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
        if(!this.view.orderList.node.active) return;
        this.isWaitForRefreshList = true;
        while(this.isWaitForRefreshList) {
            this.refreshListTask.reset();
            let result = await this.refreshListTask.wait();
            if(result.isOk) {
                this.view.updateList(result.result.orderList);
            }
            else {
                let reason = result.reason;
                if(reason instanceof ErrResp) {
                    this.pushTipsQueueSignal.dispatch(reason.errMsg);
                }
                else {
                    // this.pushTipsQueueSignal.dispatch(reason);
                    cc.log(reason);
                }
            }
        }
    }
}
