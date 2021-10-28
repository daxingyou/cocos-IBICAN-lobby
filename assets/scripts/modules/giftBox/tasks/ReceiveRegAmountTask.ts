import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { ReceiveRegAmountRespSignal } from "../../../protocol/signals/signals";
import { ReceiveRegAmountReq, ReceiveRegAmountResp } from "../../../protocol/protocols/protocols";

//注册送金
const {ccclass, property} = cc._decorator;
export default class ReceiveRegAmountTask extends ProtocolTask<ReceiveRegAmountResp>
{
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(ReceiveRegAmountRespSignal)
    private receiveRegAmountRespSignal:ReceiveRegAmountRespSignal

    constructor()
    {
        super(CommandCodes.PPReceiveRegAmountReq);
    }

    start()
    {
        return super.start() as ReceiveRegAmountTask;
    }

    onTaskStart()
    {
        let req:ReceiveRegAmountReq = new ReceiveRegAmountReq()
        this.networkServer.sendDefault(CommandCodes.PPReceiveRegAmountReq, req);

        this.receiveRegAmountRespSignal.on(this, this.onReceiveRegAmountResp);
    }

    onTaskCancel()
    {
        this.receiveRegAmountRespSignal.off(this, this.onReceiveRegAmountResp);
    }

    private onReceiveRegAmountResp(reap:ReceiveRegAmountResp):void
    {
        this.receiveRegAmountRespSignal.off(this, this.onReceiveRegAmountResp);
        this.done(reap);
    }
}
