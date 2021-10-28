import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { BindBankCardRespSignal } from "../../../protocol/signals/signals";
import { BindBankCardReq, BindBankCardResp, UserBank } from "../../../protocol/protocols/protocols";
import BankType from "../models/BankType";
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
export default class BindBankTask extends ProtocolTask<BindBankCardResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(BindBankCardRespSignal)
    private bindBankCardRespSignal: BindBankCardRespSignal;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;

    constructor() {
        super(CommandCodes.PPBindBankCardReq);
    }

    start([account, ownerName, bankName]: [string, string, string]) {
        return super.start([account, ownerName, bankName]) as BindBankTask;
    }

    onTaskStart([account, ownerName, bankName]: [string, string, string]) {
        let req: BindBankCardReq = new BindBankCardReq();
        req.bankCard = account;
        req.realName = ownerName;
        req.bankName = bankName;
        this.networkServer.sendDefault(CommandCodes.PPBindBankCardReq, req);
        this.bindBankCardRespSignal.on(this, this.onBindBankCardResp);
    }

    onTaskCancel() {
        this.bindBankCardRespSignal.off(this, this.onBindBankCardResp);
    }

    private onBindBankCardResp(resp: BindBankCardResp) {
        (this.lobbyUserModel.self as LobbyUserInfo).bindBanks = resp.userBank;
        this.bindBankCardRespSignal.off(this, this.onBindBankCardResp);
        this.setComplete(true);
    }
}
