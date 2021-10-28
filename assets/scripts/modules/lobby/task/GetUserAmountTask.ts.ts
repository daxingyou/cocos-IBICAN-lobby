import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import { GetUserAmountReq, GetUserAmountResp } from "../../../protocol/protocols/protocols";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { GetUserAmountRespSignal } from "../../../protocol/signals/signals";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import OnUserInfoUpdateSignal from "../../../../libs/common/scripts/modules/user/signals/OnUserInfoUpdateSignal";

const {ccclass, property} = cc._decorator;

export default class GetUserAmountTask extends ProtocolTask<GetUserAmountResp> 
{
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(GetUserAmountRespSignal)
    private getUserAmountRespSignal: GetUserAmountRespSignal;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;

    @riggerIOC.inject(OnUserInfoUpdateSignal)
    private onUserInfoUpdateSignal: OnUserInfoUpdateSignal;

    constructor() 
    {
        super(CommandCodes.PPGetUserAmountReq);
    }

    start (...arg:any[]) 
    {
        return super.start(arg);
    }

    onTaskStart(...arg)
    {
        let req:GetUserAmountReq = new GetUserAmountReq();
        this.networkServer.sendDefault(CommandCodes.PPGetUserAmountReq, req);

        this.getUserAmountRespSignal.on(this, this.onGEtUserAmountResp);
    }

    private onGEtUserAmountResp(resp:GetUserAmountResp):void
    {
        this.lobbyUserModel.self.balance = resp.amount / 100;
        this.onUserInfoUpdateSignal.dispatch();
        this.removeEventListener();
        this.done(resp);
    }

    onTaskCancel()
    {
        this.removeEventListener();
    }

    private removeEventListener():void
    {
        this.getUserAmountRespSignal.off(this, this.onGEtUserAmountResp);
    }
    
}
