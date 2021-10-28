import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import CommandCodes from "../../../protocol/CommandCodes";
import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import { ModifySafePwdRespSignal } from "../../../protocol/signals/signals";
import { ModifySafePwdReq, ModifySafePwdResp } from "../../../protocol/protocols/protocols";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";

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
export default class ModifySavePwdTask extends ProtocolTask<ModifySafePwdResp> {
    // @riggerIOC.inject(NetworkServer)
    // private networkServer: NetworkServer;

    /**修改保险箱密码成功返回 */
    @riggerIOC.inject(ModifySafePwdRespSignal)
    private modifySavePwdRespSignal: ModifySafePwdRespSignal;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    constructor() {
        super(CommandCodes.PPModifySafePwdReq);
    }

    start([mobile, newPassword, oldPassword]: [string, string, string]) {
        return super.start([newPassword, oldPassword]) as ModifySavePwdTask;
    }

    onTaskStart([newPassword, oldPassword]: [string, string]) {
        let req: ModifySafePwdReq = new ModifySafePwdReq();
        req.newPassword = newPassword;
        req.oldPassword = oldPassword;
        this.networkServer.sendDefault(CommandCodes.PPModifySafePwdReq, req);
        this.modifySavePwdRespSignal.on(this, this.onModifySavePwdResp);
    }

    onTaskCancel() {
        this.modifySavePwdRespSignal.off(this, this.onModifySavePwdResp);
    }

    private onModifySavePwdResp(resp: ModifySafePwdResp) {
        this.modifySavePwdRespSignal.off(this, this.onModifySavePwdResp);
        this.pushTipsQueueSignal.dispatch('保险箱密码修改成功');
        this.setComplete(true);
    }
}
