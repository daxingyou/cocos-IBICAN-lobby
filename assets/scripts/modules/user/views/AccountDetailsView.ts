import JPView from "../../../../libs/common/scripts/utils/JPView";
import AsyncList from "../../../../libs/common/scripts/utils/AsyncList/AsyncList";
import DropMenuListItemView from "./DropMenuListItemView";
import RechargeServer from "../../recharge/servers/RechargeServer";
import RunningWaterTypeTask from "../../recharge/task/RunningWaterTypeTask";
import { TransferType, ErrResp, TransferTypeListResp, TransferRecordListResp, TransferRecord } from "../../../protocol/protocols/protocols";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import RunningWaterListTask from "../../recharge/task/RunningWaterListTask";
import { RunningWaterTimeKeyWord } from "../../recharge/views/RunningWaterType";
import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import AccountDetailsListItemView from "./AccountDetailsListItemView";
import AsyncRefreshList from "../../../../libs/common/scripts/utils/refreshList/AsyncRefreshList";
import RefreshRunningWaterListTask from "../tasks/RefreshRunningWaterListTask";

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
export default class AccountDetailsView extends JPView {
    @property(cc.Button)
    private timeSelectBtn: cc.Button = null;

    @property(cc.Button)
    private typeSelectBtn: cc.Button = null;

    @property(cc.Node)
    private timeSelectViewNode: cc.Node = null;

    @property(cc.Node)
    private typeSelectViewNode: cc.Node = null;

    @property([cc.Vec2])
    private timeSelectViewPos: cc.Vec2[] = [];

    @property([cc.Vec2])
    private typeSelectViewPos: cc.Vec2[] = [];

    @property(AsyncList)
    private timeSelectList: AsyncList = null;

    @property(AsyncList)
    private typeSelectList: AsyncList = null;

    @property(AsyncRefreshList)
    private detailsList: AsyncRefreshList = null;

    @property(cc.Label)
    private timeKeyWordTxt: cc.Label= null;

    @property(cc.Label)
    private typeTxt: cc.Label = null;

    @property(cc.Label)
    private rechargeTxt: cc.Label = null;

    @property(cc.Label)
    private withdrawTxt: cc.Label = null;

    @property(cc.Label)
    private balanceTxt: cc.Label = null;

    @property(cc.Label)
    private giftTxt: cc.Label = null;

    @property(cc.Node)
    private noListTipsNode: cc.Node = null;

    @riggerIOC.inject(RechargeServer)
    private rechargeServer: RechargeServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    constructor() {
        super();
    }

    onInit() {
        this.timeSelectList.onRender(this, this.onTimeMenuRender);
        this.typeSelectList.onRender(this, this.onTypeMenuRender);
        this.detailsList.onRender(this, this.onDetailsRender);
    }

    onShow() {
        if(!this.refreshListTask) this.refreshListTask = new RefreshRunningWaterListTask();
        this.addEventListener();
        this.updownToRefreshList();
        this.initMenu();
    }

    onHide() {
        this.removeEventListener();
        this.isWaitForRefresh = false;
        if(this.refreshListTask && this.refreshListTask.isWaitting()) {
            this.refreshListTask.cancel('args changed');
        }
    }

    onDispose() {
        this.timeSelectList.offRender(this, this.onTimeMenuRender);
        this.typeSelectList.offRender(this, this.onTypeMenuRender);
        this.detailsList.offRender(this, this.onDetailsRender);
        this.refreshListTask.dispose();
        this.refreshListTask = null;
    }

    /**交易日期菜单栏选项 */
    private timeMenuItems: {name: string, type: string}[] = [ {name: "今天", type: RunningWaterTimeKeyWord.TODAY}, {name: "昨天", type: RunningWaterTimeKeyWord.YESTERDAY},
                                                              {name: "最近一个月", type: RunningWaterTimeKeyWord.LAST_MONTH}, {name: "全部", type: RunningWaterTimeKeyWord.ALL}];

    /**交易类型菜单栏选项 */
    private typeMenuItems: {name: string, type: number}[] = [{name: "全部", type: -1}];

    /**当前选择交易日期 */
    private currentSelectTime: {name: string, type: string} = {name: "今天", type: RunningWaterTimeKeyWord.TODAY};

