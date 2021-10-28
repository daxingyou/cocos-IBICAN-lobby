import RequestLoginPassportCommand from "../../../../libs/common/scripts/modules/login/commands/RequestLoginPassportCommand";
import LoginModel from "../../../../libs/common/scripts/modules/login/models/LoginModel";
import LoginServer from "../../../../libs/common/scripts/modules/login/servers/LoginServer";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import Task from "../../../../libs/common/scripts/utils/Task";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import PassPortInfo from "../../../../libs/common/scripts/modules/login/models/PassportInfo";
import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import LoginRequest from "../../../../libs/common/scripts/modules/login/models/LoginRequest";
import LobbyLoginServer from "../servers/LobbyLoginServer";
import MaintenancePanel from "../../activity/views/MaintenancePanel";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import OnLoginFailedSignal from "../../../../libs/common/scripts/modules/login/signals/OnLoginFailedSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class LoginJPPassPortCommand extends RequestLoginPassportCommand {
    @riggerIOC.inject(LoginModel)
    private model: LoginModel;

    @riggerIOC.inject(LoginServer)
    private server: LobbyLoginServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    private tipsSig: PushTipsQueueSignal;

    @riggerIOC.inject(LoginServer)
    private lobbyLoginServer: LobbyLoginServer;

    @riggerIOC.inject(OnLoginFailedSignal)
    private onLoginFailedSignal: OnLoginFailedSignal;

    async execute(_, loginReq: LoginRequest) {
        BaseWaitingPanel.show("正在登录");
        let token: string = loginReq.token;
        if (token && loginReq.tokenTimeStamp >= new Date().getTime()) {
            //本地存储token尚在有效期,读取本地缓存,直接登录大厅
            let ret: PassPortInfo = this.model.getLocalPassPort(loginReq.account);
            if (ret) {
                if (!this.model.passPorts[loginReq.account]) {
                    this.model.updatePassPort(ret);
                    this.model.activatedAccount = ret.account;
                }
                this.done(loginReq);
            }
            else {
                // if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
                this.onLoginFailedSignal.dispatch();
                this.done(null);
            }
        }
        else {
            // 登录通行证( 密码登录 | 验证码登录 | token登录 | 设备登录)
            let task: Task = this.server.requestLoginPassport(loginReq);
            let resp = await task.wait();
            if (resp.isOk) {
                let ret: PassPortInfo | string = this.parseResp(resp.result);
                if (ret instanceof PassPortInfo) {
                    this.model.updatePassPort(ret);
                    this.model.activatedAccount = ret.account;
                    loginReq.token = ret.token;
                    this.done(loginReq);
                }
                else {
                    this.onLoginFailedSignal.dispatch(ret);
                    // this.tipsSig.dispatch(ret);
                    loginReq.token = null;
                    // if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
                    //登录失败,尝试请求维护公告
                    let task = this.lobbyLoginServer.requestMaintanceNotice();
                    let notice = await task.wait();
                    if (notice.isOk && notice.result.status == 2) {
                        UIManager.instance.showPanel(MaintenancePanel, LayerManager.uiLayerName, true, [notice.result.maintenanceTitle, notice.result.maintenanceContent, notice.result.status]);
                        cc.log(`noticeID:${notice.result.id}, version:${notice.result.version}, status:${notice.result.status}`);
                    }
                    this.done(null);
                }
            }
            else {
                // this.tipsSig.dispatch("登录通行证失败");
                this.onLoginFailedSignal.dispatch("登录通行证失败");
                loginReq.token = null;
                // if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
                //登录失败,尝试请求维护公告
                let task = this.lobbyLoginServer.requestMaintanceNotice();
                let notice = await task.wait();
                if (notice.isOk && notice.result.status == 2) {
                    UIManager.instance.showPanel(MaintenancePanel, LayerManager.uiLayerName, true, [notice.result.maintenanceTitle, notice.result.maintenanceContent, notice.result.status]);
                    cc.log(`noticeID:${notice.result.id}, version:${notice.result.version}, status:${notice.result.status}`);
                }
                this.done(null);
            }
        }
    }

    parseResp(resp: string): PassPortInfo | string {
        cc.log(`resp:${resp}`);
        let obj = JSON.parse(resp);
        if (0 == obj.code) {
            let passPort: PassPortInfo = new PassPortInfo(obj.data.mobile);
            passPort.token = obj.data.token;
            passPort.icon = obj.data.headPortrait;
            passPort.nickName = obj.data.nickname;
            passPort.userId = obj.data.userId;
            passPort.tokenSeconds = rigger.service.TimeService.instance.serverTime + obj.data.tokenSeconds * 1000;
            return passPort;
        }
        else {
            return obj.msg;
        }

    }

}
