import PushTipsQueueCommand from "./commands/PushTipsQueueCommand";
import PushTipsQueueSignal from "./signals/PushTipsQueueSignal";
import TipsModel from "./models/TipsModel";
import BaseTipsPanel from "./views/BaseTipsPanel";
import BaseTipsMediator from "./views/BaseTipsMediator";
import PushWaitingQueueSignal from "./signals/PushWaitingQueueSignal";
import PushWaitingQueueCommand from "./commands/PushWaitingQueueCommand";
import BaseWaitingPanel from "./views/BaseWaitingPanel";
import BaseWaitingMediator from "./views/BaseWaitingMediator";
import BaseAlertPanel from "./views/BaseAlertPanel";
import BaseAlertMediator from "./views/BaseAlertMediator";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class TipsContext extends riggerIOC.ModuleContext {
    /**
     * 绑定注入
     */
    bindInjections(): void {
        this.injectionBinder.bind(TipsModel).toSingleton();
        // 将显示提示的命令设为单例
        this.injectionBinder.bind(PushTipsQueueCommand).toSingleton();
        this.injectionBinder.bind(PushTipsQueueSignal).toSingleton();
    }

    /**
     * 绑定命令
     */
    bindCommands(): void {
        this.commandBinder.bind(PushTipsQueueSignal).to(PushTipsQueueCommand);
        this.commandBinder.bind(PushWaitingQueueSignal).to(PushWaitingQueueCommand);
    }

    /**
     * 绑定界面与Mediator
     */
    bindMediators(): void {
        this.mediationBinder.bind(BaseTipsPanel).to(BaseTipsMediator);
        this.mediationBinder.bind(BaseWaitingPanel).to(BaseWaitingMediator);
        this.mediationBinder.bind(BaseAlertPanel).to(BaseAlertMediator);
    }

    /**
     * 模块启动时的回调
     */
    protected onStart(): void {
        this.done();
    }
}
