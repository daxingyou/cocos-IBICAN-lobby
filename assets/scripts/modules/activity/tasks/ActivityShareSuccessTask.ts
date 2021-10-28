import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import { ShareSuccessResp, ShareSuccessReq } from "../../../protocol/protocols/protocols";
import { ShareSuccessRespSignal } from "../../../protocol/signals/signals";


export default class ActivityShareSuccessTask extends ProtocolTask<ShareSuccessResp> {

    @riggerIOC.inject(ShareSuccessRespSignal)
    private shareSuccessRespSignal: ShareSuccessRespSignal;

    constructor() {
        super(CommandCodes.PPShareSuccessReq);
        this.timeout = 5000;
    }
    
    start([url,channel]:[string,number]): ActivityShareSuccessTask {
        return super.start([url,channel]) as ActivityShareSuccessTask;
    }


    onTaskStart([url,channel]:[string,number]) {
        let req: ShareSuccessReq = new ShareSuccessReq();
        req.shareUrl = url;
        req.shareChannel = channel
        this.networkServer.sendDefault(CommandCodes.PPShareSuccessReq, req);
        this.shareSuccessRespSignal.on(this, this.onShareSuccessResp);
    }

    onTaskCancel() {
        this.shareSuccessRespSignal.off(this, this.onShareSuccessResp);
    }

    private onShareSuccessResp(resp: ShareSuccessResp) {
        this.shareSuccessRespSignal.off(this, this.onShareSuccessResp);
        this.setComplete(resp);
    }
}
