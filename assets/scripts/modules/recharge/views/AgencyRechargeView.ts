import JPView from "../../../../libs/common/scripts/utils/JPView";
import NativeUtils from "../../../../libs/native/NativeUtils";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import AsyncList from "../../../../libs/common/scripts/utils/AsyncList/AsyncList";
import { RechargeAgentItem, ErrResp, RechargeAgentPush } from "../../../protocol/protocols/protocols";
import RechargeServer from "../servers/RechargeServer";
import RechargeAgencyTask from "../task/RechargeAgencyTask";
import AgencyListItemView from "./AgencyListItemView";
import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import { RechargeAgentPushSignal } from "../../../protocol/signals/signals";

//充值，代理支付界面
const { ccclass, property } = cc._decorator;

@ccclass
export default class AlipayRechargeView extends JPView {

    @property(cc.Button)
    public myIdCopyBtn: cc.Button = null;

    @property(cc.Label)
    public myIdLabel: cc.Label = null;

    @property(cc.Label)
    public description: cc.Label = null;

    @property(AsyncList)
    public agencyList: AsyncList = null;

    @property(cc.Button)
    public refreshBtn: cc.Button = null;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(RechargeServer)
    private rechargeServer: RechargeServer;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;

    @riggerIOC.inject(RechargeAgentPushSignal)
    private rechargeAgentPushSignal: RechargeAgentPushSignal;

    constructor() {
        super();
    }

    onInit() {
        super.onInit();
        this.agencyList.onRender(this, this.onRender);
    }


    onShow() {
        super.onShow();
        this.addEventListener();
        this.addProtocolListener();
        this.initAgencyData(); //初始化,请求page1的代理
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
        this.removeProtocolListener();
        this.resetData();
    }

    onDispose() {
        super.onDispose();
    }

    addEventListener() {
        this.myIdCopyBtn.node.on('click', this.onMyIdCopyHandle, this);
        this.refreshBtn.node.on('click', this.onRefreshBtnClick, this);
    }

    removeEventListener() {
        this.myIdCopyBtn.node.off('click', this.onMyIdCopyHandle, this);
        this.refreshBtn.node.off('click', this.onRefreshBtnClick, this);
    }

    addProtocolListener() {
        this.rechargeAgentPushSignal.on(this, this.onRechargeAgentPush);
    }

    removeProtocolListener() {
        this.rechargeAgentPushSignal.off(this, this.onRechargeAgentPush);
    }

    private onRechargeAgentPush(resp: RechargeAgentPush) {
        this.rechargeDescription = resp.description;
        this.currentPageNum = resp.currentPageNum;
        this.totalPageNum = resp.totalPageNum;
        this.agencyData = resp.rechargeAgentItems;
        this.refreshBtn.interactable = this.totalPageNum > 1 ? true : false;
        this.updateView();
    }

    private currentPageNum: number = 1; // 当前页
    private totalPageNum: number; //总页数
    private rechargeDescription: string = '';
    private agencyData: RechargeAgentItem[] = [];
    private async initAgencyData(pageNum: number = 1) {
        BaseWaitingPanel.show("正在刷新");
        let requestAgencyTask: RechargeAgencyTask = this.rechargeServer.requestRechargeAgencyList(pageNum);
        let result = await requestAgencyTask.wait();
        if (BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
        if (result.isOk) {
            this.rechargeDescription = result.result.description;
            this.agencyData = result.result.rechargeAgentItems;
            this.totalPageNum = result.result.totalPageNum;
            this.refreshBtn.interactable = result.result.totalPageNum > 1 ? true : false;
            this.updateView();
        }
        else {
            let reason = result.reason;
            if (reason instanceof ErrResp) {
                this.pushTipsQueueSignal.dispatch(reason.errMsg);
            }
            else {
                cc.log(`requestAgency err: ${reason}`);
            }
        }
    }

    private resetData() {
        this.totalPageNum = null;
        this.currentPageNum = 1;
        this.rechargeDescription = '';
        this.agencyData = [];
    }

    /**
     * 代理信息列表
     * @param node 
     * @param idx 
     */
    private onRender(node: cc.Node, idx: number) {
        let item: AgencyListItemView = node.getComponent(AgencyListItemView) as AgencyListItemView;
        item.init(this.agencyData[idx]);
    }

    /**
     * 代理信息刷新按钮
     */
    private onRefreshBtnClick() {
        if (this.totalPageNum && this.totalPageNum > 1) {
            this.currentPageNum += 1;
            if (this.currentPageNum > this.totalPageNum) this.currentPageNum = 1;
        }
        else {
            this.currentPageNum = 1;
        }
        this.initAgencyData(this.currentPageNum);
        // this.updateView();
    }

    /**
     * 更新视图
     */
    private updateView() {
        if (!this.agencyData || this.agencyData.length <= 0) return;
        this.description.string = this.rechargeDescription;
        this.myIdLabel.string = this.lobbyUserModel.self.userId.toString();
        let len = this.agencyData.length >= 6 ? 6 : this.agencyData.length;
        this.agencyList.reset(len);
        this.agencyList.run(2, 1);
    }


    private onMyIdCopyHandle(): void {
        let result = NativeUtils.copy(this.myIdLabel.string);
        if (result) this.pushTipsQueueSignal.dispatch('复制成功');
        else this.pushTipsQueueSignal.dispatch('复制失败');
    }

    // update (dt) {}
}
