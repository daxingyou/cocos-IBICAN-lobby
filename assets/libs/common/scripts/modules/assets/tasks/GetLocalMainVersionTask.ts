import NativeFileUtils from "../../../../../native/NativeFileUtils";
import Task from "../../../utils/Task";
import AssetsServer from "../servers/AssetsServer";

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
 * 获取应用本地版本号的任务
 */
export default class GetLocalMainVersionTask extends Task<string> {
    // @riggerIOC.inject(AssetsServer)
    // private assetsServer: AssetsServer;

    start(versionFileUrl: string = "meta"): GetLocalMainVersionTask {
        return super.start(versionFileUrl) as GetLocalMainVersionTask;
    }

    onTaskStart(versionFileUrl: string) {
        // if (this.isWaitting()) return;
        // 先检查热更目录的
        let manifestUrl: string = `${AssetsServer.makeHotUpdateStoragePath()}/${versionFileUrl}.json`;
        if (NativeFileUtils.isFileExist(manifestUrl)) {
            let content: string = NativeFileUtils.getStringFromFile(manifestUrl);
            this.parseVersion(content);
        }
        else {
            cc.loader.loadRes(versionFileUrl, cc.Asset, this.onLoadProgress.bind(this), this.onLoadComplete.bind(this));
        }
    }

    onTaskCancel(): void {

    }

    protected onLoadComplete(error, assets: cc.JsonAsset) {
        if (!error) {
            // 分析版本
            let json = assets.json;
            this.setComplete(json.version);
        }
        else {
            this.setError(error);
        }
    }

    protected onLoadProgress(completedCount: number, totalCount: number, item: any): void {
        let p: number = completedCount / totalCount;
        if (isNaN(p)) p = 0;
        this.setProgress(p);
    }

    private parseVersion(content: string): void {
        if (content) {
            this.setComplete(JSON.parse(content).version);
        }
        else {
            this.setComplete(null);
        }
    }

}
