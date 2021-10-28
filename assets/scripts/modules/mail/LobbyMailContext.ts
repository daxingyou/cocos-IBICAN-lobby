import ShowLobbyMailPanelSignal from "./signals/showLobbyMailPanelSignal";
import ShowLobbyMailPanelCommand from "./command/showLobbyMailPanelCommand";
import ShowLobbyMailAwardsPanelSignal from "./signals/showLobbyMailAwardsPanelSignal";
import ShowLobbyMailAwardsPanelCommand from "./command/showLobbyMailAwardsPanelCommand";
import LobbyMailModel from "./model/LobbyMailModel";
import LobbyMailServer from "./server/LobbyMailServer";
import LobbyMailUpdateRedPointSignal from "./signals/LobbyMailUpdateRedPointSignal";
import LobbyMailDeleteMailSignal from "./signals/LobbyMailDeleteMailSignal";
import LobbyMailReadMailSignal from "./signals/LobbyMailReadMailSignal";
import LobbyMailReceiveMailPropSignal from "./signals/LobbyMailReceiveMailPropSignal";
import LobbyMailPushSignal from "./signals/LobbyMailPushSignal";


// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class LobbyMailContext extends riggerIOC.ModuleContext {
    /**
     * 绑定注入
     */
    bindInjections(): void {
        this.injectionBinder.bind(LobbyMailModel).toSingleton();
        this.injectionBinder.bind(LobbyMailServer).toValue(new LobbyMailServer());
        this.injectionBinder.bind(ShowLobbyMailPanelSignal).toSingleton();
        this.injectionBinder.bind(ShowLobbyMailAwardsPanelSignal).toSingleton();
        this.injectionBinder.bind(LobbyMailUpdateRedPointSignal).toSingleton();
        this.injectionBinder.bind(LobbyMailDeleteMailSignal).toSingleton();
        this.injectionBinder.bind(LobbyMailReadMailSignal).toSingleton();
        this.injectionBinder.bind(LobbyMailReceiveMailPropSignal).toSingleton();
        this.injectionBinder.bind(LobbyMailPushSignal).toSingleton();
    }


    /**
     * 绑定命令
     */
    bindCommands(): void {
        this.commandBinder.bind(ShowLobbyMailPanelSignal).to(ShowLobbyMailPanelCommand);
        this.commandBinder.bind(ShowLobbyMailAwardsPanelSignal).to(ShowLobbyMailAwardsPanelCommand);
    }

    /**
     * 绑定界面与Mediator
     */
    bindMediators(): void {
        // this.mediationBinder.bind(LobbyMarqueePanel).to(LobbyMarqueeMediator);
    }

    /**
     * 模块启动时的回调
     */
    protected onStart(): void {
        this.done();
    }
}
