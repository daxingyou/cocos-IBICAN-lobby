import { GameListReq, GameListResp, Game } from "../../../protocol/protocols/protocols";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import CommandCodes from "../../../protocol/CommandCodes";
import NativeFileUtils from "../../../../libs/native/NativeFileUtils";
import { GameListRespSignal, GameListPushSignal } from "../../../protocol/signals/signals";
import SubGamesModel from "../models/SubGamesModel";
// import Task, { TaskId } from "../../../../libs/common/scripts/utils/Task";
// import DownLoadingTask from "../../../../libs/common/scripts/utils/DownLoadingTask";
import SubGameEntity, { SubGameId } from "../models/SubGameEntity";
import RequestLaunchInfoTask from "./tasks/RequestLaunchInfoTask";
import LaunchSubGameTask from "./tasks/LaunchSubGameTask";
import NativeNetworkUtils from "../../../../libs/native/NativeNetworkUtils";
import OnSubGameListUpdateSignal from "../signals/OnSubGameListUpdateSignal";
import LocalSubGameEntity from "../models/LocalSubGameEntity";
import ExitInGameSubGameTask from "./tasks/ExitInGameSubGameTask";
import SubGameUtils from "../utils/SubGameUtils";
import ReportViewOpenSignal from "../signals/ReportViewOpenSignal";
import { reportParams } from "../../../../libs/common/scripts/CommonContext";
import NativeUtils from "../../../../libs/native/NativeUtils";
import SubGameExitSignal from "../signals/SubGameExitSignal";
import SubGameReadySignal from "../signals/SubGameReadySignal";
import PlayMusicSignal from "../../../../libs/common/scripts/modules/sound/signals/PlayMusicSignal";
import StopMusicSignal from "../../../../libs/common/scripts/modules/sound/signals/StopMusicSignal";

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
 * 子游戏服务器
 */
export default class SubGamesServer extends riggerIOC.Server {
    @riggerIOC.inject(NetworkServer)
    private network: NetworkServer;

    @riggerIOC.inject(GameListRespSignal)
    private gameListRespSignal: GameListRespSignal;

    @riggerIOC.inject(SubGamesModel)
    private subGameModel: SubGamesModel;

    @riggerIOC.inject(OnSubGameListUpdateSignal)
    private onSubGameListUpdateSignal: OnSubGameListUpdateSignal;

    @riggerIOC.inject(GameListPushSignal)
    private gameListPushSignal: GameListPushSignal;

    @riggerIOC.inject(ExitInGameSubGameTask)
    private exitSubGameTask: ExitInGameSubGameTask;

    @riggerIOC.inject(ReportViewOpenSignal)
    private reportViewOpenSignal: ReportViewOpenSignal;

    @riggerIOC.inject(SubGameExitSignal)
    private subGameExitSignal: SubGameExitSignal;

    @riggerIOC.inject(SubGameReadySignal)
    private subGameReadySignal: SubGameReadySignal;

    constructor() {
        super();
        let self = this;
        // 在全局提供一个返回大厅的接口
        cc["returnToLobby"] = async function () {
            NativeUtils.setOrientation(1);
            await self.exitSubGameTask.start().wait();
            console.log('success to return lobby, then reset exit task');
            self.exitSubGameTask.reset();
        }

        //全局 打开报表
        cc["openReportView"] = function (reportParams: reportParams) {
            self.reportViewOpenSignal.dispatch(reportParams);
        }

        //初始化大厅所有注册的类名
        SubGameUtils.initLobbyRegisteredClassNames();

        // this.downLoadingTasks = {};
        this.addEventListener();
    }

    dispose(): void {
        this.removeEventListener();
        super.dispose();
    }

    startLocalServer(): void {
        NativeNetworkUtils.startHttpServer(`${NativeFileUtils.getWritablePath()}subGames`, 10086);
    }

    requestSubGameList(): void {
        cc.log(`requestSubGameList`);
        let req: GameListReq = new GameListReq();
        this.network.sendDefault(CommandCodes.PPGameListReq, req);
    }

