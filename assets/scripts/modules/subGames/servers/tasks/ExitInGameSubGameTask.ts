import Task from "../../../../../libs/common/scripts/utils/Task";
import SubGamesModel from "../../models/SubGamesModel";
import { SubGameId } from "../../models/SubGameEntity";
import SubGameUtils from "../../utils/SubGameUtils";
import NativeFileUtils from "../../../../../libs/native/NativeFileUtils";
import LobbyServer from "../../../lobby/servers/LobbyServer";
import SubGameExitSignal from "../../signals/SubGameExitSignal";
import LobbySceneNames from "../../../scene/LobbySceneNames";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class ExitInGameSubGameTask extends Task {
    @riggerIOC.inject(SubGamesModel)
    private subGameModel: SubGamesModel;

    @riggerIOC.inject(LobbyServer)
    private lobbyServer: LobbyServer;

    @riggerIOC.inject(SubGameExitSignal)
    private subGameExitSignal: SubGameExitSignal;

    async onTaskStart() {
        let runningSubGameId: SubGameId = this.subGameModel.runningSubGameId;
        console.log(`now running sub game id:${runningSubGameId}`)
        if (runningSubGameId) {
            // this.gameWalletTransferAll(1);
            // 清除搜索路径
            NativeFileUtils.removeSearchPath(SubGameUtils.makeSubGamePath(runningSubGameId));
            console.log(`now search:${jsb.fileUtils.getSearchPaths()}`)
            if(cc.director.getScene().name == LobbySceneNames.MainScene) {
                this.onMainSceneLaunch();
            }
            else {
                cc.director.preloadScene("mainScene", null, this.onPrepareComplete.bind(this))
            }
            this.lobbyServer.gameWalletTransferAll(1);
        }

    }

    onTaskCancel(): void {
        this.cancel("canceled exit in game sub game task")
    }

    private onPrepareComplete(error): void {
        if (error) {
            this.setError(error);
        }
        else {
            cc.director.loadScene("mainScene", this.onMainSceneLaunch.bind(this));
        }
    }

    private onMainSceneLaunch() {
        let subGameId = this.subGameModel.runningSubGameId;
        // 析构子游戏
        let ent: riggerIOC.ApplicationContext = MainLogicService.getEntranceById(subGameId);
        MainLogicService.instance.exit(subGameId);
        ent && ent.dispose();

        // 获取大厅的settings
        let lobbySettings = SubGameUtils.getLobbySettings();
        SubGameUtils.prepare(lobbySettings);

        // 清除子游戏类定义
        SubGameUtils.unregisterNonLobbyClasses();
        this.subGameModel.runningSubGameId = null;
        this.setComplete();
        this.subGameExitSignal.dispatch(subGameId);
    }
}
