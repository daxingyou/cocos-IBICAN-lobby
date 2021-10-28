
import PushTipsQueueSignal from "../../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import UserModel from "../../../../../libs/common/scripts/modules/user/models/UserModel";
import OnUserInfoUpdateSignal from "../../../../../libs/common/scripts/modules/user/signals/OnUserInfoUpdateSignal";
import LobbyUserModel from "../../../user/model/LobbyUserModel";
import { ErrResp, WithdrawCountResp, WithdrawMosaicResp } from "../../../../protocol/protocols/protocols";
import RechargeServer from "../../servers/RechargeServer";
import Panel from "../../../../../libs/common/scripts/utils/Panel";
import LobbyUserInfo from "../../../user/model/LobbyUserInfo";
import UIManager from "../../../../../libs/common/scripts/utils/UIManager";
import BindAlipayPanel from "../BindAlipayPanel";
import LayerManager from "../../../../../libs/common/scripts/utils/LayerManager";
import withdrawMosaicTask from "../../task/withdrawMosaicTask";
import WithdrawDetailsPanel, { withdrawDetailsPanelType } from "./WithdrawDetailsPanel";
import BaseWaitingPanel from "../../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import { WithdrawType } from "../../models/RechargeModel";

//提现，转到支付宝界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class AlipayWithdrawView extends Panel {

    @property(cc.Slider)
    public amountSlider: cc.Slider = null;

    @property(cc.Mask)
    public amountMask: cc.Mask = null;

    @property(cc.Button)
    public amountMaxBtn:cc.Button = null;

    @property(cc.Button)
    public submitBtn:cc.Button = null;

    @property(cc.Label)
    public alipayAccountLabel: cc.Label = null;

    @property(cc.Button)
    public bindAlipayBtn: cc.Button = null;

    @property(cc.Label)
    public coinLimtTxt: cc.Label = null;

    @property(cc.Label)
    public withdrawTimes: cc.Label = null;

    @property(cc.EditBox)
    public withdrawCoinTxt: cc.EditBox = null;

    @property(cc.Button)
    public clearCoinBtn: cc.Button = null;

    @property(cc.Label)
    public twoLable: cc.Label = null;

    @property(cc.Label)
    public threeLable: cc.Label = null;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;
    
    @riggerIOC.inject(RechargeServer)
    private rechargeServer: RechargeServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    public pushTipsQueueSignal: PushTipsQueueSignal;
    
    @riggerIOC.inject(OnUserInfoUpdateSignal)
    protected onUserInfoUpdateSignal: OnUserInfoUpdateSignal;

    private midMoney: number = 0;
    private maxMoney: number = 0;
    private serviceCharge: number = 0;
   

    constructor() {
        super();
    }

    onInit() {
        super.onInit();
    }

    onShow() {
        super.onShow();
        this.addEventListener();
        this.initView();
        // this.setMoneySliderValue(0);
        this.amountSlider.node.emit('slide', this.amountSlider);
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
    }

    onDispose() {
        super.onDispose();
    }

    async initView() {
        this.coinLimtTxt.string = this.lobbyUserModel.self.balance + '';
        let bindAlipay = (this.lobbyUserModel.self as LobbyUserInfo).bindAlipay;
        if((bindAlipay)) {
            this.bindAlipayBtn.node.active = false;
            this.alipayAccountLabel.string = `${bindAlipay.alipayAccount.substr(0, 3)}********`;
        }
        else {
            this.bindAlipayBtn.node.active = true;
            this.alipayAccountLabel.string = `您还未绑定支付宝`;
        }
        this.onWithDrawMoney()
        let withdrawCountTaks = this.rechargeServer.getWithdrawCountTime();
        let result = await withdrawCountTaks.wait();
        if(result.isOk) {
            this.withdrawTimes.string = result.result.alipayCount + '';
        }
        else {
            let reason = result.reason;
            if(reason instanceof ErrResp) {
                this.pushTipsQueueSignal.dispatch(reason.errMsg);
            }
            else {
                this.pushTipsQueueSignal.dispatch(reason);
            }
            this.withdrawTimes.string = '0';
        }
    }

    async onWithDrawMoney(){
        let withdrawMoneyTasks = this.rechargeServer.getWithdrawMaxMidMoney();
        let result = await withdrawMoneyTasks.wait();
        if(result.isOk) {
            // this.withdrawTimes.string = result.result.alipayCount + '';
            let drawList = result.result.list
            drawList.forEach((info)=>{
                if(info.withdrawWay == WithdrawType.alipay){
                    this.midMoney = info.minAmount
                    this.maxMoney = info.maxAmount
                    this.serviceCharge = info.serviceFeeRadix
                }
            })
            
            this.twoLable.string = '2、转出额度为：'+this.midMoney+'-'+this.maxMoney+'，只能转出'+this.midMoney+'的整数倍'
            this.threeLable.string = '3、每次转出抽取'+this.serviceCharge+'%的手续费，由支付宝收取'
        }
        else {
            let reason = result.reason;
            if(reason instanceof ErrResp) {
                this.pushTipsQueueSignal.dispatch(reason.errMsg);
            }
            else {
                this.pushTipsQueueSignal.dispatch(reason);
            }
            // this.withdrawTimes.string = '0';
        }
    }

    addEventListener() {
        this.amountSlider.node.on('slide', this.onSliderChange, this);
        this.amountMaxBtn.node.on("click", this.maxAmountHandle, this);
        this.submitBtn.node.on("click", this.withdraw, this);
        this.withdrawCoinTxt.node.on('editing-did-ended', this.onMoneyInputEnd, this);
        this.clearCoinBtn.node.on('click', this.onClearCoinClick, this);
        this.bindAlipayBtn.node.on('click', this.onBindAlipayClick, this);
        this.onUserInfoUpdateSignal.on(this, this.onUserInfoUpdate);
    }

    removeEventListener() {
       this.amountSlider.node.off('slide', this.onSliderChange, this);
       this.amountMaxBtn.node.off("click", this.maxAmountHandle, this);
       this.submitBtn.node.off("click", this.withdraw, this);
       this.withdrawCoinTxt.node.off('editing-did-ended', this.onMoneyInputEnd, this);
       this.clearCoinBtn.node.off('click', this.onClearCoinClick, this);
       this.bindAlipayBtn.node.off('click', this.onBindAlipayClick, this);
       this.onUserInfoUpdateSignal.off(this, this.onUserInfoUpdate);
    }

    private onUserInfoUpdate() {
        let bindAlipay = (this.lobbyUserModel.self as LobbyUserInfo).bindAlipay;
        if((bindAlipay)) {
            this.bindAlipayBtn.node.active = false;
            this.alipayAccountLabel.string = `${bindAlipay.alipayAccount.substr(0, 3)}********`;
        }
    }

    private onBindAlipayClick() {
        UIManager.instance.showPanel(BindAlipayPanel, LayerManager.uiLayerName, true);
    }

    private onClearCoinClick() {
        this.setMoneySliderValue(0);
    }

    private onMoneyInputEnd(input: cc.EditBox) {
        let number = Number(input.string);
        if(number > 0){
            let MaxLimtCoin: number = Number(this.coinLimtTxt.string) > this.maxMoney ? this.maxMoney : Number(this.coinLimtTxt.string);
            if(number >= MaxLimtCoin) number = MaxLimtCoin;
            number = Math.floor(number); //保持整数
            let sliderValue = MaxLimtCoin <= 0 ? 0 : number / MaxLimtCoin;
            this.setMoneySliderValue(sliderValue);
        }
        else {
            cc.log('The input amount is not a number')
            input.string = '';
            this.setMoneySliderValue(0);
        }
    }

    //最大
    private maxAmountHandle():void {
        this.setMoneySliderValue(1);
    }

    /**
     * 设置金额滑动条的值
     * @param v 
     */
    private setMoneySliderValue(v: number) {
        this.amountSlider.progress = v;
        this.amountSlider.node.emit('slide', this.amountSlider);
        this.setMoneyInputTxt(v);
    }

     /**
     * 滑动条事件
     * @param slider 
     */
    private onSliderChange(slider: cc.Slider) 
    {
        this.amountMask.node.width = this.amountSlider.node.width * this.amountSlider.progress;
        this.setMoneyInputTxt(this.amountSlider.progress);
    }

    private setMoneyInputTxt(v: number) {
        v <= 0 && (v=0);
        v >= 1 && (v=1);
        let limitCount = this.lobbyUserModel.self.balance > this.maxMoney ? this.maxMoney : this.lobbyUserModel.self.balance
        let coin: number = Math.ceil(limitCount * v);
        coin = this.midMoney > 0 ? coin - coin % this.midMoney : 0;
        this.withdrawCoinTxt.string = `${coin}`;
    }

    private async withdraw() {
        if(this.bindAlipayBtn.node.active) {
            this.pushTipsQueueSignal.dispatch('请绑定支付宝');
            return;
        }

        if(parseInt(this.withdrawTimes.string) < 1) {
            this.pushTipsQueueSignal.dispatch('今日转出次数已达上限!');
            return;
        }

        let withdrawCoin: number = parseInt(this.withdrawCoinTxt.string);
        if(!withdrawCoin || withdrawCoin <= 0) {
            this.pushTipsQueueSignal.dispatch('转出最低金额为100.00');
            return;
        }

        BaseWaitingPanel.show("");
        let task: withdrawMosaicTask = this.rechargeServer.requestWithdrawMosaic(parseInt(this.withdrawCoinTxt.string) * 100, WithdrawType.alipay);
        this.submitBtn.interactable = false;
        let result = await task.wait();
        this.submitBtn.interactable = true;
        if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);

        if(result.isOk) {
            UIManager.instance.showPanel(WithdrawDetailsPanel, LayerManager.uiLayerName, true, [withdrawDetailsPanelType.withdrawReqDetailsPanel, result.result]);
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
}
