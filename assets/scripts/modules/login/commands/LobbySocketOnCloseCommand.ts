// import UIManager from "../../../../libs/common/scripts/utils/UIManager";
// import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
// import DisconnectPanel from "../views/DisconnectPanel";
// import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
// import ExitLoginSignal from "../signals/ExitLoginSignal";
// import LoginRequest from "../../../../libs/common/scripts/modules/login/models/LoginRequest";
// import LoginModel, { platformType } from "../../../../libs/common/scripts/modules/login/models/LoginModel";
// import RequestLoginSignal from "../../../../libs/common/scripts/modules/login/signals/RequestLoginSignal";
// import OnLoginSuccessSignal from "../../../../libs/common/scripts/modules/login/signals/OnLoginSuccessSignal";
// import LobbySceneNames from "../../scene/LobbySceneNames";
// import NativeUtils from "../../../../libs/native/NativeUtils";
// import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
// import SituationModel from "../../../../libs/common/scripts/modules/situation/models/SituationModel";
// import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
// import OnLoginFailedSignal from "../../../../libs/common/scripts/modules/login/signals/OnLoginFailedSignal";

// // Learn TypeScript:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// const {ccclass, property} = cc._decorator;

// @ccclass
// export default class LobbySocketOnCloseCommand extends riggerIOC.Command {
//     @riggerIOC.inject(ExitLoginSignal)
//     private exitLoginSignal: ExitLoginSignal;

//     @riggerIOC.inject(LoginModel)
//     private loginModel: LoginModel;

//     @riggerIOC.inject(RequestLoginSignal)
//     private requestLoginSignal: RequestLoginSignal;

//     @riggerIOC.inject(OnLoginSuccessSignal)
//     private onLoginSuccessSignal: OnLoginSuccessSignal;

//     @riggerIOC.inject(NetworkServer)
//     private networkServer: NetworkServer;

//     @riggerIOC.inject(SituationModel)
//     private sitModel:SituationModel;

//     @riggerIOC.inject(PushTipsQueueSignal)
//     private pushTipsQueueSignal: PushTipsQueueSignal;

//     @riggerIOC.inject(OnLoginFailedSignal)
//     private onLoginFailedSignal: OnLoginFailedSignal;

//     constructor() {
//         super();
//     }

//     async execute(channelNames: string) {
//         let currentSceneName = cc.director.getScene().name;
//         if(currentSceneName && currentSceneName == LobbySceneNames.LOBBY_LOGIN_SCENE) return;
//         let disconnectPanel = UIManager.instance.showPanel(DisconnectPanel, LayerManager.uiLayerName, false) as DisconnectPanel;
//         disconnectPanel.prepare();
//         let result = await disconnectPanel.wait();
//         if(result) {
//             let req: LoginRequest = new LoginRequest();
//             req.account = this.loginModel.activatedAccount;
//             if(this.loginModel.platform == platformType.device) {
//                 //设备登录
//                 let id = NativeUtils.getDeviceId();
//                 req.platform = this.loginModel.platform;
//                 req.deviceId = id;
//             }
//             else {
//                 //通行证登录
//                 req.token = this.loginModel.passPorts[this.loginModel.activatedAccount].token;
//                 // req.tokenTimeStamp = this.loginModel.passPorts[this.loginModel.activatedAccount].tokenSeconds;
//             }
            
//             this.sitModel.setLoginSpecGlobal(req);
//             this.requestLoginSignal.dispatch();
//             this.onLoginSuccessSignal.on(this, this.onLoginSuccess);
//             this.onLoginFailedSignal.on(this, this.onLoginFailed);
//         }
//         else {
//             this.exitLoginSignal.dispatch();
//         }
//     }

//     private onLoginSuccess() {
//         this.pushTipsQueueSignal.dispatch('重连成功');
//         this.onLoginSuccessSignal.off(this, this.onLoginSuccess);
//         this.onLoginFailedSignal.off(this, this.onLoginFailed);
//         if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
//     }

//     private onLoginFailed() {
//         this.onLoginSuccessSignal.off(this, this.onLoginSuccess);
//         this.onLoginFailedSignal.off(this, this.onLoginFailed);
//         if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
//     }
// }
