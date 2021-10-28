import JPView from "../../../../libs/common/scripts/utils/JPView";
import ShowPopularizeHelpViewSignal from "../signals/ShowPopularizeHelpViewSignal";
import ShowPopularizeReceiveRecordsSignal from "../signals/ShowPopularizeReceiveRecordsSignal";
import ShowPopularizeWithdrawalCommissionSignal from "../signals/ShowPopularizeWithdrawalCommissionSignal";
import PopularizeServer from "../server/PopularizeServer";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import Task from "../../../../libs/common/scripts/utils/Task";
import NativeUtils from "../../../../libs/native/NativeUtils";
import ShowPopularizeCodeImageSignal from "../signals/showPopularizeCodeImageSignal";
import { MyPromotionInformationResp, ErrResp } from "../../../protocol/protocols/protocols";
import QRcodeUI from "../../../utils/qrcode/QRcodeUI";
import PopularizeModel from "../model/PopularizeModel";
import { MyPromotionInformationRespSignal } from "../../../protocol/signals/signals";
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
export default class PopularizeDetailNode extends JPView {

    @property(cc.Button)
    copyCodeImageButton: cc.Button = null;

    @property(cc.Button)
    withdrawalCommissionButton: cc.Button = null;

    @property(cc.Button)
    showHelpButton: cc.Button = null;

    @property(cc.Button)
    showReceiveRecordsButton: cc.Button = null;

    // @property(cc.Sprite)
    // qRcodeUI: cc.Sprite = null;

    @property(cc.Label)
    incomeNum: cc.Label = null;

    @property(cc.Label)
    directlyPerformanceNum: cc.Label = null;

    @property(cc.Label)
    elsePerformanceNum: cc.Label = null;

    @property(cc.Label)
    directlyNum: cc.Label = null;

    @property(cc.Label)
    directlyAddedNum: cc.Label = null;

    @property(cc.Label)
    elseNum: cc.Label = null;

    @property(cc.Label)
    elseAddedNum: cc.Label = null;

    @property(cc.Label)
    commissionTotal: cc.Label = null;

    @property(cc.Label)
    drawCommissionNum: cc.Label = null;

    @property(QRcodeUI)
    qRcodeUI: QRcodeUI = null;

    @riggerIOC.inject(ShowPopularizeHelpViewSignal)
    private showPopularizeHelpViewSignal: ShowPopularizeHelpViewSignal;

    @riggerIOC.inject(ShowPopularizeReceiveRecordsSignal)
    private showPopularizeReceiveRecordsSignal: ShowPopularizeReceiveRecordsSignal;

    @riggerIOC.inject(ShowPopularizeWithdrawalCommissionSignal)
    private showPopularizeWithdrawalCommissionSignal: ShowPopularizeWithdrawalCommissionSignal;

    @riggerIOC.inject(ShowPopularizeCodeImageSignal)
    private showPopularizeCodeImageSignal: ShowPopularizeCodeImageSignal;


    @riggerIOC.inject(PopularizeServer)
    private popularizeServer: PopularizeServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(PopularizeModel)
    private popularizeModel: PopularizeModel;

    @riggerIOC.inject(MyPromotionInformationRespSignal)
    private myPromotionInformationRespSignal: MyPromotionInformationRespSignal;

    

    private qrCodeUrl: string = null;

    constructor() {
        super();
    }

    public onInit(): void {
        super.onInit();
    }

    public onShow(): void {
        super.onShow();
        this.addEventListener();
        this.requestPpopularizeInfos();
    }

    private getDescByNumber(num: number): string {
        num = num || 0;
        let temp: number = ConversionFunction.intToFloat(num, 2);
        return temp.toString();
    }

    public onHide(): void {
        super.onHide();
        this.removeEventListener();
    }

    private addEventListener(): void {
        this.copyCodeImageButton.node.on("click", this.onTouchCopyCode, this);
        this.withdrawalCommissionButton.node.on("click", this.onTouchWithdrawalCommission, this);
        this.showHelpButton.node.on("click", this.onTouchShowHelpButton, this);
        this.showReceiveRecordsButton.node.on("click", this.onTouchShowReceiveRecords, this);
        this.qRcodeUI.node.on(cc.Node.EventType.TOUCH_END, this.onTouchShowCodeImage, this);
        this.myPromotionInformationRespSignal.on(this, this.onGetMyPromotionInformation);
    }

    private removeEventListener(): void {
        this.copyCodeImageButton.node.off("click", this.onTouchCopyCode);
        this.withdrawalCommissionButton.node.off("click", this.onTouchWithdrawalCommission);
        this.showHelpButton.node.off("click", this.onTouchShowHelpButton);
        this.showReceiveRecordsButton.node.off("click", this.onTouchShowReceiveRecords);
        this.qRcodeUI.node.off(cc.Node.EventType.TOUCH_END, this.onTouchShowCodeImage, this);
        this.myPromotionInformationRespSignal.off(this, this.onGetMyPromotionInformation);
    }

    private async requestPpopularizeInfos() {
        let task: Task = this.popularizeServer.requestMyPromotionInformation();
        let ret = await task.wait();
        if (ret.isFailed) {
            let reason = ret.reason;
            if(reason instanceof ErrResp) {
                this.pushTipsQueueSignal.dispatch(reason.errMsg);
            }
        }
    }

    private onGetMyPromotionInformation(data: MyPromotionInformationResp){
        this.incomeNum.string = this.getDescByNumber(data.yesterdayAmount);
        this.directlyPerformanceNum.string = this.getDescByNumber(data.yesterdayDirectAmount);
        this.elsePerformanceNum.string = this.getDescByNumber(data.yesterdayOtherAmount);
        this.directlyNum.string = data.directNumber + "";
        this.directlyAddedNum.string = data.directDayAddNumber + "/" + data.directMonthAddNumber;
        this.elseNum.string = data.otherNumber + "";
        this.elseAddedNum.string = data.otherDayAddNumber + "/" + data.otherMonthAddNumber;
        this.commissionTotal.string = this.getDescByNumber(data.totalCommission);
        this.drawCommissionNum.string = this.getDescByNumber(data.commission);

        this.qrCodeUrl = data.qrCodeUrl;
        this.qRcodeUI.init(this.qrCodeUrl);
    }

    /**拷备分享文本信息 */
    private onTouchCopyCode(event: any): void {
        let result = NativeUtils.copy(this.popularizeModel.qrCodeUrl);
        if (result) this.pushTipsQueueSignal.dispatch('复制成功');
        else this.pushTipsQueueSignal.dispatch('复制失败');
    }

    /** 显示推广帮助界面 */
    private onTouchShowHelpButton(event: any): void {
        this.showPopularizeHelpViewSignal.dispatch();
    }

    /** 显示推广提现界面 */
    private onTouchWithdrawalCommission(event: any): void {
        this.showPopularizeWithdrawalCommissionSignal.dispatch();
    }

    /** 显示推广提现纪录界面 */
    private onTouchShowReceiveRecords(event: any): void {
        this.showPopularizeReceiveRecordsSignal.dispatch();
    }

    /** 显示推广二维码界面 */
    private onTouchShowCodeImage(event: any): void {
        this.showPopularizeCodeImageSignal.dispatch();
    }

    public onDispose(): void {
        super.onDispose();
    }


}
