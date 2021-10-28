import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import { NoticeListRespSignal } from "../../../protocol/signals/signals";
import { NoticeListReq, NoticeListResp } from "../../../protocol/protocols/protocols";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class NoticeListReqTask extends ProtocolTask<NoticeListResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(NoticeListRespSignal)
    private noticeListRespSignal: NoticeListRespSignal;

    constructor() {
        super(CommandCodes.PPNoticeListReq);
        this.timeout = 5000;
    }

    onTaskStart() {
        let req: NoticeListReq = new NoticeListReq();
        this.networkServer.sendDefault(CommandCodes.PPNoticeListReq, req);
        this.noticeListRespSignal.on(this, this.onNoticeListResp);
    }

    onTaskCancel() {
        this.noticeListRespSignal.off(this, this.onNoticeListResp);
    }

    private onNoticeListResp(resp: NoticeListResp) {
        this.noticeListRespSignal.off(this, this.onNoticeListResp);
        this.setComplete(resp);
    }
}
