import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import { RechargeOrderListReq, RechargeOrderListResp } from "../../../protocol/protocols/protocols";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { RechargeOrderListRespSignal } from "../../../protocol/signals/signals";

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
export default class RechargeOrderListTask extends ProtocolTask<RechargeOrderListResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(RechargeOrderListRespSignal)
    private rechargeOrderListRespSignal: RechargeOrderListRespSignal;

    constructor() {
        super(CommandCodes.PPRechargeOrderListReq);
    }

    onTaskStart() {
        let req: RechargeOrderListReq = new RechargeOrderListReq();
        this.networkServer.sendDefault(CommandCodes.PPRechargeOrderListReq, req);
        this.rechargeOrderListRespSignal.on(this, this.onRechargeOrderListResp);
    }

    onTaskCancel() {
        this.rechargeOrderListRespSignal.off(this, this.onRechargeOrderListResp);
    }

    private onRechargeOrderListResp(resp: RechargeOrderListResp) {
        this.rechargeOrderListRespSignal.off(this, this.onRechargeOrderListResp);
        this.setComplete(resp);
    }
}
