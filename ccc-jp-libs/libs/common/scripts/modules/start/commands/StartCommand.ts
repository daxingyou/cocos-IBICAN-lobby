import ChangeToFirstSceneSignal from "../../scene/signals/ChangeToFirstSceneSignal";

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
 * 整个应用的启动命令
 * 默认情况下，应用启动后会跳转到注册的第一个场景
 */
export default class StartCommand extends riggerIOC.Command {
    @riggerIOC.inject(ChangeToFirstSceneSignal)
    private changeToFirstScene: ChangeToFirstSceneSignal;

    execute(): void {
        // 默认跳转到第一个场景
        this.changeToFirstScene.dispatch();
    }
}
