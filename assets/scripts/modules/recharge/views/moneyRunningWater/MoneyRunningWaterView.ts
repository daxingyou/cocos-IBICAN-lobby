import JPView from "../../../../../libs/common/scripts/utils/JPView";
import AsyncList from "../../../../../libs/common/scripts/utils/AsyncList/AsyncList";
import { WithdrawMosaic, ErrResp, WithdrawMosaicListResp } from "../../../../protocol/protocols/protocols";
import RunningWaterListItemView from "./RunningWaterListItemView";
import MoneyDetailsListItemView from "./MoneyDetailsListItemView";
import RechargeServer from "../../servers/RechargeServer";
import MoneyRunningWaterListTask from "../../task/MoneyRunningWaterListTask";
import PushTipsQueueSignal from "../../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import BaseWaitingPanel from "../../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import UIManager from "../../../../../libs/common/scripts/utils/UIManager";
import RefreshMoneyRunningWaterListTask from "../../task/RefreshMoneyRunningWaterListTask";
import AsyncRefreshList from "../../../../../libs/common/scripts/utils/refreshList/AsyncRefreshList";

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
export default class MoneyRunningWaterView extends JPView {
    @property(cc.Toggle)
    private runningWaterToggle: cc.Toggle = null;

    @property(cc.Toggle)
    private moneyDetailsToggle: cc.Toggle = null;

    @property(cc.Node)
    private moneyDetailsContent: cc.Node = null;

    @property(cc.Node)
    private runningWaterContent: cc.Node = null;

    @property(cc.RichText)
    private rechargeTxt: cc.RichText = null;

    @property(cc.RichText)
    private giftTxt: cc.RichText = null;

    @property(cc.Label)
    private actualMosaicTxt: cc.Label = null;

    @property(cc.Label)
    private timeTxt: cc.Label = null;

    // @property(cc.ScrollView)
    // private titleScrollView: cc.ScrollView = null;

    // @property(cc.ScrollView)
    // private listScrollView: cc.ScrollView = null;

    @property(AsyncRefreshList)
    private contentList: AsyncRefreshList = null;

    @property([cc.Prefab])
    private listTemplates: cc.Prefab[] = [];

    @riggerIOC.inject(RechargeServer)
    private rechargeServer: RechargeServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    constructor() {
        super();
    }

    onInit() {
        this.contentList.onRender(this, this.onRender);
        if(!this.refreshListTask) this.refreshListTask = new RefreshMoneyRunningWaterListTask();
        this.contentList.setUpdateTask(this.refreshListTask);
    }

    onShow() {
        this.addEventListener();
        this.runningWaterToggle.check();
        this.runningWaterToggle.node.emit('toggle', this.runningWaterToggle);
        this.updownToRefreshList();
    }

    onHide() {
        this.removeEventListener();
        this.isWaitForRefresh = false
        if(this.refreshListTask && this.refreshListTask.isWaitting()) this.refreshListTask.cancel('on hide');
    }

    onDispose() {
        this.contentList.offRender(this, this.onRender);
    }

    addEventListener() {
        this.runningWaterToggle.node.on('toggle', this.onToggleChanged, this);
        this.moneyDetailsToggle.node.on('toggle', this.onToggleChanged, this);
        // this.titleScrollView.node.on('scrolling', this.onTitleScrolling, this);
        // this.listScrollView.node.on('scrolling', this.onListScrolling, this);
    }

    removeEventListener() {
        this.runningWaterToggle.node.off('toggle', this.onToggleChanged, this);
        this.moneyDetailsToggle.node.off('toggle', this.onToggleChanged, this);
        // this.titleScrollView.node.off('scrolling', this.onTitleScrolling, this);
        // this.listScrollView.node.off('scrolling', this.onListScrolling, this);
    }

    // private onTitleScrolling(scroll: cc.ScrollView) {
    //     if(this.listScrollView.isScrolling()) return;
    //     let p: cc.Vec2 = scroll.getScrollOffset();
    //     let p2: cc.Vec2 = this.listScrollView.getScrollOffset();
    //     if(p.x.toFixed(3) == p2.x.toFixed(3)) {
    //         this.listScrollView.stopAutoScroll();
    //         return;
    //     }
    //     p.y = -p2.y;
    //     p.x = -p.x;
    //     this.listScrollView.scrollToOffset(p);
    // }

    // private onListScrolling(scroll: cc.ScrollView) {
    //     if(this.titleScrollView.isScrolling()) return;
    //     let p: cc.Vec2 = scroll.getScrollOffset();
    //     let p2: cc.Vec2 = this.titleScrollView.getScrollOffset();
    //     if(p.x.toFixed(3) == p2.x.toFixed(3)) {
    //         this.titleScrollView.stopAutoScroll();
    //         return;
    //     }
    //     p.y = 0;
    //     p.x = -p.x;
    //     this.titleScrollView.scrollToOffset(p);
    // }

