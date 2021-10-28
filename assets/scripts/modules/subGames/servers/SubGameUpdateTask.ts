import Task, { TaskId, TaskStatus } from "../../../../libs/common/scripts/utils/Task";
import DownLoadingTask from "../../../../libs/common/scripts/utils/DownLoadingTask";
import SubGameEntity, { SubGameId, LaunchType } from "../models/SubGameEntity";
import NativeFileUtils from "../../../../libs/native/NativeFileUtils";
import OnSubGameListUpdateSignal from "../signals/OnSubGameListUpdateSignal";
import SubGameUtils from "../utils/SubGameUtils";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import HotUpdateTask, { HotUpdateSpec } from "../../../../libs/common/scripts/modules/assets/tasks/HotUpdateTask";
import Constants from "../../../../libs/common/scripts/Constants";
import LobbyConstants from "../../../LobbyConstants";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

export default class SubGameUpdateTask extends Task {

    @riggerIOC.inject(OnSubGameListUpdateSignal)
    private updateSignal: OnSubGameListUpdateSignal;

    @riggerIOC.inject(PushTipsQueueSignal)
    pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(Constants)
    constants: LobbyConstants;

    /**
     * 下载任务
     */
    private downLoadingTask: DownLoadingTask;
    private hotUpdateTask: HotUpdateTask;

    private subGame: SubGameEntity;
    private progressingVersion: string

    constructor(subGame?: SubGameEntity) {
        super();
        //  10秒超时，超时是指没有任何响应
        this.timeout = 10000;
        this.setSubGame(subGame);
    }

    public setSubGame(subGame: SubGameEntity): void {
        if (!subGame) return;
        if (this.mStatus == TaskStatus.RUNNING) throw new Error(`a task is running`);
        this.subGame = subGame;
        this.setTaskId(subGame.gameId);
    }

    onTaskStart(): void {
        // if (TaskStatus.RUNNING == this.mStatus) throw new Error(`there has been a update task`);
        this.progressingVersion = this.subGame.latestVersion;
        if (this.subGame.launchType == LaunchType.WebView) {
            this.updateByWholePackage();
        }
        else {
            this.updateByDiffer();
        }

    }

    onTaskCancel(): void {
        this.removeDownLoadingTaskListener();
        this.removeHotUpdateTaskListener();

        this.downLoadingTask && this.downLoadingTask.cancel("cancel");
        this.hotUpdateTask && this.hotUpdateTask.cancel("cancel");
    }

    private updateByWholePackage(): void {
        if (this.downLoadingTask) {
            this.downLoadingTask.dispose();
            this.downLoadingTask = null;
        }

        let filePath: string = `${SubGameUtils.getSubGamesDir()}${SubGameUtils.makeSubGameZipName(this.subGame.gameId)}`;
        this.downLoadingTask = new DownLoadingTask(this.taskId, this.subGame.downloadUrl, filePath);

        this.addDownLoadingTaskListener();

        this.downLoadingTask.start();
    }

    private updateByDiffer(): void {
        if (this.hotUpdateTask && this.hotUpdateTask.isWaitting()) {
            return;
        }

        // if (!this.hotUpdateTask) this.hotUpdateTask = new HotUpdateTask();
        if (this.hotUpdateTask) {
            this.hotUpdateTask.dispose();
        }
        this.hotUpdateTask = new HotUpdateTask();
        // this.hotUpdateTask.prepare();
        this.addHotUpdateTaskListener();
        // 获取指定的版本文件
        let storagePath: string = `${SubGameUtils.getSubGamesDir()}${this.subGame.gameId}/`;
        let localManifestPath: string = `${storagePath}project.manifest`;
        let spec: HotUpdateSpec = new HotUpdateSpec();
        spec.needAddPath = false;
        spec.storagePath = storagePath;
        spec.type = HotUpdateTask.TASK_TYPE_UPDATE;

        if (NativeFileUtils.isFileExist(localManifestPath)) {

            spec.manifestUrl = localManifestPath;
        }
        else {
            let pkgUrl: string = `${this.constants.updatingServerUrl}${this.subGame.gameId}`;
            let defaultManifest = {
                packageUrl: pkgUrl,
                remoteManifestUrl: `${pkgUrl}/project.manifest`,
                remoteVersionUrl: `${pkgUrl}/http://localhost/tutorial-hot-update/remote-assets/version.manifest`,
                version: '0',
                assets: {},
                searchPaths: []
            };
            let str: string = JSON.stringify(defaultManifest);
            spec.manifestContent = str;
        }

        this.hotUpdateTask.start(spec);

    }

