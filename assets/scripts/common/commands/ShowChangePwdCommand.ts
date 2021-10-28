import SafeBoxServer from "../../modules/safeBox/servers/SafeBoxServer";
import PushTipsQueueSignal from "../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import ChangePwdPanelTips from "../structurals/ChangePwdPanelTips";
import ChangePwdPanel from "../views/ChangePwdPanel";
import UIManager from "../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../libs/common/scripts/utils/LayerManager";
import { ErrResp } from "../../protocol/protocols/protocols";
import LoginPwdChangeTask from "../../modules/user/tasks/LoginPwdChangeTask";
import ModifySavePwdTask from "../../modules/safeBox/tasks/ModifySavePwdTask";
import LoginModel from "../../../libs/common/scripts/modules/login/models/LoginModel";
import ExitLoginSignal from "../../modules/login/signals/ExitLoginSignal";
import UserModel from "../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../../modules/user/model/LobbyUserModel";

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

interface TaskLike{
    start: ([mobile, newPwd, oldPwd]: [string, string, string]) => any;
    wait:() => Promise<any>;
    getReason: () => any;
    reset:() => any;
}

@ccclass
export default class ShowChangePwdCommand extends riggerIOC.WaitableCommand {
    @riggerIOC.inject(SafeBoxServer)
    private safeBoxServer: SafeBoxServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(LoginModel)
    private loginModel: LoginModel;

    @riggerIOC.inject(ExitLoginSignal)
    private exitLoginSignal: ExitLoginSignal;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;

    constructor() {
        super();
    }

    async execute([tips, task]:[ChangePwdPanelTips, TaskLike]){
        let panel: ChangePwdPanel = UIManager.instance.showPanel(ChangePwdPanel, LayerManager.uiLayerName, false, tips) as ChangePwdPanel;
        while(true){
            cc.log(`continue while`);
            panel.reset();
            let panelResult  = await panel.wait();
            cc.log(`panelResult: ${panelResult}`);
            if(panelResult){
                task.reset();
                task.start([this.lobbyUserModel.self.mobile, panelResult.newPwd, panelResult.oldPwd]);
                let taskResult = await task.wait();
                cc.log(`taskResult: ${taskResult}`);
                if(taskResult.isOk) {
                    panel.closeWindow();
                    // this.pushTipsQueueSignal.dispatch('修改成功');
                    if(task instanceof LoginPwdChangeTask) {
                        // if(this.loginModel.getLocalPassPort(this.loginModel.activatedAccount)) {
                            // this.loginModel.deleteLocalPassPort(this.loginModel.activatedAccount);
                        // }
                        await riggerIOC.waitForSeconds(500);
                        this.exitLoginSignal.dispatch();
                    }
                    break;
                }
                else {
                    let reason = taskResult.reason;
                    cc.log(`PwdChange Failed. reason: ${reason}`);
                    if(reason instanceof ErrResp) {
                        this.pushTipsQueueSignal.dispatch(reason.errMsg)
                    }
                    else {
                        if(reason && reason.msg) {
                            this.pushTipsQueueSignal.dispatch(reason.msg);
                        }
                    }
                    continue;
                }
            }
            else {
                //点击了面板的取消、关闭按钮
                panel.closeWindow();
                this.done(false);
                break;
            }
        }
        cc.log(`break while`);
    }
}
