import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { WithdrawMosaicRespSignal } from "../../../protocol/signals/signals";
import { WithdrawMosaicReq, WithdrawMosaicResp } from "../../../protocol/protocols/protocols";

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
export default class withdrawMosaicTask extends ProtocolTask<WithdrawMosaicResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(WithdrawMosaicRespSignal)
    private withdrawMosaicRespSignal: WithdrawMosaicRespSignal;

    constructor() {
        super(CommandCodes.PPWithdrawMosaicReq);
    }

    start([coin, withdrawType]: [number, number]) {
        return super.start([coin, withdrawType]) as withdrawMosaicTask;
    }

    onTaskStart([coin, withdrawType]) {
        let req: WithdrawMosaicReq = new WithdrawMosaicReq();
        req.amount = coin;
        req.withdrawWay = withdrawType;
        this.networkServer.sendDefault(CommandCodes.PPWithdrawMosaicReq, req);
        this.withdrawMosaicRespSignal.on(this, this.onWithdrawMosaicResp);
    }

    onTaskCancel() {
        this.withdrawMosaicRespSignal.off(this, this.onWithdrawMosaicResp);
    }

    private onWithdrawMosaicResp(resp: WithdrawMosaicResp) {
        this.withdrawMosaicRespSignal.off(this, this.onWithdrawMosaicResp);
        this.setComplete(resp);
    }
}