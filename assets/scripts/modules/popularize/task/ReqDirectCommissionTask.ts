import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { CommissionRankResp, DirectCommissionResp, DirectCommissionReq } from "../../../protocol/protocols/protocols";
import { CommissionRankRespSignal, DirectCommissionRespSignal } from "../../../protocol/signals/signals";
import PopularizeModel from "../model/PopularizeModel";

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

/**
 * 推广明细 请求任务
 */
@ccclass
export default class ReqDirectCommissionTask extends ProtocolTask<DirectCommissionResp> {
    @riggerIOC.inject(NetworkServer)
    private networkServer: NetworkServer;

    @riggerIOC.inject(DirectCommissionRespSignal)
    private directCommissionRespSignal: DirectCommissionRespSignal;

    @riggerIOC.inject(PopularizeModel)
    private popularizeModel: PopularizeModel;


    constructor() {
        super(CommandCodes.PPDirectCommissionReq);
    }

    start() {
        return super.start() as ReqDirectCommissionTask;
    }

    onTaskStart() {
        let req: DirectCommissionReq = new DirectCommissionReq();
        this.networkServer.sendDefault(CommandCodes.PPDirectCommissionReq, req);
        this.directCommissionRespSignal.on(this, this.onGetDirectCommissionInfos);
    }

    onTaskCancel() {
        this.directCommissionRespSignal.off(this, this.onGetDirectCommissionInfos);
    }

    private onGetDirectCommissionInfos(resp: DirectCommissionResp) {
        this.directCommissionRespSignal.off(this, this.onGetDirectCommissionInfos);
        this.setComplete(resp);
    }
}
