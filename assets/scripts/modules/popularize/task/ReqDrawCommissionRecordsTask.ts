import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { DrawCommissionRecordResp, DrawCommissionRecordReq } from "../../../protocol/protocols/protocols";
import { DrawCommissionRecordRespSignal } from "../../../protocol/signals/signals";
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
 * 提取佣金记录 请求任务
 */   
@ccclass
export default class ReqDrawCommissionRecordsTask extends ProtocolTask<DrawCommissionRecordResp> {
    @riggerIOC.inject(NetworkServer)
    private networkServer: NetworkServer;

    @riggerIOC.inject(DrawCommissionRecordRespSignal)
    private drawCommissionRecordRespSignal: DrawCommissionRecordRespSignal;

    @riggerIOC.inject(PopularizeModel)
    private popularizeModel: PopularizeModel;


    constructor() {
        super(CommandCodes.PPDrawCommissionRecordReq);
    }

    start() {
        return super.start() as ReqDrawCommissionRecordsTask;
    } 

    onTaskStart() {
        let req: DrawCommissionRecordReq = new DrawCommissionRecordReq();
        this.networkServer.sendDefault(CommandCodes.PPDrawCommissionRecordReq, req);
        this.drawCommissionRecordRespSignal.on(this, this.onGetDrawCommissionRecords);
    }

    onTaskCancel() {
        this.drawCommissionRecordRespSignal.off(this, this.onGetDrawCommissionRecords);
    }

    private onGetDrawCommissionRecords(resp: DrawCommissionRecordResp) {
        this.drawCommissionRecordRespSignal.off(this, this.onGetDrawCommissionRecords);
        this.setComplete(resp);
    }
}
