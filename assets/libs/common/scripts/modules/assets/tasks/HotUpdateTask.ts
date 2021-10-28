import Task from "../../../utils/Task";
import NativeFileUtils from "../../../../../native/NativeFileUtils";
import RemoteAssetsLoadingTask from "../servers/RemoteAssetsLoadingTask";
import DownLoadingTask from "../../../utils/DownLoadingTask";

export enum HotUpdateTaskType {
    Check = 1,
    HotUpdate = 2
}

export class HotUpdateSpec {
    // resources目录下
    public static readonly BASE_URL_RESOURCES: string = "resources";
    // 远程资源
    public static readonly BASE_URL_REMOTE: string = "remote";

    constructor() {

    }

    // 任务类型
    type: HotUpdateTaskType = HotUpdateTaskType.HotUpdate;
    // 存储路径
    storagePath: string;
    // 任务完成后,是否需要将存储路径添加进搜索路径
    needAddPath: boolean = false;
    /**
     * 版本文件的基础路径,目前仅支持三个值：
     * 1. null: 将manifestUrl做为绝对路径加载
     * 2. "resources" manifestUrl是相对于resources目录的
     * 3. "remote": manifiestUrl是一个远程地址
     * 如果是"resources"则使用cc.loader.loadRes
     */
    baseUrl: string = null;

    // 版本文件的地址, 如果baseUrl为"resources"，则此路径也遵循resources的规则
    manifestUrl: string;

    /**
     * 资源版本文件的存储路径
     * 此字段只有在baseUrl为:remote时才有效果，此时会将远程下载的资源描述文件存储在此指定的路径中去
     * @example "/xx/yy/manifest.manifest"
     */
    manifestStoragePath?: string;

    // 版本文件内容，如果此字段不为空，则优先使用此字段的值
    manifestContent?: string;
}

/**
 * 热更新任务
 * 如果未给任务规定版本配置文件的路径，则使用resources下的project.manifest
 */
export default class HotUpdateTask extends Task {
    public static readonly TASK_TYPE_CHECK: number = 1;
    public static readonly TASK_TYPE_UPDATE: number = 2;

    protected get jsbAssetsManager(): jsb.AssetsManager {
        return this.mJsbAssetsManager;
    }
    protected mJsbAssetsManager: jsb.AssetsManager;

    protected taskSpec: HotUpdateSpec = null;

    public get totalFiles(): number {
        return this.mTotalFiles;
    }
    protected mTotalFiles: number = 0;

    public get totalBytes(): number {
        return this.mTotalBytes;
    }
    protected mTotalBytes: number = 0;

    public set versionCompareHandler(handler: (versionA: string, versionB: string) => number) {
        this.mVersionCompareHandler = handler;
    }

    protected mVersionCompareHandler: (versionA: string, versionB: string) => number = function (versionA: string, versionB: string): number {
        // cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        let vA: string[] = versionA.split('.');
        var vB: string[] = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            let a: number = parseInt(vA[i]);
            let b: number;
            if (vB[i]) {
                b = parseInt(vB[i])
            }
            else {
                b = 0;
            }

            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    }.bind(this);

    /**
     * 校验回调函数
     */
    public set verifyCallback(callback: (path: string, asset: { md5: string, size: number, path: string, compressed: boolean }) => boolean) {
        this.mVerifyCallback = callback;
        if (this.mJsbAssetsManager) this.mJsbAssetsManager.setVerifyCallback(callback);
    }
    public get verifyCallback(): (path: string, asset: { md5: string, size: number, path: string, compressed: boolean }) => boolean {
        return this.mVerifyCallback;
    }
    protected mVerifyCallback: (path: string, asset: { md5: string, size: number, path: string, compressed: boolean }) => boolean;

    // protected type: number = HotUpdateTask.TASK_TYPE_CHECK;

    /**
     * 开始一个热更新任务 
     * @param type 
     * @param manifestUrl 
     */
    public start(spec: HotUpdateSpec) {
        return super.start(spec)
    }

    protected onTaskStart(spec: HotUpdateSpec) {
        // if (this.isRunning()) throw new Error("A Hot Update Task is Processing");
        if (spec) this.taskSpec = spec;
        if (!this.mJsbAssetsManager) {
            if (!this.taskSpec || !this.taskSpec.storagePath) {
                throw new Error("storage path have to be specified");
            }

            if (!this.taskSpec.manifestUrl && !this.taskSpec.manifestContent) {
                throw new Error("manifest url or content have to be specified");
            }

            this.mJsbAssetsManager = new jsb.AssetsManager("", this.taskSpec.storagePath, this.mVersionCompareHandler);
            if (this.mVerifyCallback) this.mJsbAssetsManager.setVerifyCallback(this.mVerifyCallback);
        }

        if (this.taskSpec.manifestContent) {
            this.do(this.taskSpec.manifestContent);
        }
        else {
            switch (this.taskSpec.baseUrl) {
                case HotUpdateSpec.BASE_URL_RESOURCES:
                    // 加载资源描述文件
                    cc.loader.loadRes(this.taskSpec.manifestUrl, cc.Asset,
                        this.onManifestLoadingProgress.bind(this), this.onManifestLoad.bind(this));
                    break;
                case HotUpdateSpec.BASE_URL_REMOTE:
                    this.treatRemoteManifest();
                    break;
                default:
                    this.do(NativeFileUtils.getStringFromFile(this.taskSpec.manifestUrl));
                    break;
            }
        }
    }