    saveSubGameInfo(): void {
        let infoList: SubGameEntity[] = this.subGameModel.subGames;
        let str: string = JSON.stringify(infoList.map(this.convert));
        NativeFileUtils.writeStringToFile(str, this.subGameInfoFilePath);
    }

    convert(entity: SubGameEntity): LocalSubGameEntity {
        return new LocalSubGameEntity(entity);
    }


    @riggerIOC.inject(RequestLaunchInfoTask)
    protected requestLaunchInfoTask: RequestLaunchInfoTask;
    requestLaunchInfo(subGameId: SubGameId): RequestLaunchInfoTask {
        if (this.requestLaunchInfoTask.isWaitting()) return this.requestLaunchInfoTask;
        this.requestLaunchInfoTask.reset();
        // 5秒超时
        this.requestLaunchInfoTask.timeout = 5000;
        this.requestLaunchInfoTask.start(subGameId);
        return this.requestLaunchInfoTask;
    }

    @riggerIOC.inject(LaunchSubGameTask)
    protected launchTask: LaunchSubGameTask;

    launchSubGame(subGameId: SubGameId): LaunchSubGameTask {
        if (this.launchTask.isWaitting()) return this.launchTask;
        this.launchTask.reset();
        // cc.log(`launch game in server`)
        this.launchTask.start(subGameId);
        return this.launchTask;
    }

    /**
     * 本地存储子游戏信息的路径
     * 如果不是原生环境，返回null
     */
    public get subGameInfoFilePath(): string {
        if (!cc.sys.isNative) return null;

        if (!this.mSubGameInfoFilePath) {
            this.mSubGameInfoFilePath = NativeFileUtils.getWritablePath() + "subGameInfo.json";
        }

        return this.mSubGameInfoFilePath;
    }
    private mSubGameInfoFilePath = null;

    // 加载本地存储的子游戏信息
    public loadLocalSubGameInfo(): SubGameEntity[] {
        let path: string = this.subGameInfoFilePath;
        if (!path) return;

        // 是否存在
        if (NativeFileUtils.isFileExist(path)) {
            let data = NativeFileUtils.getStringFromFile(path);
            return eval(data);
        }

        return [];
    }

    /**
     * 下载指定的子游戏，如果成功开始任务则返回一个LoadingTask
     * @param gameId 
     */
    public updateSubGame(gameId: SubGameId): SubGameEntity {
        let subGame: SubGameEntity = this.subGameModel.getSubGame(gameId);
        if (!subGame) return null;
        if (subGame.updateVersion()) {
            return subGame;
        }
        return null;
    }

    private onSubGameUpdate(): void {
        this.saveSubGameInfo();
    }

    /**
     * 收到服务器游戏列表的更新
     * @param resp 
     */
    private onGameListResp(resp: GameListResp): void {
        cc.log(`onGameListResp: ${resp}`);
        this.subGameModel.updateSubGames(resp.gameList);
    }

    addEventListener(): void {
        this.gameListRespSignal.on(this, this.onGameListResp);
        this.gameListPushSignal.on(this, this.onGameListResp);
        this.onSubGameListUpdateSignal.on(this, this.onSubGameUpdate);
        this.subGameExitSignal.on(this, this.onExitSubGame);
        this.subGameReadySignal.on(this, this.onReadySubGame);
    }

    removeEventListener(): void {
        this.gameListRespSignal.off(this, this.onGameListResp);
        this.gameListPushSignal.off(this, this.onGameListResp);
        this.onSubGameListUpdateSignal.off(this, this.onSubGameUpdate);
        this.subGameExitSignal.off(this, this.onExitSubGame);
        this.subGameReadySignal.off(this, this.onReadySubGame);
    }

    @riggerIOC.inject(PlayMusicSignal)
    private playMusicSignal: PlayMusicSignal

    @riggerIOC.inject(StopMusicSignal)
    private stopMusicSignal: StopMusicSignal;

    private onExitSubGame(subGameId: SubGameId): void {
        this.playMusicSignal.dispatch();
        this.subGameModel.exitingSubGameId = subGameId;
    }

    private onReadySubGame(): void {
        this.stopMusicSignal.dispatch();
    }

}
