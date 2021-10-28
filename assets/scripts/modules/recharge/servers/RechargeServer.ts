import Task from "../../../../libs/common/scripts/utils/Task";
import RechargeTask from "../task/RechargeTask";
import WithdrawTask from "../task/WithdrawTask";
import { RechargeResultPushSignal } from "../../../protocol/signals/signals";
import { RechargeResultPush, ErrResp } from "../../../protocol/protocols/protocols";
import RechargeOrderListTask from "../task/RechargeOrderListTask";
import RechargeOrderDetailsTask from "../task/RechargeOrderDetailsTask";
import LobbyServer from "../../lobby/servers/LobbyServer";
import BindBankTask from "../task/BindBankTask";
import BindAlipayTask from "../task/BindAlipayTask";
import WithdrawCountTask from "../task/WithdrawCountTask";
import withdrawMosaicTask from "../task/withdrawMosaicTask";
import WithdrawOrderDetailsTask from "../task/WithdrawOrderDetailsTask";
import WithdrawOrderListTask from "../task/WithdrawOrderListTask";
import RunningWaterListTask from "../task/RunningWaterListTask";
import MoneyRunningWaterListTask from "../task/MoneyRunningWaterListTask";
import RunningWaterTypeTask from "../task/RunningWaterTypeTask";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import RechargeSetTask from "../task/RechargeSetTask";
import RechargeModel from "../models/RechargeModel";
import RechargeAgencyTask from "../task/RechargeAgencyTask";
import WithdrawMoneyTask from "../task/WithdrawMoneyTask";
import OnLoginSuccessSignal from "../../../../libs/common/scripts/modules/login/signals/OnLoginSuccessSignal";

const { ccclass, property } = cc._decorator;

export default class RechargeServer extends riggerIOC.Server {
    @riggerIOC.inject(RechargeResultPushSignal)
    private rechargeResultPushSignal: RechargeResultPushSignal;

    @riggerIOC.inject(LobbyServer)
    private lobbyServer: LobbyServer;

    @riggerIOC.inject(RechargeModel)
    private rechargeModel: RechargeModel;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(OnLoginSuccessSignal)
    private onLoginSuccessSignal: OnLoginSuccessSignal;

    constructor() {
        super();
        this.addProtocolListener();
    }
    addProtocolListener() {
        this.rechargeResultPushSignal.on(this, this.onRechargeResultPush);
        this.onLoginSuccessSignal.on(this, this.initSetting);
    }

    removeProtocolListener() {
        this.rechargeResultPushSignal.off(this, this.onRechargeResultPush);
        this.onLoginSuccessSignal.off(this, this.initSetting);
    }

