import NativeFileUtils from "./NativeFileUtils";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class NativeNetworkUtils extends cc.Component {

    public static readonly HTTP_SERVER_FULL_NAME = "com/jp/utils/HttpServer";

    /**
     * 在本地开启一个HTTP服务器
     * @param root 根站点
     * @param port 端口
     * @returns {boolean} 成功返回true,否则返回false
     */
    public static startHttpServer(root: string, port: number): boolean {
        if (!cc.sys.isNative) return false;

        // TODO 需要判断平台
        switch (cc.sys.os) {
            case cc.sys.OS_ANDROID:
                jsb.reflection.callStaticMethod(NativeNetworkUtils.HTTP_SERVER_FULL_NAME, "startServer", "(Ljava/lang/String;I)V", root, port);
                return true;
            case cc.sys.OS_IOS:
                jsb.reflection.callStaticMethod('NativeUtils', 'startServerViaRoot:atPort:', root, port);
                return true;
            default:
                return false;
        }
    }
}

export interface NativeDownLoadTask {
    url: string;
}

export class NativeDownloader {
    private loader: any;
    private progressListener: rigger.utils.ListenerManager;
    private completeListener: rigger.utils.ListenerManager;
    private errorListener: rigger.utils.ListenerManager;

    private url: string;
    private destPath: string;

    public static readonly RECOVER_SIGN: string = "_RS_NATIVE_DOWN_LOADER";

    /**
     * 
     */
    public static create(): NativeDownloader {
        return rigger.service.PoolService.instance.getItemByClass(NativeDownloader.RECOVER_SIGN, NativeDownloader);
    }

    /**
     * 
     * @param downloader 
     */
    public static recover(downloader: NativeDownloader): void {
        downloader.dispose();
        rigger.service.PoolService.instance.recover(NativeDownloader.RECOVER_SIGN, downloader);
    }

    constructor(url?: string, destPath?: string) {
        cc.log(`url:${url}`)
        this.loader = new jsb.Downloader();
        // cc.log(" this.loader : " + this.loader);
        this.progressListener = new rigger.utils.ListenerManager();
        this.completeListener = new rigger.utils.ListenerManager();
        this.errorListener = new rigger.utils.ListenerManager();

        this.loader.setOnFileTaskSuccess(this.successHandler.bind(this));
        this.loader.setOnTaskProgress(this.progressHandler.bind(this));
        this.loader.setOnTaskError(this.errorHandler.bind(this));

        this.setTask(url, destPath);

    }

    dispose() {
        this.loader = null;
        this.completeListener && this.completeListener.dispose();
        this.progressListener && this.progressListener.dispose();
        this.errorListener && this.errorListener.dispose();

        this.completeListener = this.progressListener = this.errorListener = null;
    }

    /**
     * 开始一个设置好的任务
     */
    start(): void {
        if (!this.loader) return;
        if (rigger.utils.Utils.isNullOrEmpty(this.url)) throw new Error("must have a valid url to download");
        if (rigger.utils.Utils.isNullOrEmpty(this.destPath)) throw new Error("must have a valid dest path to download");

        this.loader.createDownloadFileTask(this.url, this.destPath);
    }

    /**
     * 设置任务参数
     * @param url 下载地址
     * @param filePath 下载后新的文件路径（包括文件名与括展名)
     */
    setTask(url: string, filePath: string): void {
        this.url = url;
        this.destPath = filePath;
    }

    onProgress(caller: any, callback: Function, args?: any[]): void {
        this.progressListener.on(caller, callback, args, false);
    }

    offProgress(caller: any, callback: Function): void {
        this.progressListener.off(caller, callback);
    }

    onComplete(caller: any, callback: Function, args?: any[]): void {
        this.completeListener.on(caller, callback, args, true);
    }

    offComplete(caller: any, callback: Function): void {
        this.completeListener.off(caller, callback);
    }

    private progressHandler(task: NativeDownLoadTask, bytesReceived: number, totalBytesReceived: number, totalBytesExpected: number): void {
        this.progressListener.execute(task, bytesReceived, totalBytesReceived, totalBytesExpected);
    }

    private successHandler(task: NativeDownLoadTask): void {
        this.completeListener.execute(task);
    }

    private errorHandler(task: NativeDownLoadTask, errorCode: number, errorCodeInternal: number, errorStr: string): void {
        this.errorListener.execute(task, errorCode, errorCodeInternal, errorStr);
    }
}
