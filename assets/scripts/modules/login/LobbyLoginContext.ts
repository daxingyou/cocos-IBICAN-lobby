import LoginContext from "../../../libs/common/scripts/modules/login/LoginContext";
import LoginPanel from "./views/LoginPanel";
import BaseLoginPanel from "../../../libs/common/scripts/modules/login/views/BaseLoginPanel";
import BaseLoginMediator from "../../../libs/common/scripts/modules/login/views/BaseLoginMediator";
import LoginMediator from "./views/LoginMediator";
import BaseRegisterPanel from "../../../libs/common/scripts/modules/login/views/BaseRegisterPanel";
import RegisterPanel from "./views/RegisterPanel";
import BaseRegisterMediator from "../../../libs/common/scripts/modules/login/views/BaseRegisterMediator";
import RegisterMediator from "./views/RegisterMediator";
import RequestLoginPassportCommand from "../../../libs/common/scripts/modules/login/commands/RequestLoginPassportCommand";
import LoginJPPassPortCommand from "./commands/LoginJPPassPortCommand";
import RequestLoginGameCommand from "../../../libs/common/scripts/modules/login/commands/RequestLoginGameCommand";
import LoginJPLobbyCommand from "./commands/LoginJPLobbyCommand";
import LoginServer from "../../../libs/common/scripts/modules/login/servers/LoginServer";
import LobbyLoginServer from "./servers/LobbyLoginServer";
import ExitLoginSignal from "./signals/ExitLoginSignal";
import ExitLoginCommand from "./commands/ExitLoginCommand";
import LoginScene from "./views/LoginScene";
import LoginSceneMediator from "./views/LoginSceneMediator";
import GetUpdateNoticeTask from "./tasks/GetUpdateNoticeTask";
import QuicklyLoginSignal from "./signals/QuicklyLoginSignal";
import QuicklyLoginCommand from "./commands/QuicklyLoginCommand";
import DisconnectPanel from "./views/DisconnectPanel";
import DisconnectMediator from "./views/DisconnectMediator";
import RequestRegisterCommand from "../../../libs/common/scripts/modules/login/commands/RequestRegisterCommand";
import LobbyRequestRegisterCommand from "./commands/LobbyRequestRegisterCommand";
import OnLoginFailedSignal from "../../../libs/common/scripts/modules/login/signals/OnLoginFailedSignal";
import OnLobbyLoginFailedCommand from "./commands/OnLobbyLoginFailedCommand";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class LobbyLoginContext extends LoginContext {

    bindInjections(): void {
        super.bindInjections();
        this.injectionBinder.bind(BaseLoginPanel).to(LoginPanel);
        this.injectionBinder.bind(BaseLoginMediator).to(LoginMediator);
        this.injectionBinder.bind(BaseRegisterPanel).to(RegisterPanel);
        this.injectionBinder.bind(BaseRegisterMediator).to(RegisterMediator);

        this.injectionBinder.bind(RequestLoginPassportCommand).to(LoginJPPassPortCommand);
        this.injectionBinder.bind(RequestLoginGameCommand).to(LoginJPLobbyCommand);
        this.injectionBinder.bind(LoginServer).to(LobbyLoginServer);
        this.injectionBinder.bind(RequestRegisterCommand).to(LobbyRequestRegisterCommand);

        // 获取更新公告的任务
        this.injectionBinder.bind(GetUpdateNoticeTask).toSingleton();
    }

    bindCommands(): void {
        super.bindCommands();

        //退出登录
        this.commandBinder.bind(ExitLoginSignal).to(ExitLoginCommand);

        //快速登录
        this.commandBinder.bind(QuicklyLoginSignal).to(QuicklyLoginCommand);

        //登录失败
        this.commandBinder.bind(OnLoginFailedSignal).to(OnLobbyLoginFailedCommand);
    }

    bindMediators(): void {
        super.bindMediators();
        this.mediationBinder.bind(LoginScene).to(LoginSceneMediator);
        this.mediationBinder.bind(DisconnectPanel).to(DisconnectMediator)
    }

}
