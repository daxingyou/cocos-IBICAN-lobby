import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import CommandCodes from "../../../protocol/CommandCodes";
import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import SafeBoxModel from "../models/SafeBoxModel";
import { GetSafeWalletRespSignal } from "../../../protocol/signals/signals";
import { GetSafeWalletReq, GetSafeWalletResp } from "../../../protocol/protocols/protocols";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class GetSaveWalletCoinTask extends ProtocolTask<GetSafeWalletResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    /**获取当前用户保险箱金额协议回复 */
    @riggerIOC.inject(GetSafeWalletRespSignal)
    private getSaveWalletRespSignal: GetSafeWalletRespSignal;

    @riggerIOC.inject(SafeBoxModel)
    private safeBoxModel: SafeBoxModel;

    constructor() {
        super(CommandCodes.PPGetSafeWalletReq);
    }

    start(): GetSaveWalletCoinTask {
        return super.start() as GetSaveWalletCoinTask;
    }

    onTaskStart() {
        let req: GetSafeWalletReq = new GetSafeWalletReq();
        this.networkServer.sendDefault(CommandCodes.PPGetSafeWalletReq, req);
        this.getSaveWalletRespSignal.on(this, this.onGetSaveWalletResp);
    }

    onTaskCancel() {
        this.getSaveWalletRespSignal.off(this, this.onGetSaveWalletResp);
    }

    private onGetSaveWalletResp(resp: GetSafeWalletResp) {
        this.safeBoxModel.saveBoxCoin = resp.amount / 100;
        this.getSaveWalletRespSignal.off(this, this.onGetSaveWalletResp);
        this.setComplete(resp.amount / 100);
    }
}
