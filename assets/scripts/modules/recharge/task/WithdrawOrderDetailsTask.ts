import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { WithdrawOrderRespSignal } from "../../../protocol/signals/signals";
import { WithdrawOrderReq, WithdrawOrderResp } from "../../../protocol/protocols/protocols";

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
export default class WithdrawOrderDetailsTask extends ProtocolTask<WithdrawOrderResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(WithdrawOrderRespSignal)
    private withdrawOrderRespSignal: WithdrawOrderRespSignal;

    constructor() {
        super(CommandCodes.PPWithdrawOrderReq);
    }

    start(orderId: number) {
        return super.start(orderId) as WithdrawOrderDetailsTask;
    }

    onTaskStart(orderId: number) {
        let req: WithdrawOrderReq = new WithdrawOrderReq();
        req.orderId = orderId;
        this.networkServer.sendDefault(CommandCodes.PPWithdrawOrderReq, req);
        this.withdrawOrderRespSignal.on(this, this.onWithdrawOrderResp);
    }

    onTaskCancel() {
        this.withdrawOrderRespSignal.off(this, this.onWithdrawOrderResp);
    }

    private onWithdrawOrderResp(resp: WithdrawOrderResp) {
        this.withdrawOrderRespSignal.off(this, this.onWithdrawOrderResp);
        this.setComplete(resp);
    }
}
