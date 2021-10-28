import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { WithdrawRespSignal } from "../../../protocol/signals/signals";
import { WithdrawResp, WithdrawReq } from "../../../protocol/protocols/protocols";
import CommandCodes from "../../../protocol/CommandCodes";

const { ccclass, property } = cc._decorator;
export default class WithdrawTask extends ProtocolTask<WithdrawResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(WithdrawRespSignal)
    private withdrawRespSignal: WithdrawRespSignal

    constructor() {
        super(CommandCodes.PPWithdrawReq);
    }

    start([amount, withdrawWay, withdrawAccount]: [number, number, string]) {
        return super.start([amount, withdrawWay, withdrawAccount]) as WithdrawTask;
    }

    onTaskStart([amount, withdrawWay, withdrawAccount]) {
        //发送
        let req: WithdrawReq = new WithdrawReq();
        req.amount = amount;
        req.withdrawWay = withdrawWay;
        req.withdrawAccount = withdrawAccount;
        this.networkServer.sendDefault(CommandCodes.PPWithdrawReq, req);
        //侦听
        this.withdrawRespSignal.on(this, this.onWithdrawResp);
    }

    onTaskCancel() {
        this.withdrawRespSignal.off(this, this.onWithdrawResp);
    }

    private onWithdrawResp(resp: WithdrawResp): void {
        this.withdrawRespSignal.off(this, this.onWithdrawResp);
        this.setComplete(resp);
    }
}