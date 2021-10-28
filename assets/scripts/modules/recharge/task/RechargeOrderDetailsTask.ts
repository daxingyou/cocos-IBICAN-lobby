import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { RechargeOrderReq, RechargeOrderResp } from "../../../protocol/protocols/protocols";
import { RechargeOrderRespSignal } from "../../../protocol/signals/signals";

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
export default class RechargeOrderDetailsTask extends ProtocolTask<RechargeOrderResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(RechargeOrderRespSignal)
    private rechargeOrderRespSignal: RechargeOrderRespSignal

    constructor() {
        super(CommandCodes.PPRechargeReq);
    }

    start(orderId: number) {
        return super.start(orderId) as RechargeOrderDetailsTask;
    }

    onTaskStart(orderId: number) {
        let req: RechargeOrderReq = new RechargeOrderReq();
        req.orderId = orderId;
        this.networkServer.sendDefault(CommandCodes.PPRechargeOrderReq, req);
        this.rechargeOrderRespSignal.on(this, this.onRechargeOrderResp);
    }

    onTaskCancel() {
        this.rechargeOrderRespSignal.off(this, this.onRechargeOrderResp);
    }

    private onRechargeOrderResp(resp: RechargeOrderResp) {
        this.rechargeOrderRespSignal.off(this, this.onRechargeOrderResp);
        this.setComplete(resp);
    }
}
