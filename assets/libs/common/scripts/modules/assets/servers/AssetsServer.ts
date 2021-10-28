import Task from "../../../utils/Task";
import AssetsLoadingTask from "./AssetsLoadingTask";
import HotUpdateTask, { HotUpdateSpec, HotUpdateTaskType } from "../tasks/HotUpdateTask";
import NativeFileUtils from "../../../../../native/NativeFileUtils";
import GetLocalMainVersionTask from "../tasks/GetLocalMainVersionTask";
import UIManager from "../../../utils/UIManager";
import AssetsUtils from "../../../utils/AssetsUtils";
import AssetsModel from "../models/AssetsModel";
import MakeSureInstallMetaTask from "../tasks/MakeSureInstallMetaTask";
import Constants from "../../../Constants";

// import LoadingProgressSignal from "../signals/LoadingProgressSignal";
// import LoadingCompleteSignal from "../signals/LoadingCompleteSignal";
// import LoadingTask from "./LoadingTask";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
export default class AssetsServer extends riggerIOC.Server {
    @riggerIOC.inject(AssetsModel)
    protected assetsModel: AssetsModel;

    @riggerIOC.inject(Constants)
    protected constants: Constants;

    constructor() {
        super();
        AssetsUtils.applyRetain();
    }

    async dispose() {
        // UIManager.instance.dispose();
        super.dispose();
        await riggerIOC.waitForSeconds(0);
        let unUsed: string[] = AssetsUtils.getUnusedAssetKeys();
        cc.loader.release(unUsed);
    }

    preDispose(): void {
        UIManager.instance.dispose();
    }

    /**
     * 当前加载任务ID
     */
    private loadingTaskId: number = 0;

    /**
     * 从缓存中获取资源,如果没有则返回null
     * @param url 
     */
    public getCache<T extends cc.Asset>(url: string | { url: string, type: any }): T {
        return rigger.service.AssetsService.instance.getCache(url) as T;
    }

    /**
     * 分配资源
     * @param url 
     */
    public allocate<T>(url: string | string[]) {

    }

    /**
     * 释放资源
     * @param url 
     */
    public free(url: string | string[]): void {

    }

    /**
     * 通过资源地址进行加载，此资源地址位于resources目录
     * @param url 
     */
    public loadAssetsByUrl(url: string | { url: string, type: any }): AssetsLoadingTask {
        let uri: string;
        if (rigger.utils.Utils.isAssetsUrlObject(url)) {
            uri = url.url;
        }
        else {
            uri = url;

        }
        this.assetsModel.assetsMap[uri] = true;
        let inst = rigger.service.AssetsService.instance;
        return this.loadAssets(inst.load.bind(inst), [url]) as AssetsLoadingTask;
    }

    /**
     * 加载组资源
     * @param group 
     * @returns 加载任务的任务ID，此ID是索引加载任务的唯一标识，如果资源已经就绪，则返回null,表示不需要加载
     * 
     */
    public loadAssetsByGroup(group: string): Task {
        this.assetsModel.groupAssetsMap[group] = true;
        let manager = AssetsUtils.assetsPackageManager;
        return this.loadAssets(manager.loadPackageByGroup.bind(manager), group);
    }

    public clearAssetsByGroup(group: string): void {
        let manager = AssetsUtils.assetsPackageManager;
        manager.clearPackageByGroup(group);
    }

    /**
     * 加载包资源
     * @param pkg 
     * @returns 加载任务的任务ID，此ID是索引加载任务的唯一标识，如果资源已经就绪，则返回null,表示不需要加载
     * 
     */
    public loadAssetsByPackage(pkg: (string | number)): Task {
        this.assetsModel.packageAssetsMap[pkg] = true;
        let manager = AssetsUtils.assetsPackageManager;
        return this.loadAssets(manager.loadPackage.bind(manager), pkg);
    }

    public clearAssetsByPackage(pkg: (string | number)): void {
        AssetsUtils.assetsPackageManager.clearPackage(pkg);
    }

    @riggerIOC.inject(GetLocalMainVersionTask)
    protected getLocalMainVersionTask: GetLocalMainVersionTask;

    @riggerIOC.inject(MakeSureInstallMetaTask)
    protected makeSureInstallMetaTask: MakeSureInstallMetaTask;

