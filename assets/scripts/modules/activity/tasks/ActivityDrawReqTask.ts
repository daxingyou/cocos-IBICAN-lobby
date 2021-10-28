import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import { LotteryResp, LotteryReq } from "../../../protocol/protocols/protocols";
import { LotteryRespSignal } from "../../../protocol/signals/signals";


export default class ActivityDrawReqTask extends ProtocolTask<LotteryResp> {

    @riggerIOC.inject(LotteryRespSignal)
    private lotteryRespSignal: LotteryRespSignal;

    constructor() {
        super(CommandCodes.PPLotteryReq);
        this.timeout = 5000;
    }
    
    start(id: number): ActivityDrawReqTask {
        return super.start(id) as ActivityDrawReqTask;
    }


    onTaskStart(id: number) {
        let req: LotteryReq = new LotteryReq();
        req.poolId = id;
        this.networkServer.sendDefault(CommandCodes.PPLotteryReq, req);
        this.lotteryRespSignal.on(this, this.onDrawResp);
    }

    onTaskCancel() {
        this.lotteryRespSignal.off(this, this.onDrawResp);
    }

    private onDrawResp(resp: LotteryResp) {
        this.lotteryRespSignal.off(this, this.onDrawResp);
        this.setComplete(resp);
    }
}
