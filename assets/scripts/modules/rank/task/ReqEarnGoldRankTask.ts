import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { WinRankingListReq, WinRankingListResp } from "../../../protocol/protocols/protocols";
import { WinRankingListRespSignal } from "../../../protocol/signals/signals";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


/**
 * 赢金排行榜 请求任务
 */
export default class ReqEarnGoldRankTask extends ProtocolTask<WinRankingListResp> {

    @riggerIOC.inject(WinRankingListRespSignal)
    private winRankingListRespSignal: WinRankingListRespSignal;

    constructor() {
        super(CommandCodes.PPWinRankingListReq);
    }

    onTaskStart() {
        let req: WinRankingListReq = new WinRankingListReq();
        this.winRankingListRespSignal.on(this, this.onGetWinRankingList);
        this.networkServer.sendDefault(CommandCodes.PPWinRankingListReq, req);
    }

    onTaskCancel() {
        console.log("ReqEarnGoldRankTask.onTaskCancel.")
        this.winRankingListRespSignal.off(this, this.onGetWinRankingList);
    }

    private onGetWinRankingList(resp: WinRankingListResp) {
        console.log("ReqEarnGoldRankTask.onGetWinRankingList.", resp)
        this.winRankingListRespSignal.off(this, this.onGetWinRankingList);
        this.setComplete(resp);
    }
}
