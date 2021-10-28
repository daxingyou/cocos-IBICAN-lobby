import SceneModel from "./models/SceneModel";
import ChangeSceneSignal from "./signals/changeSceneSignal";
import ChangeSceneCommand from "./commands/ChangeSceneCommand";
import ChangeToFirstSceneSignal from "./signals/ChangeToFirstSceneSignal";
import ChangeToFirstSceneCommand from "./commands/ChangeToFirstSceneCommand";
import ChangeToInLobbySceneCommand from "./commands/ChangeToInLobbySceneCommand";
import OnChangeSceneCompleteSignal from "./signals/OnChangeSceneCompleteSignal";

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
 * 场景模块，用于管理整个游戏中的场景
 */
export default class SceneContext extends riggerIOC.ModuleContext {
    @riggerIOC.inject(SceneModel)
    protected sceneModel: SceneModel;

    /**
    * 绑定注入
    */
    bindInjections(): void {
        this.injectionBinder.bind(SceneModel).toSingleton();
        this.injectionBinder.bind(OnChangeSceneCompleteSignal).toSingleton();
    }

    /**
     * 绑定命令
     */
    bindCommands(): void {
        this.commandBinder.bind(ChangeSceneSignal).to(ChangeSceneCommand).inSequence();
        // 如果是大厅启动子游戏，则绑定到启动大厅内场景的命令
        if (this.sceneModel.preparedScene) {
            this.commandBinder.bind(ChangeToFirstSceneSignal).to(ChangeToInLobbySceneCommand);
        }
        else {
            this.commandBinder.bind(ChangeToFirstSceneSignal).to(ChangeToFirstSceneCommand);
        }
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
        this.done();
    }
}
