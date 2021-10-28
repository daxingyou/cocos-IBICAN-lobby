import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import CommandCodes from "../../../protocol/CommandCodes";
import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import SafeBoxModel from "../models/SafeBoxModel";
import { SafeDepositRespSignal } from "../../../protocol/signals/signals";
import { SafeDepositReq, SafeDepositResp } from "../../../protocol/protocols/protocols";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class SaveDepositTask extends ProtocolTask<SafeDepositResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    /**保险箱存款协议回复 */
    @riggerIOC.inject(SafeDepositRespSignal)
    private saveDepositRespSignal: SafeDepositRespSignal;

    @riggerIOC.inject(SafeBoxModel)
    private safeBoxModel: SafeBoxModel;

    constructor() {
        super(CommandCodes.PPSafeDepositReq);
    }

    start(coin: number): SaveDepositTask {
        return super.start(coin) as SaveDepositTask;
    }

    onTaskStart(coin: number) {
        let req: SafeDepositReq = new SafeDepositReq();
        req.amount = coin * 100;
        this.networkServer.sendDefault(CommandCodes.PPSafeDepositReq, req);
        this.saveDepositRespSignal.on(this, this.onSaveDepositResp);
    }

    onTaskCancel() {
        this.saveDepositRespSignal.off(this, this.onSaveDepositResp);
    }

    private onSaveDepositResp(resp: SafeDepositResp) {
        this.safeBoxModel.saveBoxCoin = resp.safeAmount / 100;
        // this.lobbyUserModel.self.balance = resp.amount / 100;
        // this.onUserInfoUpdateSignal.dispatch();
        this.saveDepositRespSignal.off(this, this.onSaveDepositResp);
        // this.done(resp);
        this.setComplete(resp);
    }
}