    private currentView: pageViewType;
    private onToggleChanged(toggle: cc.Toggle) {
        switch(toggle.node.name) {
            case 'runningWaterToggle':
                this.currentView = pageViewType.runningWaterView;
                this.runningWaterContent.active = true;
                this.moneyDetailsContent.active = false;
                // this.titleScrollView.scrollToOffset(new cc.Vec2(0,0));
                // this.listScrollView.scrollToOffset(new cc.Vec2(0,0));
                // this.listScrollView.horizontal = true;
                break;
            case 'moneyDetailsToggle':
                this.currentView = pageViewType.moneyDetailsView;
                this.runningWaterContent.active = false;
                this.moneyDetailsContent.active = true;
                // this.listScrollView.scrollToOffset(new cc.Vec2(0,0));
                // this.listScrollView.horizontal = false;
                break;
            default :
                break;
        }
        this.refresh();
     }

     async refresh() {
        BaseWaitingPanel.show("");
        let task: MoneyRunningWaterListTask = this.rechargeServer.requestMoneyRunningWaterList();
        let result = await task.wait();
        if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
        if(result.isOk) {
            let r: WithdrawMosaicListResp = result.result;
            this.updateCommonData(r.totalRechargeMosaicFee, r.totalGiftMosaicFee, r.totalMosaicAmount, r.beginTime, r.endTime);
            this.updateList(result.result.withdrawMosaicList)
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

     private isWaitForRefresh: boolean = false;
     private refreshListTask: RefreshMoneyRunningWaterListTask;
     /**
      * 列表下拉刷新数据
      */
     private async updownToRefreshList() {
        if(!this.contentList.node.active) return;
        this.isWaitForRefresh = true;
        while(this.isWaitForRefresh) {
            this.refreshListTask.reset();
            let result = await this.refreshListTask.wait();
            if(result.isOk) {
                let r: WithdrawMosaicListResp = result.result;
                this.updateCommonData(r.totalRechargeMosaicFee, r.totalGiftMosaicFee, r.totalMosaicAmount, r.beginTime, r.endTime);
                this.updateList(result.result.withdrawMosaicList)
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
     
     private data: WithdrawMosaic[];
     /**
      * 更新公共数据
      * @param rechargeMosaicFeeCoin 总充值打码金额扣费
      * @param giftMosaicFeeCoin 总优惠打码金额扣费
      * @param actualMosaic 总实际打码金额
      * @param startTime 
      * @param endTime 
      */
     updateCommonData(rechargeMosaicFeeCoin: number, giftMosaicFeeCoin: number, actualMosaic: number, startTime: string, endTime: string) {
        this.actualMosaicTxt.string = actualMosaic / 100 + '';
        this.timeTxt.string = startTime.replace(/-/g, '/') + "-" + endTime.replace(/-/g, '/');

        if(rechargeMosaicFeeCoin <= 0) {
            this.rechargeTxt.string = '通过审核，无需扣费';
        }
        else {
            this.rechargeTxt.string = `未通过审核，提现需扣除：<color=#62E87F>${rechargeMosaicFeeCoin / 100}</color>`
        }

        if(giftMosaicFeeCoin <= 0) {
            this.giftTxt.string = '通过审核，无需扣费';
        }
        else {
            this.giftTxt.string = `未通过审核，提现需扣除：<color=#FFAD1F>${giftMosaicFeeCoin / 100}</color>`
        }
     }

     /**
      * 更新列表
      * @param list 数据
      */
     updateList(list: WithdrawMosaic[]) {
        this.data = list;
        if(list.length <= 6) {
            (this.contentList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.NONE;
            this.contentList.node.height = 354;
            if(this.currentView == pageViewType.runningWaterView) this.contentList.node.width = 899;
            else this.contentList.node.width = 771;
        }
        else {
            (this.contentList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.CONTAINER;
        }
        this.contentList.template = this.listTemplates[this.currentView];
        this.contentList.reset(list.length);
        this.contentList.clearPool();
        this.contentList.run(2, 1);
     }

     private onRender(node: cc.Node, idx: number) {
        if(this.currentView == pageViewType.runningWaterView) {
            let item: RunningWaterListItemView = node.getComponent(RunningWaterListItemView);
            item.initItem(this.data[idx].createTime, this.data[idx].rechargeMosaic, this.data[idx].giftMosaic, this.data[idx].realMosaic, this.data[idx].rechargeMosaicPass, this.data[idx].giftMosaicPass);
        }
        else if(this.currentView == pageViewType.moneyDetailsView) {
            let item: MoneyDetailsListItemView = node.getComponent(MoneyDetailsListItemView);
            item.initItem(this.data[idx].createTime, this.data[idx].transferTypeName, this.data[idx].rechargeAmount, this.data[idx].giftAmount);
        }
     }
}

enum pageViewType {
    runningWaterView = 0,
    moneyDetailsView
}
