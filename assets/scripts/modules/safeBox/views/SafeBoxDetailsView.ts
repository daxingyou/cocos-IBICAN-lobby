import JPView from "../../../../libs/common/scripts/utils/JPView";
import AsyncList from "../../../../libs/common/scripts/utils/AsyncList/AsyncList";
import { TransferRecord, TransferRecordListResp, ErrResp } from "../../../protocol/protocols/protocols";
import SafeBoxDetailsListItemView from "./SafeBoxDetailsListItemView";
import RunningWaterType, { RunningWaterTimeKeyWord } from "../../recharge/views/RunningWaterType";
import RechargeServer from "../../recharge/servers/RechargeServer";
import RunningWaterListTask from "../../recharge/task/RunningWaterListTask";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import AsyncRefreshList from "../../../../libs/common/scripts/utils/refreshList/AsyncRefreshList";
import SaveBoxDetailsListRefreshTask from "../tasks/SaveBoxDetailsListRefreshTask";

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
export default class SafeBoxDetailsView extends JPView {
    @property(cc.ScrollView)
    private scrollView: cc.ScrollView = null;

    @property(AsyncRefreshList)
    private detailsList: AsyncRefreshList = null;

    @riggerIOC.inject(RechargeServer)
    private rechargeServer: RechargeServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    constructor() {
        super();
    }

    private listRefreshTask: SaveBoxDetailsListRefreshTask;
    onInit() {
        if(!this.listRefreshTask) this.listRefreshTask = new SaveBoxDetailsListRefreshTask();
        this.detailsList.setUpdateTask(this.listRefreshTask, [RunningWaterTimeKeyWord.ALL, [RunningWaterType.SAFE_IN, RunningWaterType.SAFE_OUT]]);
        this.detailsList.onRender(this, this.onRender);

    }

    private isWaitForRefreshList: boolean = false;
    async onShow() {
        if(!this.node.active) return;
        this.isWaitForRefreshList = true;
        while(this.isWaitForRefreshList) {
            this.listRefreshTask.reset();
            let result = await this.listRefreshTask.wait();
            if(result.isOk) {
                this.updateList(result.result.transferRecordList);
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

    onHide() {
        if(this.listRefreshTask && this.listRefreshTask.isWaitting()) {
            this.listRefreshTask.cancel('on hide');
        }
        this.isWaitForRefreshList = false;
    }

    async refresh() {
        BaseWaitingPanel.show("正在登录");
        let task: RunningWaterListTask = this.rechargeServer.requestRunninWater(RunningWaterTimeKeyWord.ALL, [RunningWaterType.SAFE_IN, RunningWaterType.SAFE_OUT]);
        let result = await task.wait();
        if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
        
        if(result.isOk) {
            this.updateList(result.result.transferRecordList);
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

    private data: TransferRecord[];
    updateList(list: TransferRecord[]) {
        this.data = list;
        if(list.length <= 8) {
            (this.detailsList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.NONE;
            this.detailsList.node.width = 765;
            this.detailsList.node.height = 507;
        }
        else {
            (this.detailsList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.CONTAINER;
        }
        this.detailsList.reset(list.length);
        this.detailsList.run(2, 1);
    }

    onDispose() {
        this.detailsList.offRender(this, this.onRender);
    }

    private onRender(node: cc.Node, idx: number) {
        let item: SafeBoxDetailsListItemView = node.getComponent(SafeBoxDetailsListItemView);
        item.initItem(this.data[idx].createTime, this.data[idx].transferTypeName, this.data[idx].transferAmount);
    }
}
