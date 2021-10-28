import LobbyMarqueeModel from "./model/LobbyMarqueeModel";
import LobbyMarqueePanel from "./views/LobbyMarqueePanel";
import LobbyMarqueeMediator from "./mediator/LobbyMarqueeMediator";
import LobbyMarqueePlayEndOnceSignal from "./signals/LobbyMarqueePlayEndOnceSignal";
import LobbyPushMarqueeSignal from "./signals/LobbyPushMarqueeSignal";
import LobbyPushMarqueeCommand from "./commands/LobbyPushMarqueeCommand";
import LobbyMarqueeServer from "./server/LobbyMarqueeServer";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class LobbyMarqueeContext extends riggerIOC.ModuleContext {
    /**
     * 绑定注入
     */
    bindInjections(): void {
        this.injectionBinder.bind(LobbyMarqueeModel).toSingleton();
        this.injectionBinder.bind(LobbyMarqueeServer).toValue(new LobbyMarqueeServer());
        this.injectionBinder.bind(LobbyMarqueePlayEndOnceSignal).toSingleton();
        this.injectionBinder.bind(LobbyPushMarqueeSignal).toSingleton();
        this.injectionBinder.bind(LobbyPushMarqueeCommand).toSingleton();
        // this.injectionBinder.bind(LobbyMarqueePanel).toSingleton();
        // this.injectionBinder.bind(LobbyMarqueeMediator).toSingleton();
    }


    /**
     * 绑定命令
     */
    bindCommands(): void {
        this.commandBinder.bind(LobbyPushMarqueeSignal).to(LobbyPushMarqueeCommand).inSequence();
    }

    /**
     * 绑定界面与Mediator
     */
    bindMediators(): void {
        // this.mediationBinder.bind(LobbyMarqueePanel).to(LobbyMarqueeMediator);
        this.mediationBinder.bind(LobbyMarqueePanel).to(LobbyMarqueeMediator);
    }

    /**
     * 模块启动时的回调
     */
    protected onStart(): void {
        this.done();
    }
}
