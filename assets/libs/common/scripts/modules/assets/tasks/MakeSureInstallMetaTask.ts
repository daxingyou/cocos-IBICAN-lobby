import Task from "../../../utils/Task";
import NativeFileUtils from "../../../../../native/NativeFileUtils";
import Constants from "../../../Constants";

/**
 * 任务用于确保安装元数据的正确性
 * 安装元数据:游戏安装时自带的特征数据，目前主要用于确保覆盖安装
 * 目前确保覆盖安装的原理:
 * 1. 初始安装后第一次运行时，会把meta.json复制到指定目录
 * 2. 每次启动检查指定目录的meta.json文件内容是否和安装包自带的一致
 * 3. 如果不一致，则清空指定目录所有内容及meta.json，之后再重新初始化meta.json
 */
export default class MakeSureInstallMetaTask extends Task<boolean/**是否进行了清理 */, any> {
    static readonly INSTALL_META_NAME: string = "install_meta.json"
    static readonly META_NAME: string = "meta";

    @riggerIOC.inject(Constants)
    private constants: Constants;

    private dir = null;
    onTaskStart(dir: string) {
        if (!dir) return this.setError("dir can not be null");
        this.dir = dir;
        // 先要移除热更搜索目录
        let oldSearch: string[] = jsb.fileUtils.getSearchPaths();
        NativeFileUtils.removeSearchPath(this.dir);

        // 释放已经加载的,确保加载到安装包内原始的文件
        let filePath: string = `${this.constants.situationId}_${MakeSureInstallMetaTask.META_NAME}`;
        cc.loader.release(filePath);
        cc.loader.loadRes(filePath, cc.JsonAsset, this.onMetaLoad.bind(this));

        // 恢复搜索目录
        jsb.fileUtils.setSearchPaths(oldSearch);
    }

    onTaskCancel(): void {
    }

    private initInstallMeta(meta, hasCleared: boolean = false): void {
        if(!NativeFileUtils.isDirectoryExist(this.dir)){
            NativeFileUtils.createDirectory(this.dir);
        }

        let path = `${this.dir}/${MakeSureInstallMetaTask.INSTALL_META_NAME}`
        let ret = NativeFileUtils.writeStringToFile(JSON.stringify(meta), path);
        if(!ret){
            this.setError("failed to write to path:" + path);
            return;
        }
        this.setComplete(hasCleared);
    }

    private onMetaLoad(error, meta: cc.JsonAsset): void {
        if (!error) {
            let path = `${this.dir}/${MakeSureInstallMetaTask.INSTALL_META_NAME}`
            if (NativeFileUtils.isFileExist(path)) {
                this.verifyInstallMeta(path, meta.json);
            }
            else {
                this.initInstallMeta(meta.json);
            }
        }
        else {
            this.setError(error);
        }
    }

    private verifyInstallMeta(path: string, meta): void {
        let content: string = NativeFileUtils.getStringFromFile(path);
        let installMeta = JSON.parse(content);
        if (meta.version == installMeta.version) {
            this.setComplete(false);
        }
        else {
            // 不一致，需要清理
            this.clear();
            // 重新初始化
            this.initInstallMeta(meta, true);
        }
    }

    private clear(): void {
        NativeFileUtils.removeDirectory(this.dir);
    }
}