import { NativeDownloader } from "../../../native/NativeNetworkUtils";
import Task, { TaskId, TaskStatus } from "./Task";

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
export default class DownLoadingTask extends Task {
    // 下载器
    protected downLoader: NativeDownloader;

    // 任务的url
    public get url(): string {
        return this.mUrl;
    }
    public set url(u: string) {
        this.mUrl = u;
    }
    protected mUrl: string;

    public filePath: string;

    // protected mDestDir:string;

    constructor(taskId?: TaskId, url?: string, filePath?: string) {
        super(taskId);
        this.mUrl = url;
        this.filePath = filePath;

    }

    protected onTaskStart(): void {
        if (this.mUrl && this.filePath) {
            if (this.downLoader) {
                this.downLoader.setTask(this.mUrl, this.filePath);
            }
            else {
                this.downLoader = new NativeDownloader(this.mUrl, this.filePath);
                this.downLoader.onProgress(this, this.onLoaderProgress);
                this.downLoader.onComplete(this, this.onLoaderComplete);
            }

            this.downLoader.start();
        }
        else {
            throw new Error('url and path must be valid');
        }
    }

    onTaskCancel(reason): void {
        this.mStatus = TaskStatus.CANCELED;
        // TODO
        throw new Error(`not implemented, ${DownLoadingTask}`);

    }

    dispose(): void {
        this.downLoader && this.downLoader.dispose();
        this.downLoader = null;

        super.dispose();

    }

    private onLoaderProgress(task, bytesReceived, totalBytesReceived: number, totalBytesExpected): void {
        this.setProgress(totalBytesReceived / totalBytesExpected);
        // cc.log(`down load prog:${totalBytesReceived / totalBytesExpected}`)
    }

    private onLoaderComplete(): void {
        this.setComplete();
    }

}
