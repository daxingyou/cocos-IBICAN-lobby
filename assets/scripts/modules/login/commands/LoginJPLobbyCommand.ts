import RequestLoginGameCommand from "../../../../libs/common/scripts/modules/login/commands/RequestLoginGameCommand";
import LoginServer from "../../../../libs/common/scripts/modules/login/servers/LoginServer";
import LoginRequest from "../../../../libs/common/scripts/modules/login/models/LoginRequest";
import LobbyLoginServer from "../servers/LobbyLoginServer";
import { LoginResp, ErrResp } from "../../../protocol/protocols/protocols";
import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LoginModel from "../../../../libs/common/scripts/modules/login/models/LoginModel";
import MaintenancePanel from "../../activity/views/MaintenancePanel";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import OnLoginFailedSignal from "../../../../libs/common/scripts/modules/login/signals/OnLoginFailedSignal";
import NativeUtils from "../../../../libs/native/NativeUtils";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class LoginJPLobbyCommand extends RequestLoginGameCommand {
    @riggerIOC.inject(LoginServer)
    private server: LobbyLoginServer;

    @riggerIOC.inject(LoginModel)
    private loginModel: LoginModel;

    @riggerIOC.inject(LoginServer)
    private lobbyLoginServer: LobbyLoginServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(OnLoginFailedSignal)
    private onLoginFailedSignal: OnLoginFailedSignal;

    async execute(_, req: LoginRequest) {
        if(!req) return this.done();
        if (req.token) {
            req.shareCode = NativeUtils.getShareCode();
            req.deviceId = NativeUtils.getDeviceId();
            let loginTask = this.server.requestLogin(req.token, req.platform, req.deviceId, req.shareCode);
            let resp = await loginTask.wait();
            if (resp.isFailed) {
                //登录失败,尝试请求维护公告
                let task = this.lobbyLoginServer.requestMaintanceNotice();
                let notice = await task.wait();
                if(notice.isOk && notice.result.status == 2) {
                    UIManager.instance.showPanel(MaintenancePanel, LayerManager.uiLayerName, true, [notice.result.maintenanceTitle, notice.result.maintenanceContent, notice.result.status]);
                    cc.log(`noticeID:${notice.result.id}, version:${notice.result.version}, status:${notice.result.status}`);
                }
                let result = resp.reason;
                cc.log(`login error:${result}`);
                if(result instanceof ErrResp) {
                    // this.pushTipsQueueSignal.dispatch(`${result.errMsg}`);
                    this.onLoginFailedSignal.dispatch(`${result.errMsg}`);
                }
                else {
                    this.onLoginFailedSignal.dispatch(`登录失败`);
                }
                // if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
                // this.pushTipsQueueSignal.dispatch(`登录失败`);
            }
            else {
                this.loginModel.platform = req.platform;
                if(req.password) {
                    if(!req.ifStorePassword) {
                        this.loginModel.deleteLocalPassPort(req.account);
                    }
                    else {
                        let ret = this.loginModel.passPorts[req.account];
                        ret && this.loginModel.saveLocalPassPort(ret);
                    }
                }
                req.account && this.loginModel.saveRecentlyUsedAccount(req.account);
                if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
            }
        }
        this.done();
    }

}
