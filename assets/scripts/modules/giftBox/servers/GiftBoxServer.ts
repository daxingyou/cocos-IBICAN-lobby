import SendBindMobileVerifyCodeTask from "../tasks/SendBindMobileVerifyCodeTask";
import Task from "../../../../libs/common/scripts/utils/Task";
import BindMobileTask from "../tasks/bindMobileTask";
import ReceiveRegAmountTask from "../tasks/ReceiveRegAmountTask";
import FirstRechargeTask from "../tasks/FirstRechargeTask";
import PayType from "../../recharge/models/PayType";
import OperationActivityTask from "../tasks/OperationActivityTask";
import { ErrResp } from "../../../protocol/protocols/protocols";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import GiftBoxModel from "../models/GiftBoxModel";
import OnLoginSuccessSignal from "../../../../libs/common/scripts/modules/login/signals/OnLoginSuccessSignal";

const {ccclass, property} = cc._decorator;

export default class GiftBoxServer extends riggerIOC.Server {
    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(GiftBoxModel)
    private giftBoxModel: GiftBoxModel;

    @riggerIOC.inject(OnLoginSuccessSignal)
    private loginSuccessSignal: OnLoginSuccessSignal;

    constructor() {
        super();
        this.loginSuccessSignal.on(this, this.onLoginSuccess);
    }

    private onLoginSuccess() {
        this.init();
    }

    async init() {
        let task = this.requestOperationActivityList();
        let result = await task.wait();
        if(result.isOk) {
            this.giftBoxModel.operationalActivityList = result.result.list;
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

    dispose() {
        this.loginSuccessSignal.off(this, this.onLoginSuccess);
        super.dispose();
    }

    @riggerIOC.inject(OperationActivityTask)
    private requestOperationActivityListTask:OperationActivityTask;

    requestOperationActivityList(): OperationActivityTask {
        if(this.requestOperationActivityListTask.isWaitting()) return this.requestOperationActivityListTask;
        this.requestOperationActivityListTask.prepare();
        this.requestOperationActivityListTask.start();
        return this.requestOperationActivityListTask;
    }

    sendBindMobileVerifyCode(mobile: string): SendBindMobileVerifyCodeTask {
        let task = new SendBindMobileVerifyCodeTask();
        task.start(mobile);
        return task;
    }

    bindMobile([mobile, verifyCode, password ]): Task {
        let task = new BindMobileTask();
        task.start([mobile, verifyCode, password ]);
        return task;
    }

    receiveRegAmount():Task
    {
        let task = new ReceiveRegAmountTask();
        task.start();
        return task;
    }

    firstRecharge(payType: string = PayType.ALIPAY_SM): FirstRechargeTask {
        let task = new FirstRechargeTask();;
        task.start(payType);
        return task;
    }
}
