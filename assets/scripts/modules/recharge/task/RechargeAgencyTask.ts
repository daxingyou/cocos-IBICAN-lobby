import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import { RechargeAgentResp, RechargeAgentReq } from "../../../protocol/protocols/protocols";
import CommandCodes from "../../../protocol/CommandCodes";
import { RechargeAgentRespSignal } from "../../../protocol/signals/signals";

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
export default class RechargeAgencyTask extends ProtocolTask<RechargeAgentResp> {
    @riggerIOC.inject(RechargeAgentRespSignal)
    public rechargeAgentRespSignal: RechargeAgentRespSignal;

    constructor() {
        super(CommandCodes.PPRechargeAgentReq);
    }

    start(pageNum: number) {
        return super.start(pageNum) as RechargeAgencyTask;
    }

    onTaskStart(pageNum: number) {
        let req: RechargeAgentReq = new RechargeAgentReq();
        req.pageNum = pageNum;
        this.networkServer.sendDefault(CommandCodes.PPRechargeAgentReq, req);
        this.rechargeAgentRespSignal.on(this, this.onRechargeAgentResp);
    }

    onTaskCancel() {
        this.rechargeAgentRespSignal.off(this, this.onRechargeAgentResp);
    }

    private onRechargeAgentResp(resp: RechargeAgentResp) {
        this.rechargeAgentRespSignal.off(this, this.onRechargeAgentResp);
        this.done(resp);
    }
}