    private addHotUpdateTaskListener(): void {
        if (!this.hotUpdateTask) return;

        this.hotUpdateTask.onProgreess(this, this.onLoadingProgress);
        this.hotUpdateTask.onComplete(this, this.onLoadingComplete);
        this.hotUpdateTask.onCancel(this, this.onErrorHandle);
    }

    private removeHotUpdateTaskListener(): void {
        if (!this.hotUpdateTask) return;

        this.hotUpdateTask.offProgreess(this, this.onLoadingProgress);
        this.hotUpdateTask.offComplete(this, this.onLoadingComplete);
        this.hotUpdateTask.offCancel(this, this.onErrorHandle);
    }

    private addDownLoadingTaskListener(): void {
        if (!this.downLoadingTask) return;
        this.downLoadingTask.onProgreess(this, this.onLoadingProgress);
        this.downLoadingTask.onComplete(this, this.onLoadingComplete);
        this.downLoadingTask.onCancel(this, this.onErrorHandle);
    }

    private removeDownLoadingTaskListener(): void {
        if (!this.downLoadingTask) return;
        this.downLoadingTask.offProgreess(this, this.onLoadingProgress);
        this.downLoadingTask.offComplete(this, this.onLoadingComplete);
        this.downLoadingTask.offCancel(this, this.onErrorHandle);
    }

    private onLoadingProgress(task: DownLoadingTask): void {
        // cc.log(`update prog:${task.progress}`);
        this.setProgress(task.progress * 0.9);
        this.cancelTimeOut();
        this.waitTimeout();
    }

    private async onLoadingComplete() {
        this.removeHotUpdateTaskListener();
        this.removeDownLoadingTaskListener();

        if (this.subGame.launchType == LaunchType.WebView) {
            // 解压
            let path: string = SubGameUtils.makeSubGamePath(this.subGame.gameId);
            let zipPath: string = `${SubGameUtils.getSubGamesDir()}${SubGameUtils.makeSubGameZipName(this.subGame.gameId)}`;
            cc.log(`zip name:${zipPath}, zip dir:${path}`)
            NativeFileUtils.unZip(zipPath, path);
        }
        else {
            let pkgUrl: string = `${this.constants.updatingServerUrl}${this.subGame.gameId}`;
            let filePath: string = `${SubGameUtils.getSubGamesDir()}${this.subGame.gameId}/meta.json`;
            let downLoadingTask = new DownLoadingTask(null, `${pkgUrl}/meta.json`, filePath);
            downLoadingTask.start();
            await downLoadingTask.wait();
            // 更新META数据
            let meta = SubGameUtils.getSubGameMeta(this.subGame.gameId);
            if(meta){
                this.subGame.index = meta.index;
                this.subGame.settings = (meta.settings || meta.settingsFileName);
            }
        }

        // 更新游戏版本
        this.subGame.updateVersionComplete(this.progressingVersion);
        this.setProgress(1);
        this.setComplete();
        this.updateSignal.dispatch(false);
        this.pushTipsQueueSignal.dispatch(`${this.subGame.gameName}更新成功`);
    }

    private onErrorHandle([_, [errorCode, _msg]]): void {
        if (jsb.EventAssetsManager.ALREADY_UP_TO_DATE == errorCode) {
            this.onLoadingComplete();
            return;
        }

        this.removeHotUpdateTaskListener();
        this.removeDownLoadingTaskListener();

        this.pushTipsQueueSignal.dispatch(`${this.subGame.gameName}更新失败`);
        this.setCancel("");
    }
}