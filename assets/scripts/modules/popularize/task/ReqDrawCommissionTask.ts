import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { DrawCommissionResp, DrawCommissionReq } from "../../../protocol/protocols/protocols";
import { DrawCommissionRespSignal } from "../../../protocol/signals/signals";
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
 * 提取佣金 请求任务
 */
@ccclass
export default class ReqDrawCommissionTask extends ProtocolTask<DrawCommissionResp> {
    @riggerIOC.inject(NetworkServer)
    protected networkServer: NetworkServer;

    @riggerIOC.inject(DrawCommissionRespSignal)
    private drawCommissionRespSignal: DrawCommissionRespSignal;

    @riggerIOC.inject(PopularizeModel)
    private popularizeModel: PopularizeModel;


    constructor() {
        super(CommandCodes.PPDrawCommissionReq);
    }

    start(amount: number) {
        return super.start(amount) as ReqDrawCommissionTask;
    }

    onTaskStart(amount: number) {
        let req: DrawCommissionReq = new DrawCommissionReq();
        req.amount = amount;
        this.networkServer.sendDefault(CommandCodes.PPDrawCommissionReq, req);
        this.drawCommissionRespSignal.on(this, this.onGetDrawCommissionInfos);
    }

    onTaskCancel() {
        this.drawCommissionRespSignal.off(this, this.onGetDrawCommissionInfos);
    }

    private onGetDrawCommissionInfos(resp: DrawCommissionResp) {
        this.drawCommissionRespSignal.off(this, this.onGetDrawCommissionInfos);
        this.setComplete(resp);
    }
}
