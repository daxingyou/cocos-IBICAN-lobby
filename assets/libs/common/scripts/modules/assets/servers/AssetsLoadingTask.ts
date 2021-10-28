import Task, { TaskId } from "../../../utils/Task";
import AssetsUtils from "../../../utils/AssetsUtils";

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
 * 资源加载任务
 */
export default class AssetsLoadingTask extends Task {
    /**
     * 加载函数
     */
    public set loadingFun(fun) {
        this.mLoadingFun = fun;
    }
    private mLoadingFun: Function;

    /**
     * 资源路径
     */
    public set res(res: string | number | {url:string, type: any} | (string | number | {url:string, type: any})[]) {
        this.mRes = res;
    }
    private mRes: string | number | {url:string, type: any} | ((string | number | {url:string, type: any})[]);

    constructor(taskId: TaskId, loadingFun?: Function, res?: string | number | {url:string, type: any} | ((string | number | {url:string, type: any})[])) {
        super(taskId);
        this.mLoadingFun = loadingFun;
        this.res = res;
    }

    protected onTaskStart(): void {
        if (!this.mLoadingFun) throw new Error(`loading fun must be valid`);
        if (!this.mRes) throw new Error(`res path must be valid`);

        let isReady: boolean = this.mLoadingFun(this.mRes,
            rigger.RiggerHandler.create(this, this.onLoadComplete, null, true),
            rigger.RiggerHandler.create(this, this.onLoadProgress, null, false));
        if (isReady) {
            this.setProgress(1);
            this.setComplete();
        }
    }

    protected onTaskCancel(): void {
        // throw new Error(`onTaskCancel not implemented:${AssetsLoadingTask}`);
    }

    private onLoadComplete(assets, error = null): void {
        if (assets) {
            // 检查资源是否设置过retain
            for( var i:number = 0; i < assets.length; ++i){
                let uuid:string = assets[i]["_uuid"];
                if(AssetsUtils.isRetained(uuid)){
                    let deps = cc.loader.getDependsRecursively(assets[i]);
                    AssetsUtils.retainAssetKey(deps);
                }
            }
            this.setComplete(assets);
        }
        else {
            cc.log(`loading assets arror, task:${this.taskId}, message:${error.message}, \r\nstack:${error.stack}`);
            this.setError(error);
        }
    }

    private onLoadProgress(p: number): void {
        this.setProgress(p);
    }

}
