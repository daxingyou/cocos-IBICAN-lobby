import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import { ActivityReadRespSignal } from "../../../protocol/signals/signals";
import { ActivityReadReq, ActivityReadResp } from "../../../protocol/protocols/protocols";
import ActivityModel from "../models/ActivityModel";

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

export default class ActivityReadReqTask extends ProtocolTask<ActivityReadResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(ActivityReadRespSignal)
    private activityReadRespSignal: ActivityReadRespSignal;

    @riggerIOC.inject(ActivityModel)
    private activityModel: ActivityModel;

    constructor() {
        super(CommandCodes.PPActivityReadReq);
        this.timeout = 5000;
    }

    start(id: number): ActivityReadReqTask {
        return super.start(id) as ActivityReadReqTask;
    }

    onTaskStart(id: number) {
        let req: ActivityReadReq = new ActivityReadReq();
        req.activityId = id;
        this.networkServer.sendDefault(CommandCodes.PPActivityReadReq, req);
        this.activityReadRespSignal.on(this, this.onActivityReadResp);
    }

    onTaskCancel() {
        this.activityReadRespSignal.off(this, this.onActivityReadResp);
    }

    private onActivityReadResp(resp: ActivityReadResp) {
        this.activityModel.getActivityById(resp.activityId).hasRead = true;
        this.activityReadRespSignal.off(this, this.onActivityReadResp);
        this.setComplete(resp);
    }
}
