import BaseLoadingPanel from "../views/BaseLoadingPanel";
import JPMediator from "../../../utils/JPMediator";
import Task from "../../../utils/Task";
// import UIManager from "../../../utils/UIManager";

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
 * 加载界面Mediator
 */
export default class BaseLoadingPanelMediator extends JPMediator {
    @riggerIOC.inject(BaseLoadingPanel)
    protected view: BaseLoadingPanel;

    // @riggerIOC.inject(AssetsServer)
    // protected assetsServer: AssetsServer;

    /**
     * 当前处理的加载任务ID
     */
    protected get loadingTask(): Task {
        return this.mTask;
    }
    protected set loadingTask(task: Task) {
        this.mTask = task;
        this.updateProgress();
    }
    private mTask: Task = null;

    /**
     * 当前进度
     */
    protected progress: number = 0;

    private inited: boolean = false;
    /**
     * 初始化
     */
    onInit(): void {
        cc.log("loading mediator init")
        this.view.setProgress(0);
        this.inited = true;

        // this.view.completeSignal.on(this, this.onViewComplete);
        // this.assetsServer.onProgress(this.mTask, this, this.onProgress);
        // this.assetsServer.onComplete(this.mTask, this, this.onComplete);

        this.updateProgress();
    }

    onShow(): void {
        cc.log(`base loading mediator on show`)
    }

    onHide(): void {

    }

    onDispose(): void {
        // this.view.completeSignal.off(this, this.onViewComplete);
        if(this.loadingTask){
            this.loadingTask.offProgreess(this, this.onProgress);
            this.loadingTask.offComplete(this, this.onComplete);

        }
        // this.assetsServer.offComplete(this.mTask, this, this.onComplete);
    }

    /**
         * 有新的加载任务
         */
    protected onTask(): void {
        this.loadingTask.onProgreess(this, this.onProgress);
        this.loadingTask.onComplete(this, this.onComplete);
    }


    /**
     * 关联view进度动画播放完成的回调
     */
    // protected onViewComplete(): void {
    //     if (!this.mTask) {
    //         cc.log(`complete all`);
    //     }
    // }

    protected onProgress(task: Task): void {
        // cc.log(`onProgress in mediator, prog:${task.progress}`)
        if (!this.inited) return;
        this.view.setProgress(task.progress);
    }

    protected onComplete(task: Task): void {
        if (!this.inited) return;
        // this.view.setProgress(1);
    }

    private updateProgress(): void {
        if (this.loadingTask) {
            this.view.setProgress(this.loadingTask.progress);
        }
    }

    onExtra(loadingTask: Task = null): void {
        if (this.loadingTask) {
            this.loadingTask.offProgreess(this, this.onProgress);
            this.loadingTask.offComplete(this, this.onComplete);
            this.loadingTask = null;

        }

        this.loadingTask = loadingTask;
        if (this.loadingTask) this.onTask();
    }

}
