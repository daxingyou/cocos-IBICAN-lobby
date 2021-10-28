import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import { RechargeReq, RechargeResp } from "../../../protocol/protocols/protocols";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { RechargeRespSignal } from "../../../protocol/signals/signals";

const { ccclass, property } = cc._decorator;
export default class RechargeTask extends ProtocolTask<RechargeResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(RechargeRespSignal)
    private rechargeRespSignal: RechargeRespSignal

    constructor() {
        super(CommandCodes.PPRechargeReq);
    }

    start([amount, payType]: [number, string]) {
        return super.start([amount, payType]) as RechargeTask;
    }


    onTaskStart([amount, payType]: [number,string]) {
        //发送
        let req: RechargeReq = new RechargeReq();
        req.amount = amount;
        req.payFlag = payType;
        this.networkServer.sendDefault(CommandCodes.PPRechargeReq, req);
        //侦听
        this.rechargeRespSignal.on(this, this.onRechargeResp);
    }

    onTaskCancel() {
        this.rechargeRespSignal.off(this, this.onRechargeResp);
    }

    private onRechargeResp(resp: RechargeResp): void {
        this.rechargeRespSignal.off(this, this.onRechargeResp);
        this.done(resp);
    }



}