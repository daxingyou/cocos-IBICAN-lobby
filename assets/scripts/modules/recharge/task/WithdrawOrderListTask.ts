import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { WithdrawOrderListRespSignal } from "../../../protocol/signals/signals";
import { WithdrawOrderListReq, WithdrawOrderListResp } from "../../../protocol/protocols/protocols";

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
export default class WithdrawOrderListTask extends ProtocolTask<WithdrawOrderListResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(WithdrawOrderListRespSignal)
    private withdrawOrderListRespSignal: WithdrawOrderListRespSignal;

    constructor() {
        super(CommandCodes.PPWithdrawOrderListReq);
    }

    onTaskStart() {
        let req: WithdrawOrderListReq = new WithdrawOrderListReq();
        this.networkServer.sendDefault(CommandCodes.PPWithdrawOrderListReq, req);
        this.withdrawOrderListRespSignal.on(this, this.onWithdrawOrderListResp);
    }

    onTaskCancel() {
        this.withdrawOrderListRespSignal.off(this, this.onWithdrawOrderListResp);
    }

    private onWithdrawOrderListResp(resp: WithdrawOrderListResp) {
        this.withdrawOrderListRespSignal.off(this, this.onWithdrawOrderListResp);
        this.setComplete(resp);
    }
}
