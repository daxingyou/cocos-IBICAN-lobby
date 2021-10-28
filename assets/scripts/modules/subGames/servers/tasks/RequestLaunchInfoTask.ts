import Task from "../../../../../libs/common/scripts/utils/Task";
import { SubGameId } from "../../models/SubGameEntity";
import { GameLaunchInjectReq, GameLaunchInjectResp } from "../../../../protocol/protocols/protocols";
import NetworkServer from "../../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import CommandCodes from "../../../../protocol/CommandCodes";
import { GameLaunchInjectRespSignal } from "../../../../protocol/signals/signals";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class RequestLaunchInfoTask extends Task<GameLaunchInjectResp> {

    @riggerIOC.inject(NetworkServer)
    protected netServer: NetworkServer;

    @riggerIOC.inject(GameLaunchInjectRespSignal)
    protected onInjectSignal: GameLaunchInjectRespSignal;

    start(subGameId: SubGameId): RequestLaunchInfoTask {
        return super.start(subGameId) as RequestLaunchInfoTask;
    }

    onTaskStart(subGameId: SubGameId): void {
        let req: GameLaunchInjectReq = new GameLaunchInjectReq();
        req.itemId = subGameId;
        this.netServer.sendDefault(CommandCodes.PPGameLaunchInjectReq, req);
        this.onInjectSignal.on(this, this.onResp);
    }

    onTaskCancel(reason: any) {

    }

    private onResp(resp: GameLaunchInjectResp): void {
        this.onInjectSignal.off(this, this.onResp);
        this.setComplete(resp);
    }

}
