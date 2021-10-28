import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import { ModifyNicknameReq, ModifyNicknameResp } from "../../../protocol/protocols/protocols";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { ModifyNicknameRespSignal } from "../../../protocol/signals/signals";

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
export default class ModifyNicknameTask extends ProtocolTask<ModifyNicknameResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    @riggerIOC.inject(ModifyNicknameRespSignal)
    private modifyNicknameRespSignal: ModifyNicknameRespSignal;

    constructor() {
        super(CommandCodes.PPModifyNicknameReq);
    }

    start(nickname: string): ModifyNicknameTask {
        return super.start(nickname) as ModifyNicknameTask;
    }

    onTaskStart(nickname: string) {
        let req: ModifyNicknameReq = new ModifyNicknameReq();
        req.nickname = nickname;
        this.networkServer.sendDefault(CommandCodes.PPModifyNicknameReq, req);
        this.modifyNicknameRespSignal.on(this, this.onModifyNicknameResp);
    }

    onTaskCancel() {
        this.modifyNicknameRespSignal.off(this, this.onModifyNicknameResp);
    }

    private onModifyNicknameResp(resp: ModifyNicknameResp) {
        this.modifyNicknameRespSignal.off(this, this.onModifyNicknameResp);
        this.setComplete(true);
    }
}
