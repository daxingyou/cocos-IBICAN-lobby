import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import { GetShareUrlReq, GetShareUrlResp } from "../../../protocol/protocols/protocols";
import { GetShareUrlRespSignal } from "../../../protocol/signals/signals";


export default class ActivityDailyShareLinkTask extends ProtocolTask<GetShareUrlResp> {

    @riggerIOC.inject(GetShareUrlRespSignal)
    private getShareUrlRespSignal: GetShareUrlRespSignal;

    constructor() {
        super(CommandCodes.PPGetShareUrlReq);
        this.timeout = 5000;
    }

    onTaskStart() {
        let req: GetShareUrlReq = new GetShareUrlReq();
        this.networkServer.sendDefault(CommandCodes.PPGetShareUrlReq, req);
        this.getShareUrlRespSignal.on(this, this.onGetShareUrlLink);
    }

    onTaskCancel() {
        this.getShareUrlRespSignal.off(this, this.onGetShareUrlLink);
    }

    private onGetShareUrlLink(resp: GetShareUrlResp) {
        this.getShareUrlRespSignal.off(this, this.onGetShareUrlLink);
        this.setComplete(resp);
    }
}
