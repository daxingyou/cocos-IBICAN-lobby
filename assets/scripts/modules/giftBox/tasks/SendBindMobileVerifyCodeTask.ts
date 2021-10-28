import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import { SendBindMobileVerifyCodeReq, SendBindMobileVerifyCodeResp } from "../../../protocol/protocols/protocols";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { SendBindMobileVerifyCodeRespSignal } from "../../../protocol/signals/signals";

//绑定手机发送验证码 protocol
const {ccclass, property} = cc._decorator;

export default class SendBindMobileVerifyCodeTask extends ProtocolTask<SendBindMobileVerifyCodeResp>  {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(SendBindMobileVerifyCodeRespSignal)
    private sendBindMobileVerifyCodeRespSignal: SendBindMobileVerifyCodeRespSignal;

    constructor() {
        super(CommandCodes.PPSendBindMobileVerifyCodeReq);
    }

    start(mobile: string) {
        return super.start(mobile) as SendBindMobileVerifyCodeTask;
    }

    onTaskStart(mobile: string) {
        //发送
        let req: SendBindMobileVerifyCodeReq = new SendBindMobileVerifyCodeReq();
        req.mobile = mobile;
        this.networkServer.sendDefault(CommandCodes.PPSendBindMobileVerifyCodeReq, req);
        //侦听
        this.sendBindMobileVerifyCodeRespSignal.on(this, this.onSendBindMobileVerifyCodeResp);
    }

    onTaskCancel() {
        this.sendBindMobileVerifyCodeRespSignal.off(this, this.onSendBindMobileVerifyCodeResp);
    }

    private onSendBindMobileVerifyCodeResp(resp: SendBindMobileVerifyCodeResp) {
        this.sendBindMobileVerifyCodeRespSignal.off(this, this.onSendBindMobileVerifyCodeResp);
        this.done(resp);
    }
}
