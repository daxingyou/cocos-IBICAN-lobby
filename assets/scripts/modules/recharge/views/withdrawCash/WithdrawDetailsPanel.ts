import Panel from "../../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../../libs/common/scripts/utils/UIManager";
import ServicePanel from "../../../service/ServicePanel";
import LayerManager from "../../../../../libs/common/scripts/utils/LayerManager";
import { WithdrawMosaicResp, WithdrawOrder, ErrResp } from "../../../../protocol/protocols/protocols";
import WithdrawCashPanel from "./WithdrawCashPanel";
import UserModel from "../../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../../../user/model/LobbyUserModel";
import LobbyUserInfo from "../../../user/model/LobbyUserInfo";
import RechargeServer from "../../servers/RechargeServer";
import BaseAlertInfo, { BaseAlertStyle, BaseAlertResult } from "../../../../../libs/common/scripts/modules/tips/models/BaseAlertInfo";
import BaseAlertPanel from "../../../../../libs/common/scripts/modules/tips/views/BaseAlertPanel";
import PushTipsQueueSignal from "../../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import BaseWaitingPanel from "../../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import { WithdrawType } from "../../models/RechargeModel";

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
export default class WithdrawDetailsPanel extends Panel {
    @property(cc.Button)
    private closeBtn: cc.Button = null;

    @property(cc.Button)
    private connectServericeBtn: cc.Button = null;

    @property(cc.Button)
    private continueBtn: cc.Button = null;

    @property(cc.Button)
    private cancelBtn: cc.Button = null;

    @property([cc.Vec2])
    private pos: cc.Vec2[] = [];

    @property(cc.Node)
    private mainContent: cc.Node = null;

    @property([cc.SpriteFrame])
    private statusSignSpriteFrames: cc.SpriteFrame[] = [];

    @property(cc.Node)
    private statusView: cc.Node = null;

    @property(cc.Sprite)
    private statusSign: cc.Sprite = null;

    @property(cc.Label)
    private statusTxt: cc.Label = null;

    @property(cc.Label)
    private failedTipsTxt: cc.Label = null;

    @property(cc.Label)
    private withdrawCoinTxt: cc.Label = null;

    @property(cc.RichText)
    private rechargeStreamCodeTxt: cc.RichText = null;

    @property(cc.RichText)
    private favorableStreamCodeTxt: cc.RichText = null;

    @property(cc.RichText)
    private handlingChargeTxt: cc.RichText = null;

    @property(cc.Label)
    private actualCoinTxt: cc.Label = null;

    @property(cc.Label)
    private withdrawTimeTxt: cc.Label = null;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;

    @riggerIOC.inject(RechargeServer)
    private rechargeServer: RechargeServer;

    constructor() {
        super();
    }

    onShow() {
        this.addEventListener();
    }
    
    onHide() {
        this.removeEventListener();
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
    }

    private currenPage: number;
    /**
     * 界面切换 
     * @param index 1-转出请求 详情界面 2-转出记录 详情界面 
     */
    viewChange(index: number) {
        this.currenPage = index;
        switch(index) {
            case withdrawDetailsPanelType.withdrawRecordDetailsPanel:
                this.statusView.active = true;
                this.connectServericeBtn.node.active = true;
                this.continueBtn.node.active = false;
                this.cancelBtn.node.active = false;
                this.mainContent.setPosition(this.pos[1]);
                break;
            case withdrawDetailsPanelType.withdrawReqDetailsPanel:
                this.statusView.active = false;
                this.connectServericeBtn.node.active = false;
                this.continueBtn.node.active = true;
                this.cancelBtn.node.active = true;
                this.mainContent.setPosition(this.pos[0]);
                break;
            default :
                break;
        }
    }

    /**
     * 更新界面
     * @param result 
     */
    updateView(result: WithdrawMosaicResp | WithdrawOrder) {
        if(result instanceof WithdrawMosaicResp) {
            this.updateLabel(result.amount, result.totalRechargeMosaic, result.totalGiftMosaic, result.withdrawWay, result.manageFeeRadix, result.totalRechargeMosaicFee, result.serviceFeeRadix, result.serviceFee, result.realAmount, result.time);
            this.withdrawCoin = result.amount;
            this.actualWithdrawCoin = result.realAmount;
            this.withdrawWay = result.withdrawWay;
        }

        if(result instanceof WithdrawOrder) {
            this.updateLabel(result.amount, result.rechargeMosaic, result.giftMosaicFee, result.withdrawWay, result.manageFeeRadix, result.rechargeMosaicFee, result.serviceFeeRadix, result.serviceFee, result.realAmount, result.createTime);
            this.updateStatusView(result.status);
        }
    }

