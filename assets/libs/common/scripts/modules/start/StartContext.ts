import StartSignal from "./signals/StartSignal";
import StartCommand from "./commands/StartCommand";
import ReadyCommand from "./commands/ReadyCommand";
import BaseAlertInfo, { BaseAlertStyle, BaseAlertResult } from "../tips/models/BaseAlertInfo";
import Application from "../../Application";
import BaseAlertPanel from "../tips/views/BaseAlertPanel";

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
 * 负责启动整个应用的模块
 * 可以在此模块中发出第一条启动命令
 */
export default class StartContext extends riggerIOC.ModuleContext {
    @riggerIOC.inject(StartSignal)
    private startSignal: StartSignal;

    /**
    * 绑定注入
    */
    bindInjections(): void {
        this.injectionBinder.bind(ReadyCommand);
    }

    /**
     * 绑定命令
     */
    bindCommands(): void {
        this.commandBinder
        .bind(StartSignal)
        .to(StartCommand)
        .once();
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
        Application.exitGame = async () => {
            let info: BaseAlertInfo = new BaseAlertInfo();
             info.content = "是否要退出游戏";
             info.style = BaseAlertStyle.YES_NO;
             let panel: BaseAlertPanel = BaseAlertPanel.show(info);
             let choice: BaseAlertResult = await panel.wait();
             BaseAlertPanel.hide(panel);
             if (BaseAlertResult.YES == choice) {
                cc.game.end();
             }
        };
        this.startSignal.dispatch();
        this.done();
    }
}
