import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import { WinningInfoResp, WinningInfoReq } from "../../../protocol/protocols/protocols";
import { WinningInfoRespSignal } from "../../../protocol/signals/signals";


export default class ActivityWinningInfoTask extends ProtocolTask<WinningInfoResp> {

    @riggerIOC.inject(WinningInfoRespSignal)
    private winningInfoRespSignal: WinningInfoRespSignal;

    constructor() {
        super(CommandCodes.PPWinningInfoReq);
        this.timeout = 5000;
    }

    onTaskStart() {
        let req: WinningInfoReq = new WinningInfoReq();
        this.networkServer.sendDefault(CommandCodes.PPWinningInfoReq, req);
        this.winningInfoRespSignal.on(this, this.onWinningInfoResp);
    }

    onTaskCancel() {
        this.winningInfoRespSignal.off(this, this.onWinningInfoResp);
    }

    private onWinningInfoResp(resp: WinningInfoResp) {
        this.winningInfoRespSignal.off(this, this.onWinningInfoResp);
        this.setComplete(resp);
    }
}
