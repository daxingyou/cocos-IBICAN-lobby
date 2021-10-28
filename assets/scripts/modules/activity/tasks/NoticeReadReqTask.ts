import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { NoticeReadRespSignal } from "../../../protocol/signals/signals";
import { NoticeReadReq, NoticeReadResp } from "../../../protocol/protocols/protocols";
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

@ccclass
export default class NoticeReadReqTask extends ProtocolTask<NoticeReadResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(NoticeReadRespSignal)
    private noticeReadRespSignal: NoticeReadRespSignal;

    @riggerIOC.inject(ActivityModel)
    private activityModel: ActivityModel;

    constructor() {
        super(CommandCodes.PPNoticeReadResp);
        this.timeout = 5000;
    }

    start(id: number): NoticeReadReqTask {
        return super.start(id) as NoticeReadReqTask;
    }

    onTaskStart(id: number) {
        let req: NoticeReadReq = new NoticeReadReq();
        req.noticeId = id;
        this.networkServer.sendDefault(CommandCodes.PPNoticeReadReq, req);
        this.noticeReadRespSignal.on(this, this.onNoticeReadResp);
    }

    onTaskCancel() {
        this.noticeReadRespSignal.off(this, this.onNoticeReadResp);
    }

    private onNoticeReadResp(resp: NoticeReadResp) {
        this.activityModel.getNoticeById(resp.noticeId).hasRead = true;
        this.noticeReadRespSignal.off(this, this.onNoticeReadResp);
        this.setComplete(resp);
    }
}
