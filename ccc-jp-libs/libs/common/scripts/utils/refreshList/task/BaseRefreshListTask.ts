import Task, { TaskStatus } from "../../Task";

/**
 * 协议收发任务，它监听了错误码协议
 */
export default class BaseRefreshListTask<T extends any> extends Task<T> {
    // @riggerIOC.inject(ErrRespSignal)
    // protected errSignal: ErrRespSignal;

    constructor() {
        super();
    }

    start() {
        return this;
    }

    onTaskStart(arg?: any){
        this.setComplete(arg);
    }
    onTaskCancel(){}

    wait(): any {
        if (this.isWaitting()) return this.waitingTask;
        if (this.mIsDone) return this.mResult;
        if (this.mIsCanceled) return this.mReason;


        this.waitingTask = riggerIOC.waitFor(this);

        return this.waitingTask;
    }


    refresh(args?: any): BaseRefreshListTask<T> {
        this.mStatus = TaskStatus.RUNNING;
        this.tempTimeout = this.mTimeout;
        this.waitTimeout();
        this.startTask(args);
        if (!this.waitingTask) {
            // 可能在开始任务时直接就完成了
            if (this.mIsDone) return this.mResult;
            if (this.mIsCanceled) return this.mReason;
        }

        return this;
    }

}
