import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import { BindAlipayAccountReq, BindAlipayAccountResp, UserBank } from "../../../protocol/protocols/protocols";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { BindAlipayAccountRespSignal } from "../../../protocol/signals/signals";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import LobbyUserInfo from "../../user/model/LobbyUserInfo";

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
export default class BindAlipayTask extends ProtocolTask<BindAlipayAccountResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(BindAlipayAccountRespSignal)
    private bindAlipayAccountRespSignal: BindAlipayAccountRespSignal;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;

    constructor() {
        super(CommandCodes.PPBindAlipayAccountReq);
    }

    start([account, ownerName]: [string, string]) {
        return super.start([account, ownerName]) as BindAlipayTask;
    }

    onTaskStart([account, ownerName]: [string, string]) {
        let req: BindAlipayAccountReq = new BindAlipayAccountReq();
        req.alipayAccount = account;
        req.realName = ownerName;
        this.networkServer.sendDefault(CommandCodes.PPBindAlipayAccountReq, req);
        this.bindAlipayAccountRespSignal.on(this, this.onBindAlipayAccountResp);
    }

    onTaskCancel() {
        this.bindAlipayAccountRespSignal.off(this, this.onBindAlipayAccountResp);
    }

    private onBindAlipayAccountResp(resp: BindAlipayAccountResp) {
        (this.lobbyUserModel.self as LobbyUserInfo).bindAlipay = resp.userAlipay;
        this.bindAlipayAccountRespSignal.off(this, this.onBindAlipayAccountResp);
        this.setComplete(true);
    }
}
