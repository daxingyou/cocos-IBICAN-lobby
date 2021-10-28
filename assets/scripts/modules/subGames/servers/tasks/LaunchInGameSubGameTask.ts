import Task from "../../../../../libs/common/scripts/utils/Task";
import SubGameEntity, { SubGameId, LaunchType } from "../../models/SubGameEntity";
import NativeFileUtils from "../../../../../libs/native/NativeFileUtils";
import SubGameUtils from "../../utils/SubGameUtils";
import SubGamesModel from "../../models/SubGamesModel";
import SceneUtils from "../../../../../libs/common/scripts/utils/SceneUtils";
import SceneModel from "../../../../../libs/common/scripts/modules/scene/models/SceneModel";
import OnChangeSceneCompleteSignal from "../../../../../libs/common/scripts/modules/scene/signals/OnChangeSceneCompleteSignal";
import SubGameReadySignal from "../../signals/SubGameReadySignal";

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
 * 
 */
export default class LaunchInGameSubGameTask extends Task {
    @riggerIOC.inject(SubGamesModel)
    private subGameModel: SubGamesModel;

    @riggerIOC.inject(OnChangeSceneCompleteSignal)
    private onChangeSceneCompleteSignal: OnChangeSceneCompleteSignal;

    private launchingSubgamePath: string;

    constructor() {
        super();
        this.timeout = 5000;
    }

    onTaskStart(subGameId: SubGameId) {
        // this.timeout = 5000;
        this.onChangeSceneCompleteSignal.on(this, this.onChangeSceneComplete, [subGameId]);
        this.launch(subGameId);
    }

    async onTaskCancel() {
        this.removeEventListener();
        // 退出子游戏（有可能子游戏已经启动，只是未完成)
        await cc["returnToLobby"]();
        this.subGameModel.runningSubGameId = null;
    }

    protected launch(subGameId: SubGameId): void {
        console.log(`now launch sub game:${subGameId}`)
        // cc.director.startAnimation();
        if (this.subGameModel.runningSubGameId) {
            this.setError(new Error(`there has been a sub game running:${this.subGameModel.runningSubGameId}`))
            return;
        }

        // 清除非大厅注册的类,防止类定义冲突
        console.time("*** 反注册非大厅类定义 ***");
        SubGameUtils.unregisterNonLobbyClasses();
        console.timeEnd("*** 反注册非大厅类定义 ***");

        // 设置正在运行的子游戏ID及搜索路径
        this.subGameModel.runningSubGameId = subGameId;
        this.launchingSubgamePath = SubGameUtils.makeSubGamePath(subGameId);
        console.time("*** 设置搜索路径 ***");
        this.setSearchPathes();
        console.timeEnd("*** 设置搜索路径 ***");

        // 处理settings
        // 先初始化大厅配置
        console.time("*** 获取大厅settings ***");
        SubGameUtils.getLobbySettings();
        console.timeEnd("*** 获取大厅settings ***");
        // 加载settings文件
        console.time("*** 获取子游戏settings ***");
        let settings = this.getSettings();
        console.timeEnd("*** 获取子游戏settings ***");
        if (!settings)
            return this.setError(`failed to load settings.js of ${subGameId}`);
        console.time("*** 合并大厅与子游戏settings ***");
        let mergedSettings = SubGameUtils.mergeLobbySettings(settings);
        console.timeEnd("*** 合并大厅与子游戏settings ***");

        console.time("*** 加载子游戏代码 ***");
        this.prepareProject();
        console.timeEnd("*** 加载子游戏代码 ***");

        // 准备子游戏
        console.time("*** 初始化子游戏(prepare) ***");
        SubGameUtils.prepare(mergedSettings);
        console.timeEnd("*** 初始化子游戏(prepare) ***");
        // 加载子游戏的入口场景
        let entryScene: string = SceneUtils.getInLobbyScene(subGameId);
        console.time("*** 预加载子游戏场景 ***");
        cc.director.preloadScene(entryScene, this.onSubGameLoadingProgression.bind(this), this.onSubGameLoad.bind(this));
    }

    protected setSearchPathes(): void {
        NativeFileUtils.unshiftSearchPath(this.launchingSubgamePath);
        cc.log(`new search path:${jsb.fileUtils.getSearchPaths()}`)
    }

    private getSettings(): any {
        let gameId: SubGameId = this.subGameModel.runningSubGameId;
        let subGame: SubGameEntity = this.subGameModel.getSubGame(gameId);
        return SubGameUtils.getSubGameSettings(subGame);
    }

    private prepareProject(): void {
        let gameId: SubGameId = this.subGameModel.runningSubGameId;
        SubGameUtils.prepareProject(this.subGameModel.getSubGame(gameId));
    }

    private onSubGameLoadingProgression(completedCount: number, totalCount: number, item: any) {
        if (totalCount == 0)
            return this.setProgress(0);

        let p: number = completedCount / totalCount;
        // console.log(`load progression, now:${completedCount}, total:${totalCount}, prog:${p}`);
        if (isNaN(p)) {
            return this.setProgress(0);
        }

        this.setProgress(p);
    }

    @riggerIOC.inject(SceneModel)
    private sceneModel: SceneModel;

    private async onSubGameLoad(error) {
        // console.log(`on sub game load, error:${error}`)
        if (error) {
            this.setError(error);
        }
        else {
            console.timeEnd("*** 预加载子游戏场景 ***");
            console.time("*** launch子游戏 ***");
            let subGameId = this.subGameModel.runningSubGameId
            this.sceneModel.preparedScene = SceneUtils.getInLobbyScene(subGameId);
            riggerIOC.ApplicationContext.freeAppId(subGameId);
            let app;
            try {
                app = MainLogicService.instance.launch(subGameId);

            } catch (error) {
                cc.log(`create app error:${error.stack}`);
            }
            await app.launch();
            console.timeEnd("*** launch子游戏 ***");
            // this.setComplete();
        }
    }

    @riggerIOC.inject(SubGameReadySignal)
    private subgameReadySignal: SubGameReadySignal;

    private onChangeSceneComplete(subGameId: SubGameId, sceneName: string) {
        cc.log(`*** subGameId:${subGameId}, sceneName:${sceneName}`);
        // let subGameId = this.subGameModel.runningSubGameId;
        let inLobbySceneName: string = SceneUtils.getInLobbyScene(subGameId);
        if (inLobbySceneName == sceneName) {
            this.subgameReadySignal.dispatch(subGameId);
            this.removeEventListener();
            this.setComplete();
        }
    }

    private removeEventListener(): void {
        this.onChangeSceneCompleteSignal.off(this, this.onChangeSceneComplete);
    }
}
