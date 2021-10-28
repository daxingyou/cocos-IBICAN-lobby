import JPView from "../../../../libs/common/scripts/utils/JPView";
import ShowSafeBoxPanelSignal from "../signals/ShowSafeBoxPanelSignal";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import SettingPanel from "../../setting/views/SettingPanel";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import ShowActivityPanelSignal from "../../activity/signals/ShowActivityPanelSignal";
import { page } from "../../activity/views/ActivityPanel";

import ShowRechargePanelSignal from "../../recharge/signals/ShowRechargePanelSignal";
import ShowWithdrawCashPanelSignal from "../../recharge/signals/ShowWithdrawCashPanelSignal";
import ServicePanel from "../../service/ServicePanel";
import ShowFirstChargePanelSignal from "../../giftBox/signals/ShowFirstChargePanelSignal";
import BindPhonePanel from "../../giftBox/view/BindPhonePanel";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import BindPhoneCompleteSignal from "../../giftBox/signals/BindPhoneCompleteSignal";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import ActivityModel from "../../activity/models/ActivityModel";
import GiftBoxModel from "../../giftBox/models/GiftBoxModel";
import GiftBoxType from "../../giftBox/models/GiftBoxType";
import { FirstRechargeResultPush } from "../../../protocol/protocols/protocols";
import { FirstRechargeResultPushSignal, FirstRechargeRespSignal } from "../../../protocol/signals/signals";
import { orderStatusType } from "../../recharge/views/RechargeDetailsPanel";
import ShowPopularizePanelSignal from "../../popularize/signals/ShowPopularizePanelSignal";
import ShowRankPanelSignal from "../../rank/signals/ShowRankPanelSignal";
import ShowLobbyMailPanelSignal from "../../mail/signals/ShowLobbyMailPanelSignal";
import LobbyMailModel from "../../mail/model/LobbyMailModel";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyMenuView extends JPView {
    @property(cc.Button)
    public safeBoxBtn?: cc.Button = null;

    @property(cc.Button)
    public withdrawBtn?: cc.Button = null;

    @property(cc.Button)
    public popularizeBtn?: cc.Button = null;

    @property(cc.Button)
    public registerForGoldBtn?: cc.Button = null;

    @property(cc.Button)
    public rechargeBtn?: cc.Button = null;

    @property(cc.Button)
    public activityBtn?: cc.Button = null;

    @property(cc.Button)
    public noticeBtn?: cc.Button = null;

    @property(cc.Button)
    public serviceBtn?: cc.Button = null;

    @property(cc.Button)
    public settingBtn?: cc.Button = null;

    @property(cc.Button)
    public fristRecBtn?: cc.Button = null;

    @property(cc.Button)
    public rankBtn?: cc.Button = null;

    @property(cc.Button)
    public mailButton?: cc.Button = null;

    @property(cc.Node)
    public activityRedDotNode?: cc.Node = null;

    @property(cc.Node)
    public noticeRedDotNode?: cc.Node = null;

    @property(cc.Node)
    public mailRedDotNode?: cc.Node = null;

    @property(cc.Node)
    public giftBoxFlag: cc.Node = null;

    @property(cc.Node)
    public lineBetweenImg: cc.Node = null;

    @riggerIOC.inject(ShowSafeBoxPanelSignal)
    private showSafeBoxPanelSignal: ShowSafeBoxPanelSignal;

    @riggerIOC.inject(ShowActivityPanelSignal)
    private showActivityPanelSignal: ShowActivityPanelSignal;

    @riggerIOC.inject(ShowFirstChargePanelSignal)
    private showFirstChargePanelSignal: ShowFirstChargePanelSignal;

    @riggerIOC.inject(ShowRechargePanelSignal)
    private showRechargePanelSignal: ShowRechargePanelSignal;

    @riggerIOC.inject(ShowWithdrawCashPanelSignal)
    private showWithdrawCashPanelSignal: ShowWithdrawCashPanelSignal;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;

    @riggerIOC.inject(BindPhoneCompleteSignal)
    private bindPhoneCompleteSignal: BindPhoneCompleteSignal;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(ActivityModel)
    private activityModel: ActivityModel;

    @riggerIOC.inject(GiftBoxModel)
    private giftBoxModel: GiftBoxModel;

    @riggerIOC.inject(FirstRechargeResultPushSignal)
    private firstRechargeResultPushSignal: FirstRechargeResultPushSignal;

    @riggerIOC.inject(ShowPopularizePanelSignal)
    private showPopularizePanelSignal: ShowPopularizePanelSignal;

    @riggerIOC.inject(ShowRankPanelSignal)
    private showRankPanelSignal: ShowRankPanelSignal;

    @riggerIOC.inject(ShowLobbyMailPanelSignal)
    private showLobbyMailPanelSignal: ShowLobbyMailPanelSignal;

    @riggerIOC.inject(LobbyMailModel)
    private mailModel: LobbyMailModel;

    private _soundHash: { [name: string]: string } = {};
    constructor() {
        super();
    }

    onInit() {
        super.onInit();
    }

    onShow() {
        super.onShow();
        this.addEventListener();
        this.addProtocolListener();
        if (this.giftBoxFlag) this.moveGiftBoxFlag();
        if (this.lobbyUserModel.self.mobile) {
            this.bindPhoneSuccessfulHandle();
        }

        let firstChargeActivityInfo = this.giftBoxModel.getOperationalActivityInfoByCode(GiftBoxType.FIRST_RECHARGE);
        if (!firstChargeActivityInfo) return;
        if (!firstChargeActivityInfo.enable || firstChargeActivityInfo.finish) this.fristRecBtn && (this.fristRecBtn.node.active = false);
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
        this.removeProtocolListener();
    }

    onDispose() {
        super.onDispose();
    }

    addEventListener() {
        let btns: cc.Button[] = [this.safeBoxBtn, this.withdrawBtn, this.popularizeBtn, this.registerForGoldBtn, this.rechargeBtn,
        this.activityBtn, this.noticeBtn, this.serviceBtn, this.settingBtn, this.fristRecBtn, this.rankBtn, this.mailButton];
        for (let i = 0; i < btns.length; i++) {
            btns[i] && btns[i].node.on('click', this.onBtmMenuClick, this);
        }

        if (this.giftBoxFlag) this.bindPhoneCompleteSignal.once(this, this.bindPhoneSuccessfulHandle)
    }

    removeEventListener() {
        let btns: cc.Button[] = [this.safeBoxBtn, this.withdrawBtn, this.popularizeBtn, this.registerForGoldBtn, this.rechargeBtn,
        this.activityBtn, this.noticeBtn, this.serviceBtn, this.settingBtn, this.fristRecBtn, this.rankBtn, this.mailButton];
        for (let i = 0; i < btns.length; i++) {
            btns[i] && btns[i].node.off('click', this.onBtmMenuClick, this);
        }
        if (this.giftBoxFlag) this.bindPhoneCompleteSignal.off(this, this.bindPhoneSuccessfulHandle)
    }

    addProtocolListener() {
        this.firstRechargeResultPushSignal.on(this, this.onFirstRechargeResultPush);
    }

    removeProtocolListener() {
        this.firstRechargeResultPushSignal.off(this, this.onFirstRechargeResultPush);
    }

    private onFirstRechargeResultPush(resp: FirstRechargeResultPush) {
        if (resp.order.status == orderStatusType.failed) {
            this.pushTipsQueueSignal.dispatch('首充订单支付失败');
        }
        else if (resp.order.status == orderStatusType.succeed) {
            this.pushTipsQueueSignal.dispatch('充值金额已发放到您的账户');
            this.fristRecBtn.node.active = false;
        }
    }

    /**
     * 底部菜单栏点击回调
     * @param btn 
     */
    private onBtmMenuClick(btn: cc.Button) {
        let name = btn.node.name;
        switch (name) {
            case 'safeBoxBtn':
                this.showSafeBoxPanelSignal.dispatch();
                break;
            case 'withdrawBtn':
                this.showWithdrawCashPanelSignal.dispatch();
                break;
            case 'popularizeBtn':
                this.showPopularizePanelSignal.dispatch();
                break;
            case 'registerForGoldBtn':
                UIManager.instance.showPanel(BindPhonePanel, LayerManager.uiLayerName, true);
                break;
            case 'rechargeBtn':
                this.showRechargePanelSignal.dispatch();
                break;
            case 'activityBtn':
                if (!this.activityModel.onLineActivitys() || this.activityModel.onLineActivitys().length <= 0) {
                    this.pushTipsQueueSignal.dispatch('暂无活动');
                    return;
                }
                this.showActivityPanelSignal.dispatch(page.activity);
                break;
            case 'noticeBtn':
                if (!this.activityModel.onLineNotices() || this.activityModel.onLineNotices().length <= 0) {
                    this.pushTipsQueueSignal.dispatch('暂无公告');
                    return;
                }
                this.showActivityPanelSignal.dispatch(page.notice);
                break;
            case 'serviceBtn':
                UIManager.instance.showPanel(ServicePanel, LayerManager.uiLayerName, true);
                break;
            case 'settingBtn':
                UIManager.instance.showPanel(SettingPanel, LayerManager.uiLayerName, true);
                break;
            case 'fristRecBtn':
                this.showFirstChargePanelSignal.dispatch();
                break;
            case 'rankBtn':
                this.showRankPanelSignal.dispatch();
                break;
            case 'mailButton':
                this.showLobbyMailPanelSignal.dispatch();
                break;
            default:
                break;
        }
    }

    setActivityRedDot(v: boolean) {
        this.activityRedDotNode && (this.activityRedDotNode.active = v);
    }

    setNoticeRedDot(v: boolean) {
        this.noticeRedDotNode && (this.noticeRedDotNode.active = v);
    }

    setMailRedDot(v: boolean){
        this.mailRedDotNode && (this.mailRedDotNode.active = v);
    }

    private moveGiftBoxFlag(): void {

        let up = cc.moveTo(1.3, cc.v2(25, 52)).easing(cc.easeSineOut());;
        let down = cc.moveTo(1.3, cc.v2(25, 48)).easing(cc.easeSineOut());
        let actionSequence = cc.sequence(up, down).repeatForever();
        this.giftBoxFlag.runAction(actionSequence);

    }

    private bindPhoneSuccessfulHandle(): void {
        if (this.registerForGoldBtn) {
            this.registerForGoldBtn.node.active = false;
        }

        if (this.lineBetweenImg) {
            this.lineBetweenImg.active = false;
        }

        if (this.giftBoxFlag != null) {
            this.giftBoxFlag.stopAllActions();
            this.giftBoxFlag.active = false;
        }
    }
}
