import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { BindMobileRespSignal } from "../../../protocol/signals/signals";
import CommandCodes from "../../../protocol/CommandCodes";
import { BindMobileResp, BindMobileReq} from "../../../protocol/protocols/protocols";

const {ccclass, property} = cc._decorator;
//绑定手机  protocol
export default class BindMobileTask extends ProtocolTask<BindMobileResp>  {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(BindMobileRespSignal)
    private bindMobileRespSignal: BindMobileRespSignal;

    constructor() {
        super(CommandCodes.PPBindMobileReq);
    }

    start([mobile, verifyCode, password ]) {
        return super.start([mobile, verifyCode, password  ]) as BindMobileTask;
    }

    onTaskStart([mobile, verifyCode, password ]) {
        //发送
        let req: BindMobileReq = new BindMobileReq();
        req.mobile = mobile;
        req.verifyCode = verifyCode;
        req.password = password;
       // req.mobile = mobile;
        this.networkServer.sendDefault(CommandCodes.PPBindMobileReq, req);
        //侦听
        this.bindMobileRespSignal.on(this, this.onBindMobileResp);
    }

    onTaskCancel() {
        this.bindMobileRespSignal.off(this, this.onBindMobileResp);
    }

    private onBindMobileResp(resp: BindMobileResp) {
        this.bindMobileRespSignal.off(this, this.onBindMobileResp);
        this.done(resp);
    }
}