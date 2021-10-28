import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import ReceiveRegAmountTask from "../../giftBox/tasks/ReceiveRegAmountTask";
import { TransferRecordListRespSignal } from "../../../protocol/signals/signals";
import { TransferRecordListReq, TransferRecordListResp } from "../../../protocol/protocols/protocols";

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
export default class RunningWaterListTask extends ProtocolTask<TransferRecordListResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(TransferRecordListRespSignal)
    private transferRecordListRespSignal: TransferRecordListRespSignal;

    constructor() { 
        super(CommandCodes.PPTransferRecordListReq);
    }

    start([time, types]: [string, number[]]) {
        return super.start([time, types]) as RunningWaterListTask;
    }

    onTaskStart([time, types]: [string, number[]]) {
        let req: TransferRecordListReq = new TransferRecordListReq();
        req.timeKeyword = time;
        req.transferTypeList = types;
        this.networkServer.sendDefault(CommandCodes.PPTransferRecordListReq, req);
        this.transferRecordListRespSignal.on(this, this.onTransferRecordListResp);
    }

    onTaskCancel() {
        this.transferRecordListRespSignal.off(this, this.onTransferRecordListResp);
    }

    private onTransferRecordListResp(resp: TransferRecordListResp) {
        this.transferRecordListRespSignal.off(this, this.onTransferRecordListResp);
        this.setComplete(resp);
    }
}
