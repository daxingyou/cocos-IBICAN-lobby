import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { WithdrawCountRespSignal, WithdrawSettingRespSignal } from "../../../protocol/signals/signals";
import { WithdrawSettingResp, WithdrawCountReq, WithdrawCountResp, WithdrawSettingReq } from "../../../protocol/protocols/protocols";

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
export default class WithdrawMoneyTask extends ProtocolTask<WithdrawSettingResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(WithdrawSettingRespSignal)
    private withdrawSettingRespSignal: WithdrawSettingRespSignal;

    constructor() {
        super(CommandCodes.PPWithdrawSettingReq);
    }

    onTaskStart() {
        let req: WithdrawSettingReq = new WithdrawSettingReq();
        this.networkServer.sendDefault(CommandCodes.PPWithdrawSettingReq, req);
        this.withdrawSettingRespSignal.on(this, this.onWithdrawMoneyResp);
    }

    onTaskCancel() {
        this.withdrawSettingRespSignal.off(this, this.onWithdrawMoneyResp);
    }

    private onWithdrawMoneyResp(resp: WithdrawSettingResp) {
        this.setComplete(resp);
        this.withdrawSettingRespSignal.off(this, this.onWithdrawMoneyResp);
    }
}