    /**
     * 更新主体内容
     * @param withdrawCoin 转出金额
     * @param rechargeMosaicCoin 充值流水打码
     * @param giftAmount 优惠充值打码
     * @param withdrawWay 转出方式
     * @param serviceFeeRadix 手续费系数
     * @param serviceFee 手续费
     * @param realAmount 实际提现金额
     * @param time 提现时间
     */
    updateLabel(withdrawCoin: number, rechargeMosaicCoin: number, giftAmount: number, withdrawWay: number, rechargeMosaicCoefficient: number, totalRechargeMosaicFee: number, serviceFeeRadix: number, serviceFee: number, realAmount: number, time: string) {
        //转出金额
        this.withdrawCoinTxt.string = withdrawCoin / 100 + '';

        //充值流水打码
        if(rechargeMosaicCoin <= 0) {
            this.rechargeStreamCodeTxt.string = '<color=#ffffff>全部通过打码,无需扣除行政费!</color>';
        }
        else {
            this.rechargeStreamCodeTxt.string = `<color=#ffffff>${rechargeMosaicCoin / 100}</color> <color=#ffffff>未通过打码,需扣除${rechargeMosaicCoefficient}%行政费:</color><color=#FF782E>${totalRechargeMosaicFee / 100}</color>`;
        }
 
        //优惠流水打码
        if(giftAmount <= 0) {
            this.favorableStreamCodeTxt.string = '<color=#ffffff>全部通过打码,无需扣除优惠金额!</color>';
        }
        else {
            this.favorableStreamCodeTxt.string = `<color=#ffffff>${giftAmount / 100}</coloc> <color=#ffffff>未通过打码,需扣除优惠金额:</color><color=#FF782E>${giftAmount / 100}</color>`;
        }

        //手续费
        if(withdrawWay == WithdrawType.alipay) {
            this.handlingChargeTxt.string = `<color=#ffffff>通过支付宝转出,需扣除${serviceFeeRadix}%手续费:</color><color=#FF782E>${serviceFee / 100}</color>`
        }
        else if(withdrawWay == WithdrawType.bank) {
            this.handlingChargeTxt.string = `<color=#ffffff>通过银行卡转出,需扣除${serviceFeeRadix}%手续费:</color><color=#FF782E>${serviceFee / 100}</color>`
        }
        else if(withdrawWay == WithdrawType.weixin) {
            this.handlingChargeTxt.string = `<color=#ffffff>通过微信转出,需扣除${serviceFeeRadix}%手续费:</color><color=#FF782E>${serviceFee / 100}</color>`
        }

        //实际提现金额
        this.actualCoinTxt.string = realAmount / 100 + '';

        //兑换时间
        this.withdrawTimeTxt.string = time.replace(/-/g, '/');
    }

    /**更新转出状态 */
    updateStatusView(status: number) {
        let str: string;
        let color: cc.Color;
        let spriteFrame: cc.SpriteFrame = this.statusSignSpriteFrames[status - 1];;
        this.failedTipsTxt.node.active = false;
        switch(status) {
            case withdrawStatusType.wait:
                str = '等待中';
                color = new cc.Color(236, 106, 0);
                break;
            case withdrawStatusType.succeed:
                str = '转出成功';
                color = new cc.Color(1, 158, 97);
                break;
            case withdrawStatusType.failed:
                str = '转出失败';
                color = new cc.Color(231, 0, 0);
                this.failedTipsTxt.node.active = true;
                break;
            default :
                break;
        }
        this.statusSign.spriteFrame = spriteFrame;
        this.statusTxt.string = str;
        this.statusTxt.node.color = color;
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.connectServericeBtn.node.on('click', this.onConnectServericeClick, this);
        this.continueBtn.node.on('click', this.onContinueBtnClick, this);
        this.cancelBtn.node.on('click', this.onCancelBtnClick, this);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick, this);
        this.connectServericeBtn.node.off('click', this.onConnectServericeClick, this);
        this.continueBtn.node.off('click', this.onContinueBtnClick, this);
        this.cancelBtn.node.off('click', this.onCancelBtnClick, this);
    }

    private onCloseBtnClick() {
        this.closeWindow();
    }

    private rechargeMosaiCoefficient = 0.5; //充值流水打码系数
    /**
     * 充值流水打码 扣除的行政费
     * @param rechargeCoin 
     */
    private countTotalRechargeMosaic(rechargeCoin: number): number {
        if(rechargeCoin <= 0) return 0;
        return rechargeCoin * 0.5;
    }

    /**联系客服 */
    private onConnectServericeClick() {
        UIManager.instance.showPanel(ServicePanel, LayerManager.uiLayerName, true);
    }

    private withdrawCoin: number;
    private actualWithdrawCoin: number;
    private withdrawWay: number;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    /**提现 */
    private async onContinueBtnClick() {
        if(this.actualWithdrawCoin <= 0) this.pushTipsQueueSignal.dispatch('转出金额不足');
        let account: string;
        if(this.withdrawWay == WithdrawType.alipay) {
            account = (this.lobbyUserModel.self as LobbyUserInfo).bindAlipay.alipayAccount;
        }
        if(this.withdrawWay == WithdrawType.bank) {
            account = (this.lobbyUserModel.self as LobbyUserInfo).bindBanks.bankCard;
        }
        
        BaseWaitingPanel.show("正在登录");
        let task = this.rechargeServer.withdraw(this.withdrawCoin, this.withdrawWay, account);
        let result = await task.wait();
        if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
        if(result.isOk) {
            let info: BaseAlertInfo = new BaseAlertInfo();
            info.content = `提现申请已提交!<br/>审核通过后立即发放。工作日24小时内可到账。<br/>如有任何问题请联系客服处理!`;
            info.style = BaseAlertStyle.YES;
            let Panel: BaseAlertPanel = BaseAlertPanel.show(info);
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
        // let choice: BaseAlertResult = await Panel.wait();
        // if(choice == BaseAlertResult.YES) {

        // }
    }

    /**取消 */
    private onCancelBtnClick() {
        // this.closeWindow();
        UIManager.instance.showPanel(WithdrawCashPanel, LayerManager.uiLayerName, true);
    }
}

export enum withdrawDetailsPanelType {
    /**转出请求 详情界面 */
    withdrawReqDetailsPanel = 1,

    /**转出记录 详情界面 */
    withdrawRecordDetailsPanel
}

export enum withdrawStatusType {
    /**等待转出 */
    wait = 1,

    /**转出成功 */
    succeed,

    /**转出失败 */
    failed
}
