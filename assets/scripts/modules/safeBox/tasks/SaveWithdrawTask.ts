import Task from "../../../../libs/common/scripts/utils/Task";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import CommandCodes from "../../../protocol/CommandCodes";
import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import SafeBoxModel from "../models/SafeBoxModel";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import OnUserInfoUpdateSignal from "../../../../libs/common/scripts/modules/user/signals/OnUserInfoUpdateSignal";
import { SafeWithdrawRespSignal } from "../../../protocol/signals/signals";
import { SafeWithdrawReq, SafeDepositResp } from "../../../protocol/protocols/protocols";

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
export default class SaveWithdrawTask extends ProtocolTask<SafeDepositResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    /**保险箱取款协议回复 */
    @riggerIOC.inject(SafeWithdrawRespSignal)
    private saveWithdrawRespSignal: SafeWithdrawRespSignal;

    @riggerIOC.inject(SafeBoxModel)
    private safeBoxModel: SafeBoxModel;

    constructor() {
        super(CommandCodes.PPSafeWithdrawReq);
    }

    start([coin, password]: [number, string]) {
        return super.start([coin, password]) as SaveWithdrawTask;
    }
 
    onTaskStart([coin, password]: [number, string]) {
        let req: SafeWithdrawReq = new SafeWithdrawReq();
        req.amount = coin * 100;
        req.safePassword = password;
        this.networkServer.sendDefault(CommandCodes.PPSafeWithdrawReq, req);
        this.saveWithdrawRespSignal.on(this, this.onSaveWithdrawResp);
    }

    onTaskCancel() {
        this.saveWithdrawRespSignal.off(this, this.onSaveWithdrawResp);
    }

    private onSaveWithdrawResp(resp: SafeDepositResp) {
        this.safeBoxModel.saveBoxCoin = resp.safeAmount / 100;
        // this.lobbyUserModel.self.balance = resp.amount / 100;
        // this.onUserInfoUpdateSignal.dispatch();
        this.saveWithdrawRespSignal.off(this, this.onSaveWithdrawResp);
        this.setComplete(resp);
    }
}
