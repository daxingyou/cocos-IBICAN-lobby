import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import { ModifyUserAvatarReq, ModifyUserAvatarResp } from "../../../protocol/protocols/protocols";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import { ModifyUserAvatarRespSignal } from "../../../protocol/signals/signals";

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

export default class ModifyUserAvatarTask extends ProtocolTask<ModifyUserAvatarResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    /**头像修改协议回复 */
    @riggerIOC.inject(ModifyUserAvatarRespSignal)
    private modifyUserAvatarRespSignal: ModifyUserAvatarRespSignal;

    constructor() {
        super(CommandCodes.PPModifyUserAvatarReq);
    }

    start(index: number): ModifyUserAvatarTask {
       return super.start(index) as ModifyUserAvatarTask;
    }

    onTaskStart(index: number) {
        let req: ModifyUserAvatarReq = new ModifyUserAvatarReq();
        req.avatar = index + '';
        this.networkServer.sendDefault(CommandCodes.PPModifyUserAvatarReq, req);
        this.modifyUserAvatarRespSignal.on(this, this.onModifyUserAvatarResp);
    }

    onTaskCancel() {
        this.modifyUserAvatarRespSignal.off(this, this.onModifyUserAvatarResp);
    }

    private onModifyUserAvatarResp(resp: ModifyUserAvatarResp) {
        this.modifyUserAvatarRespSignal.off(this, this.onModifyUserAvatarResp);
        this.setComplete(resp);
    }
}
