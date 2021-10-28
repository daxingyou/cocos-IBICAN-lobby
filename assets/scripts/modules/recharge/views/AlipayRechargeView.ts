
import RechargeServer from "../servers/RechargeServer";
import { ErrResp, RechargeSetting } from "../../../protocol/protocols/protocols";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import WaitablePanel from "../../../../libs/common/scripts/utils/WaitablePanel";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import OnUserInfoUpdateSignal from "../../../../libs/common/scripts/modules/user/signals/OnUserInfoUpdateSignal";
import PayType from "../models/PayType";
import RechargeModel from "../models/RechargeModel";
import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import JPView from "../../../../libs/common/scripts/utils/JPView";

//充值，阿里支付界面
const { ccclass, property } = cc._decorator;

@ccclass
export default class AlipayRechargeView extends JPView {

    @property(cc.EditBox)
    public inputTxt: cc.EditBox = null;

    @property(cc.Button)
    public cancelBtn: cc.Button = null;

    @property(cc.Button)
    public confirmBtn: cc.Button = null;

    @property([cc.Button])
    public btns: cc.Button[] = [];

    @riggerIOC.inject(RechargeServer)
    private rechargeServer: RechargeServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    public pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(OnUserInfoUpdateSignal)
    protected onUserInfoUpdateSignal: OnUserInfoUpdateSignal;

    @riggerIOC.inject(RechargeModel)
    private rechargeModel: RechargeModel;

    constructor() {
        super();
    }

    onInit() {
        super.onInit();
        this.initUsualCoin();
    }

    onShow() {
        super.onShow();
        this.addEventListener();
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
    }

    onDispose() {
        super.onDispose();
    }

    addEventListener() {
        for (let i = 0; i < this.btns.length; i++) {
            this.btns[i] && this.btns[i].node.on('click', this.onClick, this);
        }
        this.cancelBtn.node.on("click", this.cancelHandle, this);
        this.confirmBtn.node.on("click", this.rechargeHandle, this);
    }

    removeEventListener() {
        for (let i = 0; i < this.btns.length; i++) {
            this.btns[i] && this.btns[i].node.off('click', this.onClick, this);
        }
        this.cancelBtn.node.off("click", this.cancelHandle, this);
        this.confirmBtn.node.off("click", this.rechargeHandle, this);
    }

    private alipaySettingInfo: RechargeSetting;
    initUsualCoin() {
        this.alipaySettingInfo = this.rechargeModel.getSettingInfoByType(PayType.ALIPAY_H5);
        if(!this.alipaySettingInfo) {
            this.rechargeServer.initSetting();
            this.alipaySettingInfo = this.rechargeModel.getSettingInfoByType(PayType.ALIPAY_H5);
        }

        if(this.alipaySettingInfo) {
            this.btns.forEach((btn, idx) => {
                cc.find('label', btn.node).getComponent(cc.Label).string = this.alipaySettingInfo.fastAmountList[idx] / 100 + '';
            });
        }

        if(this.alipaySettingInfo && this.alipaySettingInfo.minAmount && this.alipaySettingInfo.maxAmount) {
            this.inputTxt.placeholder = `建议充值${this.alipaySettingInfo.minAmount / 100}-${this.alipaySettingInfo.maxAmount / 100}元`;
        }
    }

    private cancelHandle(): void {
        this.inputTxt.string = "";
    }


    private onClick(btn: cc.Button) {
        //let name = btn.node.name;
        //let label:any= cc.find("Background/label", btn.node);
        let label: cc.Label = btn.node.getChildByName("label").getComponent(cc.Label);
        this.inputTxt.string = label.string;
    }

    //充值
    private async rechargeHandle() {
        this.alipaySettingInfo = this.rechargeModel.getSettingInfoByType(PayType.ALIPAY_H5);
        if(!this.alipaySettingInfo) {
            this.rechargeServer.initSetting();
            this.alipaySettingInfo = this.rechargeModel.getSettingInfoByType(PayType.ALIPAY_H5);
        }
        if(!this.alipaySettingInfo.enable) {
            this.pushTipsQueueSignal.dispatch("抱歉,该通道已关闭");
            return;
        }

        if (this.inputTxt.string == "") {
            this.pushTipsQueueSignal.dispatch("请输入充值金额");
            return;
        }
        if(this.alipaySettingInfo.minAmount && this.alipaySettingInfo.minAmount / 100 > Number(this.inputTxt.string)) {
            this.pushTipsQueueSignal.dispatch(`充值金额必须在${this.alipaySettingInfo.minAmount / 100}-${this.alipaySettingInfo.maxAmount / 100}之间`);
            return;
        }

        if(this.alipaySettingInfo.maxAmount && this.alipaySettingInfo.maxAmount / 100 < Number(this.inputTxt.string)) {
            this.pushTipsQueueSignal.dispatch(`充值金额必须在${this.alipaySettingInfo.minAmount / 100}-${this.alipaySettingInfo.maxAmount / 100}之间`);
            return;
        }

        BaseWaitingPanel.show("正在登录");
        let task = this.rechargeServer.recharge(Number(this.inputTxt.string) * 100, PayType.ALIPAY_H5);
        let result = await task.wait();
        if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
        if (result.isOk) {
            // cc.log(result.result);
            if (result.result.payAction == 2) {
                cc.sys.openURL(result.result.payData);
            }
        }
        else {
            let reason = result.reason as ErrResp;
            this.pushTipsQueueSignal.dispatch(reason.errMsg);
        }
    }







    // update (dt) {}
}
