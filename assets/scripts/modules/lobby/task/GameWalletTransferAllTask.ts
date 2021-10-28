import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import {GameWalletTransferAllReq, GameWalletTransferAllResp } from "../../../protocol/protocols/protocols";
import { GameWalletTransferAllRespSignal } from "../../../protocol/signals/signals";

export default class GameWalletTransferAllTask extends ProtocolTask<GameWalletTransferAllResp> 
{
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(GameWalletTransferAllRespSignal)
    private gameWalletTransferAllRespSignal: GameWalletTransferAllRespSignal;


    constructor() 
    {
        super(CommandCodes.PPGameWalletTransferAllReq);
        this.timeout = 5000;
    }

    start (transferType) 
    {
        return super.start(transferType);
    }

    onTaskStart(transferType)
    {
        let req:GameWalletTransferAllReq = new GameWalletTransferAllReq();
        req.transferType = transferType;
        this.networkServer.sendDefault(CommandCodes.PPGameWalletTransferAllReq, req);

        this.gameWalletTransferAllRespSignal.on(this, this.onGameWalletTransferAllResp);
    }

    private onGameWalletTransferAllResp(resp:GameWalletTransferAllResp):void
    {
        this.removeEventListener();
        this.done(resp);
    }

    onTaskCancel()
    {
        this.removeEventListener();
    }

    private removeEventListener():void
    {
        this.gameWalletTransferAllRespSignal.off(this, this.onGameWalletTransferAllResp);
    }
    
}
