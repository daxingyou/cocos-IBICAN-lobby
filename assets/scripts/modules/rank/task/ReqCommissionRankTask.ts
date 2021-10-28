import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { CommissionRankResp, CommissionRankReq } from "../../../protocol/protocols/protocols";
import { CommissionRankRespSignal } from "../../../protocol/signals/signals";

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

/**
 * 推广佣金排行榜 请求任务
 */
@ccclass
export default class ReqCommissionRankTask extends ProtocolTask<CommissionRankResp> {
    @riggerIOC.inject(NetworkServer)
    private networkServer: NetworkServer;

    @riggerIOC.inject(CommissionRankRespSignal)
    private commissionRankRespSignal: CommissionRankRespSignal;

    constructor() {
        super(CommandCodes.PPCommissionRankReq);
    }

    start() {
        return super.start() as ReqCommissionRankTask;
    }

    onTaskStart() {
        let req: CommissionRankReq = new CommissionRankReq();
        this.networkServer.sendDefault(CommandCodes.PPCommissionRankReq, req);
        this.commissionRankRespSignal.on(this, this.onGetCommissionRankInfos);
    }

    onTaskCancel() {
        this.commissionRankRespSignal.off(this, this.onGetCommissionRankInfos);
    }

    private onGetCommissionRankInfos(resp: CommissionRankResp) {
        this.commissionRankRespSignal.off(this, this.onGetCommissionRankInfos);
        this.setComplete(resp);
    }
}
