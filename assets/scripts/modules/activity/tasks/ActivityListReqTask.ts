import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import { ActivityListReq, ActivityListResp } from "../../../protocol/protocols/protocols";
import { ActivityListRespSignal, ActivityReadRespSignal } from "../../../protocol/signals/signals";
import { timingSafeEqual } from "crypto";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class ActivityListReqTask extends ProtocolTask<ActivityListResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(ActivityListRespSignal)
    private activityListRespSignal: ActivityListRespSignal;

    constructor() {
        super(CommandCodes.PPActivityListReq);
        this.timeout = 5000;
    }

    onTaskStart() {
        let req: ActivityListReq = new ActivityListReq();
        this.networkServer.sendDefault(CommandCodes.PPActivityListReq, req);
        this.activityListRespSignal.on(this, this.onActivityListResp);
    }

    onTaskCancel() {
        this.activityListRespSignal.off(this, this.onActivityListResp);
    }

    private onActivityListResp(resp: ActivityListResp) {
        this.activityListRespSignal.off(this, this.onActivityListResp);
        this.setComplete(resp);
    }
}
