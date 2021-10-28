import LoginModel from "../../../../libs/common/scripts/modules/login/models/LoginModel";
import BaseAlertInfo, { BaseAlertStyle, BaseAlertResult } from "../../../../libs/common/scripts/modules/tips/models/BaseAlertInfo";
import BaseAlertPanel from "../../../../libs/common/scripts/modules/tips/views/BaseAlertPanel";
import ShowLoginPanelSignal from "../../../../libs/common/scripts/modules/login/signals/ShowLoginPanelSignal";
import BaseLoginPanel from "../../../../libs/common/scripts/modules/login/views/BaseLoginPanel";
import LoginPanel from "../views/LoginPanel";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 确保玩家已经登录的命令
 */
export default class MakeSureLoginedCommand extends riggerIOC.WaitableCommand {
    @riggerIOC.inject(LoginModel)
    protected loginModel: LoginModel;

    @riggerIOC.inject(ShowLoginPanelSignal)
    protected showLoginPanelSignal: ShowLoginPanelSignal;

    onCancel():void{
        
    }
    async execute() {
        console.time("*** 启动子游戏 ***");
        console.time("*** 确保登录 ***");
        if (this.loginModel.isLogined) {
            cc.log(` is loagined=====`)
            this.done(true);
        }
        else {
            // 让用户登录
            let info: BaseAlertInfo = new BaseAlertInfo();
            info.content = "请先登录";
            info.style = BaseAlertStyle.YES_NO;
            let panel: BaseAlertPanel = BaseAlertPanel.show(info);
            let choice: BaseAlertResult = await panel.wait();
            BaseAlertPanel.hide(panel);
            if (BaseAlertResult.YES == choice) {
                let loginPanel:LoginPanel = BaseLoginPanel.show() as LoginPanel;
                let ret:boolean = await loginPanel.wait();
                this.done(ret);
            }
            else {
                this.done(false);
            }
        }

        console.timeEnd("*** 确保登录 ***");

    }
}
