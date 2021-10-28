import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import PopularizeServer from "../server/PopularizeServer";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import { ErrResp, MyPromotionInformationResp } from "../../../protocol/protocols/protocols";
import { MyPromotionInformationRespSignal } from "../../../protocol/signals/signals";
import LobbyUserInfo from "../../user/model/LobbyUserInfo";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import OnUserInfoUpdateSignal from "../../../../libs/common/scripts/modules/user/signals/OnUserInfoUpdateSignal";
import PopularizeModel from "../model/PopularizeModel";
import ReqDrawCommissionTask from "../task/ReqDrawCommissionTask";
import ConversionFunction from "../../../../libs/common/scripts/utils/mathUtils/ConversionFunction";


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
export default class PopularizeWithdrawalCommissionPanel extends Panel {
    @property(cc.Button)
    private closeBtn: cc.Button = null;

    @property(cc.Button)
    private drawalCommissionButton: cc.Button = null;

    @property(cc.EditBox)
    private drawNumberInput: cc.EditBox = null;

    @property(cc.Label)
    private commissionNumber: cc.Label = null;

    @property(cc.Label)
    private balanceNumber: cc.Label = null;

    @property(cc.Node)
    private clearNum: cc.Node = null;

    @property(cc.Node)
    private drawalAll: cc.Node = null;

    @riggerIOC.inject(UserModel)
    private userModel: UserModel;

    @riggerIOC.inject(PopularizeServer)
    public popularizeServer: PopularizeServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    public pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(MyPromotionInformationRespSignal)
    private myPromotionInformationRespSignal: MyPromotionInformationRespSignal;

    @riggerIOC.inject(OnUserInfoUpdateSignal)
    protected onUserInfoUpdateSignal: OnUserInfoUpdateSignal;

    @riggerIOC.inject(PopularizeModel)
    private popularizeModel: PopularizeModel;
    
    private goldCount: number = 0;

    constructor() {
        super();
    }

    start(){
        super.start();
    }

    onInit() {
        super.onInit();
    }
            
    onShow() {
        super.onShow();
        this.addEventListener();
        this.initView();
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
    }

    onDispose() {
        super.onDispose();
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.drawalCommissionButton.node.on('click', this.onTouchDrawalCommission, this);
        this.drawNumberInput.node.on('editing-did-ended', this.drawNumberInputCallback, this);
        this.clearNum.on(cc.Node.EventType.TOUCH_END, this.cancelHandle, this);
        this.drawalAll.on(cc.Node.EventType.TOUCH_END, this.drawalAllGold, this);
        this.myPromotionInformationRespSignal.on(this, this.onGetMyPromotionInformation);
        this.onUserInfoUpdateSignal.on(this, this.onUserInfoUpdate);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick, this);
        this.drawalCommissionButton.node.off('click', this.onTouchDrawalCommission, this);
        this.drawNumberInput.node.off('editing-did-ended', this.drawNumberInputCallback, this);
        this.clearNum.off(cc.Node.EventType.TOUCH_END, this.cancelHandle, this);
        this.drawalAll.off(cc.Node.EventType.TOUCH_END, this.drawalAllGold, this);
        this.myPromotionInformationRespSignal.off(this, this.onGetMyPromotionInformation);
        this.onUserInfoUpdateSignal.off(this, this.onUserInfoUpdate);
    }

    private initView(){
        this.onUserInfoUpdate();
        this.goldCount = this.popularizeModel.dataCommission;
        this.commissionNumber.string = ConversionFunction.intToFloat(this.goldCount, 2)  + "元";
    }

    private onGetMyPromotionInformation(data: MyPromotionInformationResp){
        this.commissionNumber.string = ConversionFunction.intToFloat(data.commission, 2) + "元";
        this.popularizeModel.myPromotionInformationResp = data;
        this.goldCount = data.commission;
    }

    private onUserInfoUpdate(){
        let self: LobbyUserInfo = this.userModel.self as LobbyUserInfo;
        this.balanceNumber.string = self.balance + "元";
    }

    private cancelHandle(): void {
        this.drawNumberInput.string = "";
    }

    private drawalAllGold(): void {
        this.drawNumberInput.string = ConversionFunction.intToFloat(this.goldCount, 2) + "";
    }

    private drawNumberInputCallback(){
        // let inputNum: number = parseInt(this.drawNumberInput.string) 
        let inputNum = this.drawNumberInput.string ? parseInt(this.drawNumberInput.string) : ''
        this.drawNumberInput.string = inputNum.toString();
    }

    private getNumberByDesc(str: string): number{
        return Math.floor(parseFloat(str));
    }

    async onTouchDrawalCommission() {
        if (this.drawNumberInput.string == "") {
            this.pushTipsQueueSignal.dispatch("请您输入要转出的金额");
            return;
        }
        let number: number = this.getNumberByDesc(this.drawNumberInput.string);
        if (number < 1 || number > this.popularizeModel.dataCommission/100) {
            cc.log(Math.floor(this.goldCount))
            let string = number < 1 ? "最低需转出1元" : "可转出金额不足!"
            this.pushTipsQueueSignal.dispatch(string);
            return;
        }
        let task: ReqDrawCommissionTask = this.popularizeServer.requestDrawCommission(number * 100);
        let ret = await task.wait();
        if (ret.isOk) {
            this.pushTipsQueueSignal.dispatch("提取成功，佣金已转到您的账户余额中！");
            this.cancelHandle();
        }
        else {
            let reason = ret.reason;
            if(reason instanceof ErrResp) {
                this.pushTipsQueueSignal.dispatch(reason.errMsg);
            }
        }
    }


    /**关闭按钮 */
    private onCloseBtnClick() {
        this.closeWindow();
    }

}