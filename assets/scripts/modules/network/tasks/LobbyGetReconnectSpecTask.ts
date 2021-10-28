import BaseGetReconnectSpecTask, { BaseReconnectSpec } from "../../../../libs/common/scripts/modules/network/tasks/BaseGetReconnectSpecTask";
import { ChannelName } from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import LobbySceneNames from "../../scene/LobbySceneNames";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import DisconnectPanel from "../../login/views/DisconnectPanel";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import LoginRequest from "../../../../libs/common/scripts/modules/login/models/LoginRequest";
import LoginModel, { platformType } from "../../../../libs/common/scripts/modules/login/models/LoginModel";
import NativeUtils from "../../../../libs/native/NativeUtils";
import SituationModel from "../../../../libs/common/scripts/modules/situation/models/SituationModel";
import RequestLoginSignal from "../../../../libs/common/scripts/modules/login/signals/RequestLoginSignal";
import OnLoginSuccessSignal from "../../../../libs/common/scripts/modules/login/signals/OnLoginSuccessSignal";
import OnLoginFailedSignal from "../../../../libs/common/scripts/modules/login/signals/OnLoginFailedSignal";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import ExitLoginSignal from "../../login/signals/ExitLoginSignal";
import CommonContext from "../../../../libs/common/scripts/CommonContext";
import SubGamesModel from "../../subGames/models/SubGamesModel";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class LobbyGetReconnectSpecTask extends BaseGetReconnectSpecTask {
    @riggerIOC.inject(LoginModel)
    private loginModel: LoginModel;

    @riggerIOC.inject(SituationModel)
    private sitModel: SituationModel;

    @riggerIOC.inject(RequestLoginSignal)
    private requestLoginSignal: RequestLoginSignal;

    @riggerIOC.inject(OnLoginSuccessSignal)
    private onLoginSuccessSignal: OnLoginSuccessSignal;

    @riggerIOC.inject(OnLoginFailedSignal)
    private onLoginFailedSignal: OnLoginFailedSignal;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(ExitLoginSignal)
    private exitLoginSignal: ExitLoginSignal;

    @riggerIOC.inject(CommonContext)
    private commonContext: CommonContext;

    @riggerIOC.inject(SubGamesModel)
    private subGameModel: SubGamesModel;

    onTaskStart(channelName: ChannelName): void {
        this.doTask();
    }

    private async doTask() {
        let currentSceneName = cc.director.getScene().name;
        if (currentSceneName && currentSceneName == LobbySceneNames.LOBBY_LOGIN_SCENE) return;
        let disconnectPanel = UIManager.instance.showPanel(DisconnectPanel, LayerManager.uiLayerName, true) as DisconnectPanel;
        disconnectPanel.prepare();
        let result = await disconnectPanel.wait();
        if (result) {
            BaseWaitingPanel.show("");
            let spec: BaseReconnectSpec = new BaseReconnectSpec();
            spec.interval = 10000;
            spec.times = 3

            spec.successHandler = riggerIOC.Handler.create(this, this.onConnectSuccess, null, true);
            spec.failedHandler = riggerIOC.Handler.create(this, this.onConnectFailed, null, true);
            this.setComplete(spec);
        }
        else {
            this.setError();
            this.exitLoginSignal.dispatch();
        }
    }

    onTaskCancel(): void {

    }

    onConnectSuccess(): void {
        let req: LoginRequest = new LoginRequest();
        req.account = this.loginModel.activatedAccount;
        if (this.loginModel.platform == platformType.device) {
            //设备登录
            let id = NativeUtils.getDeviceId();
            req.platform = this.loginModel.platform;
            req.deviceId = id;
        }
        else {
            //通行证登录
            req.token = this.loginModel.passPorts[this.loginModel.activatedAccount].token;
            // req.tokenTimeStamp = this.loginModel.passPorts[this.loginModel.activatedAccount].tokenSeconds;
        }

        this.sitModel.setLoginSpecGlobal(req);
        this.requestLoginSignal.dispatch();
        this.onLoginSuccessSignal.on(this, this.onLoginSuccess);
        this.onLoginFailedSignal.on(this, this.onLoginFailed);
    }

    private onConnectFailed(): void {
        if (BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
        if(this.subGameModel.runningSubGameId) {
            this.commonContext.canReturnToLobby && this.commonContext.returnToLobby();
        }
        this.exitLoginSignal.dispatch();
    }

    private onLoginSuccess(): void {
        this.pushTipsQueueSignal.dispatch('重连成功');
        this.onLoginSuccessSignal.off(this, this.onLoginSuccess);
        this.onLoginFailedSignal.off(this, this.onLoginFailed);
        if (BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
    }

    private onLoginFailed(): void {
        this.onLoginSuccessSignal.off(this, this.onLoginSuccess);
        this.onLoginFailedSignal.off(this, this.onLoginFailed);
        if (BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
    }

}
