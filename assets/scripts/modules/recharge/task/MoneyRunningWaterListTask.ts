import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { WithdrawMosaicListRespSignal } from "../../../protocol/signals/signals";
import { WithdrawMosaicListReq, WithdrawMosaicResp, WithdrawMosaicListResp } from "../../../protocol/protocols/protocols";

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
export default class MoneyRunningWaterListTask extends ProtocolTask<WithdrawMosaicListResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(WithdrawMosaicListRespSignal)
    private withdrawMosaicListRespSignal: WithdrawMosaicListRespSignal;
    
    constructor() {
        super(CommandCodes.PPWithdrawMosaicListReq);
    }

    onTaskStart() {
        let req: WithdrawMosaicListReq = new WithdrawMosaicListReq();
        this.networkServer.sendDefault(CommandCodes.PPWithdrawMosaicListReq, req);
        this.withdrawMosaicListRespSignal.on(this, this.onWithdrawMosaicListResp);
    }

    onTaskCancel() {
        this.withdrawMosaicListRespSignal.off(this, this.onWithdrawMosaicListResp);
    }

    private onWithdrawMosaicListResp(resp: WithdrawMosaicListResp) {
        this.withdrawMosaicListRespSignal.off(this, this.onWithdrawMosaicListResp);
        this.setComplete(resp);
    }
}