    async initSetting() {
        let task = this.requestRechargeSetting();
        let result = await task.wait();
        task.dispose();
        if(result.isOk) {
            this.rechargeModel.rechargeSettings = result.result.list;
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

    //-----------------------------------充值----------------------------//
    /**
     * 充值设置信息
     */
    private requestRechargeSetting(): RechargeSetTask {
        let task: RechargeSetTask = new RechargeSetTask();
        task.start();
        return task;
    }

    /**
     * 充值结果推送
     * @param resp 
     */
    private onRechargeResultPush(resp: RechargeResultPush) {
        if(resp.order.status == 2) {
            this.pushTipsQueueSignal.dispatch('充值成功');
            //支付成功
            this.lobbyServer.getUserAmount();
        }
    }

    /**
     * 充值请求
     * @param amount 充值金额
     * @param payType 充值方式
     */
    recharge(amount: number, payType: string): RechargeTask {
        let task = new RechargeTask();
        task.start([amount, payType]);
        return task;
    }

    /**
     * 充值订单列表
     */
    requestRechargeOrderList(): RechargeOrderListTask {
        let task: RechargeOrderListTask = new RechargeOrderListTask();
        task.timeout = 5000;
        task.start();
        return task;
    }

    /**
     * 充值订单详情
     * @param orderId 
     */
    requestRechargeOrderDetails(orderId: number): RechargeOrderDetailsTask {
        let task: RechargeOrderDetailsTask = new RechargeOrderDetailsTask();
        task.timeout = 5000;
        task.start(orderId);
        return task;
    }

    /**
     * 代理充值列表请求
     */
    requestRechargeAgencyList(pageNum: number = 1): RechargeAgencyTask {
        let task: RechargeAgencyTask = new RechargeAgencyTask();
        task.start(pageNum);
        return task;
    }


    //---------------------------------------提现----------------------------//
    /**
     * 提现请求
     * @param amount 金额 
     * @param withdrawWay 方式
     * @param withdrawAccount 账号
     */
    withdraw(amount: number, withdrawWay: number, withdrawAccount: string): WithdrawTask {
        let task = new WithdrawTask();
        task.start([amount, withdrawWay, withdrawAccount]);
        return task;
    }

    /**
     * 获取当天剩余提现次数
     */
    getWithdrawCountTime(): WithdrawCountTask {
        let task = new WithdrawCountTask();
        task.timeout = 5000;
        task.start();
        return task;
    }

    /**
     * 获取提现最大最小金额
     */
    getWithdrawMaxMidMoney(): WithdrawMoneyTask {
        let task = new WithdrawMoneyTask();
        task.timeout = 5000;
        task.start();
        return task;
    }

    /**
     * 绑定银行卡
     * @param account 
     * @param ownerName 
     * @param bankName 
     */
    requestBindBank(account: string, ownerName: string, bankName: string): BindBankTask {
        let task: BindBankTask = new BindBankTask();
        task.timeout = 5000;
        task.start([account, ownerName, bankName]);
        return task;
    }

    /**
     * 绑定支付宝
     * @param account 
     * @param ownerName 
     */
    requestBindAlipay(account: string, ownerName: string): BindAlipayTask {
        let task: BindAlipayTask = new BindAlipayTask();
        task.timeout = 5000;
        task.start([account, ownerName]);
        return task;
    }

    /**
     * 提现打码请求
     * @param coin 
     * @param withdrawType 
     */
    requestWithdrawMosaic(coin: number, withdrawType: number): withdrawMosaicTask {
        let task: withdrawMosaicTask = new withdrawMosaicTask();
        task.timeout = 5000;
        task.start([coin, withdrawType]);
        return task;
    }

    /**
     * 提现订单详情
     * @param OrderId 
     */
    requestWithdrawOrderDetails(OrderId: number): WithdrawOrderDetailsTask {
        let task: WithdrawOrderDetailsTask = new WithdrawOrderDetailsTask();
        task.timeout = 5000;
        task.start(OrderId);
        return task;
    }

    /**
     * 提现订单列表
     */
    requestWithdrawOrderList(): WithdrawOrderListTask {
        let task: WithdrawOrderListTask = new WithdrawOrderListTask();
        task.timeout = 5000;
        task.start();
        return task;
    }

    //---------------------------流水--------------------------//
    /**
     * 玩家流水
     * @param timeKeyWord 时间关键字 RunningWaterTimeKeyWord
     * @param types 流水类型 RunningWaterType
     */
    requestRunninWater(timeKeyWord: string, types: number[]) {
        let task: RunningWaterListTask = new RunningWaterListTask();
        task.timeout = 5000;
        task.start([timeKeyWord, types]);
        return task;
    }

    /**
     * 资金流水详情(打码详情)
     */
    requestMoneyRunningWaterList(): MoneyRunningWaterListTask {
        let task: MoneyRunningWaterListTask = new MoneyRunningWaterListTask();
        task.timeout = 5000;
        task.start();
        return task;
    }

    /**
     * 流水类型
     */
    requestRunningWaterType(): RunningWaterTypeTask {
        let task: RunningWaterTypeTask = new RunningWaterTypeTask();
        task.timeout = 5000;
        task.start();
        return task;
    }
}