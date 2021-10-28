import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import { OperationalActivityListResp, OperationalActivityListReq } from "../../../protocol/protocols/protocols";
import CommandCodes from "../../../protocol/CommandCodes";
import { OperationalActivityListRespSignal } from "../../../protocol/signals/signals";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class OperationActivityTask extends ProtocolTask<OperationalActivityListResp> {
    @riggerIOC.inject(OperationalActivityListRespSignal)
    private operationalActivityListRespSignal: OperationalActivityListRespSignal;

    constructor() {
        super(CommandCodes.PPOperationalActivityListReq);
        this.timeout = 5000;
    }

    onTaskStart() {
        let req: OperationalActivityListReq = new OperationalActivityListReq();
        this.networkServer.sendDefault(CommandCodes.PPOperationalActivityListReq, req);
        this.operationalActivityListRespSignal.on(this, this.onOperationalActivityListResp);
    }

    onTaskCancel() {
        this.operationalActivityListRespSignal.off(this, this.onOperationalActivityListResp);
    }

    private onOperationalActivityListResp(resp: OperationalActivityListResp) {
        this.operationalActivityListRespSignal.off(this, this.onOperationalActivityListResp);
        this.setComplete(resp);        
    }
}
