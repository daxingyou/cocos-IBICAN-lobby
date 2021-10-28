import SituationModel from "./models/SituationModel";
import SituationServer from "./servers/SituationServer";
import GetCustomLoginSpecTask from "./tasks/GetCustomLoginSpecTask";
import BaseGetConnectSpecTask from "../network/tasks/BaseGetConnectSpecTask";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 游戏运行环境的维护和检测,主要包括:
 * 1. 外部注入信息的获取
 * 2. 设备运行环境的监测
 * 3. 其它
 */
export default class SituationContext extends riggerIOC.ModuleContext {

    /**
     * 绑定注入
     */
    bindInjections(): void {
        this.injectionBinder.bind(SituationModel).toSingleton();
        this.injectionBinder.bind(SituationServer).toSingleton();
        this.injectionBinder.bind(GetCustomLoginSpecTask).toSingleton();
        this.injectionBinder.bind(BaseGetConnectSpecTask).toSingleton();

    }

    /**
     * 绑定命令
     */
    bindCommands(): void {
    }

    /**
     * 绑定界面与Mediator
     */
    bindMediators(): void {

    }

    /**
     * 模块启动时的回调
     */
    protected onStart(): void {
        // this.initSignal.dispatch();
        this.done();
    }

}