    /**当前选择交易类型 */
    private currentSelectType: {name: string, type: number} = {name: "全部", type: -1};
    async initMenu() {
        this.timeSelectList.reset(this.timeMenuItems.length);
        this.timeSelectList.run(2, 1);

        if(this.typeMenuItems.length <= 1) {
            let task: RunningWaterTypeTask = this.rechargeServer.requestRunningWaterType();
            let result = await task.wait();
            if(result.isOk) {
                result.result.transferTypeList.forEach((list: TransferType) => {
                    this.typeMenuItems.push({name: list.name, type: list.type});
                });
                this.typeSelectList.reset(this.typeMenuItems.length);
                this.typeSelectList.run(2, 1);
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
        else {
            this.typeSelectList.reset(this.typeMenuItems.length);
            this.typeSelectList.run(2, 1);
        }

        this.updateMenuSelect();
    }

    /**
     * 选择菜单,更新视图
     */
    updateMenuSelect() {
        this.timeKeyWordTxt.string = this.currentSelectTime.name;
        this.typeTxt.string = this.currentSelectType.name;
        let time: string = this.currentSelectTime.type;
        let type: number[];
        if(this.currentSelectType.type == -1 || !this.currentSelectType.type) {  // -1：全部
            type = [];
        }
        else {
            type = [this.currentSelectType.type];
        }
        this.requestDetailsList(time, type);

        if(this.refreshListTask.isWaitting()) {
            this.refreshListTask.cancel('args changed');
        }
    }

    /**个人明细全部数据 */
    private detailsData: TransferRecord[];

    /**
     * 请求个人明细列表
     * @param timeKey 
     * @param type 
     */
    async requestDetailsList(timeKey: string, type: number[]) {
        BaseWaitingPanel.show("正在登录");
        let task: RunningWaterListTask = this.rechargeServer.requestRunninWater(timeKey, type);
        let result = await task.wait();
        if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
        if(result.isOk) {
            if(result.result.transferRecordList.length <= 0 || !result.result.transferRecordList) {
                this.noListTipsNode.active = true;
                this.updateDetailsList([]);
                this.updateCommonData(0, 0, 0, 0);
            }
            else {
                this.noListTipsNode.active = false;
                this.updateDetailsList(result.result.transferRecordList);
                this.updateCommonData(result.result.totalRechargeAmount, result.result.totalWithdrawAmount, result.result.amount, result.result.totalGiftAmount);
            }
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

    private updateDetailsList(list: TransferRecord[]) {
        this.detailsData = list;
        if(list.length <= 8) {
            (this.detailsList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.NONE;
            this.detailsList.node.width = 756;
            this.detailsList.node.height = 374;
        }
        else {
            (this.detailsList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.CONTAINER;
        }
        this.detailsList.reset(list.length);
        this.detailsList.run(2, 1);
    }

    private updateCommonData(rechargeCoin: number, withdrawCoin: number, balanceCoin: number, giftCoin: number) {
        this.rechargeTxt.string = (rechargeCoin / 100).toFixed(2);
        this.withdrawTxt.string = (withdrawCoin / 100).toFixed(2);
        this.balanceTxt.string = (balanceCoin / 100).toFixed(2);
        this.giftTxt.string = (giftCoin / 100).toFixed(2);
    }

    private isWaitForRefresh: boolean = false;
    private refreshListTask: RefreshRunningWaterListTask;
    /**
     * 列表下拉刷新
     */
    private async updownToRefreshList() {
        if(!this.detailsList.node.active) return;
        this.isWaitForRefresh = true;
        while(this.isWaitForRefresh) {
            this.refreshListTask.reset();
            let time: string = this.currentSelectTime.type;
            let type: number[];
            if(this.currentSelectType.type == -1 || !this.currentSelectType.type) {  // -1：全部
                type = [];
            }
            else {
                type = [this.currentSelectType.type];
            }
            this.detailsList.setUpdateTask(this.refreshListTask, [time, type]);
            let result = await this.refreshListTask.wait();
            if(result.isOk) {
                if(result.result.transferRecordList.length <= 0 || !result.result.transferRecordList) {
                    this.noListTipsNode.active = true;
                    this.updateDetailsList([]);
                    this.updateCommonData(0, 0, 0, 0);
                }
                else {
                    this.noListTipsNode.active = false;
                    this.updateDetailsList(result.result.transferRecordList);
                    this.updateCommonData(result.result.totalRechargeAmount, result.result.totalWithdrawAmount, result.result.amount, result.result.totalGiftAmount);
                }
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

    addEventListener() {
        this.timeSelectBtn.node.on('click', this.onSelectBtnClick, this);
        this.typeSelectBtn.node.on('click', this.onSelectBtnClick, this);
    }

    removeEventListener() {
        this.timeSelectBtn.node.on('click', this.onSelectBtnClick, this);
        this.typeSelectBtn.node.on('click', this.onSelectBtnClick, this);
    }

    /**交易日期下拉菜单是否处于收缩状态 */
    private isTimeMenuShrink: boolean = true;

    /**交易类型下拉菜单是否处于收缩状态 */
    private isTypeMenuShrink: boolean = true;

    private onSelectBtnClick(btn: cc.Button) {
        let endPos: cc.Vec2;
        let node: cc.Node;
        let time: number;
        switch(btn.node.name) {
            case 'timeSelectBtn':
                endPos = this.isTimeMenuShrink ? this.timeSelectViewPos[1] : this.timeSelectViewPos[0];
                node = this.timeSelectViewNode;
                time = 0.4;
                this.isTimeMenuShrink = !this.isTimeMenuShrink;
                cc.find('grzx_srk_xl', this.timeSelectBtn.node).scaleY = this.isTimeMenuShrink ? 1 : -1;
                break;
            case 'typeSelectBtn':
                endPos = this.isTypeMenuShrink ? this.typeSelectViewPos[1] : this.typeSelectViewPos[0];
                node = this.typeSelectViewNode;
                time = 0.5;
                this.isTypeMenuShrink = !this.isTypeMenuShrink;
                cc.find('grzx_srk_xl', this.typeSelectBtn.node).scaleY = this.isTypeMenuShrink ? 1 : -1;
                break;
            default :
                break;
        }
        this.menuAction(node, endPos, time);
    }

    /**
     * 下拉菜单栏动画
     * @param node 
     * @param endPos 
     * @param time 
     */
    private menuAction(node: cc.Node, endPos: cc.Vec2, time: number = 1): cc.Action {
        node.stopAllActions();
        let action: cc.Action = cc.moveTo(time, endPos).easing(cc.easeCubicActionOut());
        return node.runAction(action);
    }

    /**
     * 交易日期菜单栏
     * @param node 
     * @param idx 
     */
    private onTimeMenuRender(node: cc.Node, idx: number) {
        let item: DropMenuListItemView = node.getComponent(DropMenuListItemView);
        item.initItem(this.timeMenuItems[idx].name, this.timeMenuItems[idx].type);
        item.node.on('click', this.onTimeMenuClick, this);
    }

    /**
     * 交易类型菜单栏
     * @param node 
     * @param idx 
     */
    private onTypeMenuRender(node: cc.Node, idx: number) {
        let ietm: DropMenuListItemView = node.getComponent(DropMenuListItemView);
        ietm.initItem(this.typeMenuItems[idx].name, this.typeMenuItems[idx].type);
        ietm.node.on('click', this.onTypeMenuClick, this);
    }

    private onTimeMenuClick(node: cc.Node) {
        if(this.isTimeMenuShrink) return;
        let selectName: string = (node.getComponent(DropMenuListItemView) as DropMenuListItemView).selectName;
        let selectType: string = (node.getComponent(DropMenuListItemView) as DropMenuListItemView).selectType as string;
        this.currentSelectTime = {name: selectName, type: selectType};
        this.isTimeMenuShrink = !this.isTimeMenuShrink;
        cc.find('grzx_srk_xl', this.timeSelectBtn.node).scaleY = this.isTimeMenuShrink ? 1 : -1;
        this.menuAction(this.timeSelectViewNode, this.timeSelectViewPos[0], 0);
        this.updateMenuSelect();
    }
    
    private onTypeMenuClick(node: cc.Node) {
        if(this.isTypeMenuShrink) return;
        let selectName: string = (node.getComponent(DropMenuListItemView) as DropMenuListItemView).selectName;
        let selectType: number = (node.getComponent(DropMenuListItemView) as DropMenuListItemView).selectType as number;
        this.currentSelectType = {name: selectName, type: selectType};
        this.isTypeMenuShrink = !this.isTypeMenuShrink;
        cc.find('grzx_srk_xl', this.typeSelectBtn.node).scaleY = this.isTypeMenuShrink ? 1 : -1;
        this.menuAction(this.typeSelectViewNode, this.typeSelectViewPos[0], 0);
        this.updateMenuSelect();
    }

    /**
     * 个人明细
     * @param node 
     * @param idx 
     */
    private onDetailsRender(node: cc.Node, idx: number) {
        let item: AccountDetailsListItemView = node.getComponent(AccountDetailsListItemView);
        item.initItem(this.detailsData[idx].createTime, this.detailsData[idx].transferTypeName, this.detailsData[idx].transferAmount, this.detailsData[idx].transferWay, this.detailsData[idx].endAmount)
    }
}