    /**
     * 获取应用的本地版本号
     * @param versionUrl 
     */
    public getLocalMainVersion(versionUrl: string = "meta"): GetLocalMainVersionTask {
        if (!this.getLocalMainVersionTask) return null;
        if (this.getLocalMainVersionTask.isWaitting()) return this.getLocalMainVersionTask;
        this.getLocalMainVersionTask.prepare();
        return this.getLocalMainVersionTask.start(versionUrl);
    }

    @riggerIOC.inject(HotUpdateTask)
    protected hotUpdateTask: HotUpdateTask;

    /**
     * 确保安装元数据正确
     */
    public makeSureInstallMetaCorrect(): MakeSureInstallMetaTask {
        if (this.makeSureInstallMetaTask.isWaitting()) {
            return this.makeSureInstallMetaTask;
        }
        this.makeSureInstallMetaTask.reset();
        this.makeSureInstallMetaTask.start(AssetsServer.makeHotUpdateStoragePath());
        return this.makeSureInstallMetaTask;
    }

    /**
     * 生成热更描述
     * 
     * @param type 检查还是更新
     * @param needAddPath 是否需要将热更文件存储路径添加到搜索路径，默认为 true
     */
    public makeHotUpdateSpec(type: number, needAddPath: boolean = true): HotUpdateSpec {
        let spec: HotUpdateSpec = new HotUpdateSpec();
        spec.needAddPath = needAddPath;
        spec.type = type;
        let storagePath: string = spec.storagePath = AssetsServer.makeHotUpdateStoragePath();
        let fileName: string = type == HotUpdateTask.TASK_TYPE_CHECK ? "version" : "project";
        let manifestPath: string = `${storagePath}${fileName}.manifest`;
        if (NativeFileUtils.isFileExist(manifestPath)) {
            // 检查版本是否相符
            let content: string = NativeFileUtils.getStringFromFile(manifestPath);
            let obj = JSON.parse(content);
            let manifestVersion = obj.version;
            if (manifestVersion == this.assetsModel.version) {
                spec.manifestContent = content;
            }
            else {
                spec.baseUrl = HotUpdateSpec.BASE_URL_REMOTE;
                // 对应版本的远程资源描述文件地址
                spec.manifestUrl = `${this.constants.updatingServerUrl}${this.constants.situationId}/ver-${this.assetsModel.version}/${fileName}.manifest`;
                spec.manifestStoragePath = `${storagePath}${fileName}.manifest`;
            }
        }
        else {
            spec.baseUrl = HotUpdateSpec.BASE_URL_REMOTE;
            // 对应版本的远程资源描述文件地址
            spec.manifestUrl = `${this.constants.updatingServerUrl}${this.constants.situationId}/ver-${this.assetsModel.version}/${fileName}.manifest`;
            spec.manifestStoragePath = `${storagePath}${fileName}.manifest`;
        }

        return spec;
    }

    /**
     * 检查是否需要热更
     */
    public checkHotUpdate(): HotUpdateTask {
        if (this.hotUpdateTask && !this.hotUpdateTask.isWaitting()) {
            let spec = this.makeHotUpdateSpec(HotUpdateTask.TASK_TYPE_CHECK);
            this.hotUpdateTask.prepare();
            this.hotUpdateTask.start(spec);
        }

        return this.hotUpdateTask;
    }

    /**
     * 开始热更
     */
    public startHotUpdate(): HotUpdateTask {
        if (this.hotUpdateTask && !this.hotUpdateTask.isWaitting()) {
            let spec: HotUpdateSpec = this.makeHotUpdateSpec(HotUpdateTask.TASK_TYPE_UPDATE);
            this.hotUpdateTask.prepare();
            this.hotUpdateTask.start(spec);
        }

        return this.hotUpdateTask;
    }

    public static makeHotUpdateStoragePath(): string {
        return NativeFileUtils.getWritablePath() + "/hotUpdate/";
    }

    private loadAssets(loadingFun: Function, resName: string | number | { url: string, type: any } | ((string | number | { url: string, type: any })[])): Task {
        // 如果资源已经就绪返回NULL，否则创建加载任务，并返回其ID
        let tempTaskId = this.loadingTaskId + 1;
        // 创建新任务
        let task: Task = new AssetsLoadingTask(tempTaskId, loadingFun, resName);
        this.loadingTaskId = tempTaskId;

        return task.start();
    }
}
