import LoginModel from "./models/LoginModel";
import LoginServer from "./servers/LoginServer";
import OnClickLoginSignal from "./signals/OnClickLoginSignal";
import BaseLoginMediator from "./views/BaseLoginMediator";
import ShowLoginPanelSignal from "./signals/ShowLoginPanelSignal";
import ShowLoginPanelCommand from "./commands/ShowLoginPanelCommand";
import BaseLoginPanel from "./views/BaseLoginPanel";
import RequestLoginSignal from "./signals/RequestLoginSignal";
import RequestLoginPassportCommand from "./commands/RequestLoginPassportCommand";
import RequestLoginGameCommand from "./commands/RequestLoginGameCommand";
import BaseRegisterPanel from "./views/BaseRegisterPanel";
import BaseRegisterMediator from "./views/BaseRegisterMediator";
import OnClickRegisterSignal from "./signals/OnClickRegisterSignal";
import ShowRegisterPanelSignal from "./signals/ShowRegisterPanelSignal";
import ShowRegisterPanelCommand from "./commands/ShowRegisterPanelCommand";
import RequestVerifyCodeSignal from "./signals/RequestVerifyCodeSignal";
import RequestVerifyCodeCommand from "./commands/RequestVerifyCodeCommand";
import RequestRegisterSignal from "./signals/RequestRegisterSignal";
import RequestRegisterCommand from "./commands/RequestRegisterCommand";
import OnLoginSuccessSignal from "./signals/OnLoginSuccessSignal";
import PrepareLoginSpecCommand from "./commands/PrepareLoginSpecCommand";
import OnLoginFailedSignal from "./signals/OnLoginFailedSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class LoginContext extends riggerIOC.ModuleContext {
    /**
     * 绑定注入
     */
    bindInjections(): void {
        this.injectionBinder.bind(LoginModel).toSingleton();
        this.injectionBinder.bind(LoginServer).toSingleton();
        this.injectionBinder.bind(OnClickLoginSignal).toSingleton();
        this.injectionBinder.bind(OnClickRegisterSignal).toSingleton();
        this.injectionBinder.bind(OnLoginSuccessSignal).toSingleton();
        this.injectionBinder.bind(OnLoginFailedSignal).toSingleton();
    }

    /**
     * 绑定命令
     */
    bindCommands(): void {
        // 显示登录界面
        this.commandBinder.bind(ShowLoginPanelSignal).to(ShowLoginPanelCommand);
        // 显示注册界面
        this.commandBinder.bind(ShowRegisterPanelSignal).to(ShowRegisterPanelCommand);

        // 请求登录
        this.commandBinder.bind(RequestLoginSignal)
        .inSequence()
        .to(PrepareLoginSpecCommand)
        .to(RequestLoginPassportCommand)
        .to(RequestLoginGameCommand);

        // 请求获取验证码
        this.commandBinder.bind(RequestVerifyCodeSignal).to(RequestVerifyCodeCommand);
        // 请求注册
        this.commandBinder.bind(RequestRegisterSignal).to(RequestRegisterCommand);
    }

    /**
     * 绑定界面与Mediator
     */
    bindMediators(): void {
        this.mediationBinder.bind(BaseLoginPanel).to(BaseLoginMediator);
        this.mediationBinder.bind(BaseRegisterPanel).to(BaseRegisterMediator);
    }

    /**
     * 模块启动时的回调
     */
    protected onStart(): void {
        cc.log(`start login context`)
        this.done();
    }
}
