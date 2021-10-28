import { LoginReq, LoginResp } from "../../../protocol/protocols/protocols";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import CommandCodes from "../../../protocol/CommandCodes";
import { LoginRespSignal } from "../../../protocol/signals/signals";
import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class LoginLobbyTask extends ProtocolTask<LoginResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(LoginRespSignal)
    private loginRespSignal: LoginRespSignal;
    constructor(){
        super(CommandCodes.PPLoginReq)
    }

    start([token, platform, markCode]: [string, number, string]): LoginLobbyTask {
        this.timeout = 10000;
        return super.start([token, platform]) as LoginLobbyTask;
    }

    async onTaskStart([token, platform, markCode]: [string, number, string]) {
        let req: LoginReq = new LoginReq();
        req.token = token;
        req.platform = platform;
        if(markCode) req.markCode = markCode;
        cc.log(`login game:${token}`);
        this.networkServer.sendDefault(CommandCodes.PPLoginReq, req);
        this.loginRespSignal.on(this, this.onLoginResp);
    }

    onTaskCancel(): void {
        this.loginRespSignal.off(this, this.onLoginResp);
    }

    private onLoginResp(resp: LoginResp): void {
        this.loginRespSignal.off(this, this.onLoginResp);
        this.setComplete(resp);

    }
}
