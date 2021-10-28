import ActivityPanel from "./views/ActivityPanel";
import ActivityMediator from "./views/ActivityMediator";
import ActivityServer from "./servers/ActivityServer";
import ActivityContentView from "./views/ActivityContentView";
import ActivityContentMediator from "./views/ActivityContentMediator";
import ActivityModel from "./models/ActivityModel";
import ShowActivityPanelSignal from "./signals/ShowActivityPanelSignal";
import ShowActivityPanelCommand from "./commands/ShowActivityPanelCommand";
import ActivityUpdateSignal from "./signals/ActivityUpdateSignal";
import MakeSureLoginedCommand from "../login/commands/MakeSureLoginedCommand";
import MaintenancePanel from "./views/MaintenancePanel";
import MaintenanceMediator from "./views/MaintenanceMediator";
import ActivityDrawSignal from "./signals/ActivityDrawSignal";
import ActivityDrawModel from "./models/ActivityDrawModel";
import GrandWingSignal from "./signals/GrandWingSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

export default class ActivityContext extends riggerIOC.ModuleContext {
 /**
     * 绑定注入
     */
    bindInjections(): void {
        this.injectionBinder.bind(ActivityModel).toSingleton();
        this.injectionBinder.bind(ActivityServer).toValue(new ActivityServer());
        this.injectionBinder.bind(ActivityUpdateSignal).toSingleton();
        this.injectionBinder.bind(ActivityDrawModel).toSingleton();
        this.injectionBinder.bind(ActivityDrawSignal).toSingleton();
        this.injectionBinder.bind(GrandWingSignal).toSingleton();
    }

    /**
     * 绑定命令
     */
    bindCommands(): void {
        this.commandBinder.bind(ShowActivityPanelSignal)
        .inSequence()
        .to(MakeSureLoginedCommand)
        .to(ShowActivityPanelCommand);
    }

    /**
     * 绑定界面与Mediator
     */
    bindMediators(): void {
        this.mediationBinder.bind(ActivityPanel).to(ActivityMediator);

        //活动|公告 内容
        this.mediationBinder.bind(ActivityContentView).to(ActivityContentMediator);

        //维护信息
        this.mediationBinder.bind(MaintenancePanel).to(MaintenanceMediator);
    }

    /**
     * 模块启动时的回调
     */
    protected onStart(): void {
        this.done();
    }

}