    onTaskCancel() {
        // this.remoteManifestLoadingTask.cancel("hot update canceled");
    }

    dispose(): void {
        if (this.mJsbAssetsManager) {
            this.mJsbAssetsManager.setEventCallback(null);
            this.mJsbAssetsManager.setVerifyCallback(null);
            this.mJsbAssetsManager.setVersionCompareHandle(null);
            // this.mJsbAssetsManager.release();
            this.mJsbAssetsManager = null;
        }

        super.dispose();
    }

    reset(): HotUpdateTask {
        this.mTotalBytes = 0;
        this.mTotalFiles = 0;
        return super.reset() as HotUpdateTask;
    }

    protected checkUpdate() {
        this.mJsbAssetsManager.setEventCallback(this.checkCb.bind(this));
        this.mJsbAssetsManager.checkUpdate();
    }

    protected hotUpdate(): void {
        this.mJsbAssetsManager.setEventCallback(this.updateCb.bind(this));
        this.mJsbAssetsManager.update();
    }

    protected checkCb(event: jsb.EventAssetsManager) {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.setComplete(event.getEventCode());
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.mTotalBytes = event.getTotalBytes();
                this.mTotalFiles = event.getTotalFiles();
                break;
            default:
                this.setError([event.getEventCode(), event.getMessage()]);
                break;
        }
    }

    protected updateCb(event: jsb.EventAssetsManager) {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.setError([event.getEventCode(), event.getMessage()]);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                break;
            // 某个资源更新完成
            case jsb.EventAssetsManager.ASSET_UPDATED:
                break;
            // 表示更新进度
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.mTotalBytes = event.getTotalBytes();
                this.mTotalFiles = event.getTotalFiles();
                let p = event.getPercentByFile();
                if (isNaN(p)) {
                    p = 0;
                }
                this.setProgress(p);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.onUpdateComplete();
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.onUpdateComplete();
                break;
            default:
                this.setError([event.getEventCode(), event.getMessage()]);
                break;
        }
    }

    protected onManifestLoad(error: Error, asset: cc.Asset) {
        if (error) {
            this.setError([-1, error]);
        }
        else {
            this.do(asset["_$nativeAsset"]);
        }
    }

    protected onManifestLoadingProgress(completedCount: number, totalCount: number, item: any) {
        let p: number = completedCount / totalCount;
        this.setProgress(p);
    }

    protected onUpdateComplete() {
        this.mJsbAssetsManager.setEventCallback(null);
        // 设置搜索路径
        let sp: string[] = jsb.fileUtils.getSearchPaths();
        let newSp: string[] = this.mJsbAssetsManager.getLocalManifest().getSearchPaths();
        // 去掉重复路径
        for (let i: number = 0; i < newSp.length; ++i) {
            sp = rigger.utils.Utils.removeFromArray(sp, newSp[i]);
        }
        let finalSp: string[] = newSp.concat(sp);
        // 存储
        cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(finalSp));
        jsb.fileUtils.setSearchPaths(finalSp);

        this.setComplete(finalSp)
    }

    private do(manifestContent: string): void {
        // 准备处理
        let manifest: jsb.Manifest = new jsb.Manifest(manifestContent, this.taskSpec.storagePath);
        this.mJsbAssetsManager.loadLocalManifest(manifest, this.taskSpec.storagePath);

        if (!this.mJsbAssetsManager.getLocalManifest() || !this.mJsbAssetsManager.getLocalManifest().isLoaded()) {
            this.setError([-1, "Failed to load loacal manifest"]);
            return;
        }

        // 是更新还是检查更新？
        if (HotUpdateTask.TASK_TYPE_CHECK == this.taskSpec.type) {
            this.checkUpdate();
        }
        else {
            this.hotUpdate();
        }
    }

    @riggerIOC.inject(DownLoadingTask)
    private downLoadingTask: DownLoadingTask;

    private async treatRemoteManifest() {
        if(this.downLoadingTask.isWaitting()){
            this.downLoadingTask.cancel("");
        }
        this.downLoadingTask.reset();
        this.downLoadingTask.url = this.taskSpec.manifestUrl;
        this.downLoadingTask.filePath = this.taskSpec.manifestStoragePath;
        this.downLoadingTask.start();
        let ret = await this.downLoadingTask.wait();
        if (ret.isOk) {
            //
            let content = NativeFileUtils.getStringFromFile(this.taskSpec.manifestStoragePath);
            this.do(content);
        }
        else {
            this.setError(ret.reason);
        }
    }
}