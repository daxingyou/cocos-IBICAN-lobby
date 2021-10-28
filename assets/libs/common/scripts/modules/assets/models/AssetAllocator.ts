import AssetsServer from "../servers/AssetsServer";
import AssetsUtils from "../../../utils/AssetsUtils";
import Task from "../../../utils/Task";
import RemoteAssetsLoadingTask from "../servers/RemoteAssetsLoadingTask";

export type AssetAllocateResult<T, T1 = any> = (Promise<riggerIOC.Result<T, T1>> | riggerIOC.Result<T, T1>);
export enum AssetAllocatorType {
    Local = 1, // 用于分配包内资源
    Remote = 2, // 用于分配远程资源，如http://,https://
}

/**
 * 资源分配器
 */
export default class AssetAllocator<T extends cc.Asset = cc.Asset> extends riggerIOC.SafeWaitable<T> {
    public url: string;
    protected assetsLoadingTask: Task;

    @riggerIOC.inject(AssetsServer)
    protected assetsServer: AssetsServer;

    public type: AssetAllocatorType = AssetAllocatorType.Local;

    constructor(type = AssetAllocatorType.Local) {
        super();
        this.type = type;
    }

    /**
     * 分配资源，重复调用时（未进行reset)则直接返回已经分配的资源, 此时url可以为空
     * 如果资源已经预加载完成，则直接返回资源，如果未加载，则先加载，因此，此时将是一个异步操作
     * 如果申请的资源已经加载，可以使用 let ret = assetAllocator.alloc(url)的方式直接申请分配资源
     * 如果申请的资源尚未加载，则可以使用: let ret = await assetAllocator.alloc(url)
     * 如果，不确信资源是否已经加载，则可以假定其尚未加载
     * @param url 当第二次调用时，可以不传url，此时计数也不会增加
     */
    public alloc(url?: string): AssetAllocateResult<T> {
        if (this.mResult) {
            return this.mResult;
        }
        return this.wait(url);
    }

    /**
     * 获取分配的资源
     */
    public getAsset(): T {
        return this.getResult();
    }

    /**
     * 重置分配器，同时也会释放已经分配的资源
     */
    public reset(): AssetAllocator<T> {
        this.free();
        return super.reset() as AssetAllocator<T>;
    }

    /**
     * 释放资源
     */
    public free(): void {
        if (this.mResult && this.mResult.result) {
            this.updateRefConut(this.mResult.result, -1);
        }
        this.url = this.mResult = null;
        this.assetsLoadingTask && this.assetsLoadingTask.dispose();
        this.assetsLoadingTask = null;
    }

    // wait(url: string){
    //     return super.wait(url);
    // }

    /**
     * 析构,同时也会释放资源
     */
    dispose(): void {
        this.free();
        super.dispose();
    }

    protected startTask(url: string): AssetAllocator<T> {
        if (!url) throw (new Error("please specify a valid url of asset"));
        super.startTask();
        this.url = url;
        if (AssetAllocatorType.Local == this.type) {
            return this.allocateResource();
        }
        else {
            return this.allocateRemote();
        }
    }

    private allocateResource(): AssetAllocator<T> {
        let asset: T = this.assetsServer.getCache<T>(this.url);
        if (asset) {
            this.onAllocateSuccess(asset);
        }
        else {
            this.assetsLoadingTask = this.assetsServer.loadAssetsByUrl(this.url);
            this.waitLoading();
        }

        return this;
    }

    private allocateRemote() {
        let asset: T = cc.loader.getRes(this.url);
        if (asset) {
            this.onAllocateSuccess(asset);
        }
        else {
            this.assetsLoadingTask = new RemoteAssetsLoadingTask(this.url);
            this.assetsLoadingTask.start();
            this.waitLoading();
        }
        return this;
    }

    private async waitLoading() {
        let assetsLoadingTask = this.assetsLoadingTask;
        let ret: riggerIOC.Result = await assetsLoadingTask.wait();
        if(this.assetsLoadingTask !== assetsLoadingTask) return;
        if (ret.isOk) {
            this.onAllocateSuccess(this.assetsServer.getCache(this.url));
        }
        else {
            this.onAllocateFailed(ret.reason);
        }
    }

    private updateRefConut(asset: T, acc: number): void {
        let deps: string[];
        if (this.type == AssetAllocatorType.Local) {
            deps = cc.loader.getDependsRecursively(asset);
        }
        else {
            deps = cc.loader.getDependsRecursively(this.url);
        }
        AssetsUtils.updateRefCount(deps, acc);
    }

    private updateRefConutDebug(asset: T, acc: number): void {
        let deps: string[];
        if (this.type == AssetAllocatorType.Local) {
            deps = cc.loader.getDependsRecursively(asset);
        }
        else {
            deps = cc.loader.getDependsRecursively(this.url);
        }
        AssetsUtils.updateRefCount(deps, acc);
        AssetsUtils.updateRefDetails(this.url, deps, acc);
    }

    private onAllocateSuccess(asset: T): void {
        this.updateRefConut(asset, 1);
        this.done(asset);
    }

    private onAllocateFailed(reason): void {
        this.cancel(reason);
    }
}

if (CC_DEBUG) {
    AssetAllocator.prototype["updateRefConut"]
        = AssetAllocator.prototype["updateRefConutDebug"];
}