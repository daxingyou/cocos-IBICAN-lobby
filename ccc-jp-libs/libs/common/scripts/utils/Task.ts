import TaskCompleteSignal from "../signals/TaskCompleteSignal";
import TaskProgressSignal from "../signals/TaskProgressSignal";
import TaskCancelSignal from "../signals/TaskCancelSignal";
import TaskErrorSignal from "../signals/TaskErrorSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
export type TaskId = number | string;
export enum TaskStatus {
    IDLE = 1,
    RUNNING = 2, // 
    COMPLETE = 3, //  成功完成
    CANCELED = 4,
    ERROR = 5, //出错
}
/**
 * 一个”任务“的抽象
 * 任务是指需要花费一定时间完成的操作，任务一旦建立，我们便可以监听其执行情况，同时也可以等待其完成
 * 我们可以实现自己的任务，只需要在子类中重写:
 * 1.onTaskStart 描述了任务应该如果开始
 * 2.onTaskCancel 描述了任务应该如果取消
 */
export default abstract class Task<ResultType = any, ErrorType = any> extends riggerIOC.SafeWaitable<ResultType, ErrorType> {
    public static readonly INFINITY: number = -1;

    public get taskId(): TaskId {
        return this.mTaskId;
    }
    protected mTaskId: TaskId;

    protected setTaskId(taskId: TaskId): void {
        this.mTaskId = taskId;
    }

    /**
     * 任务的超时时间
     */
    public get timeout(): number {
        return this.mTimeout;
    }
    public set timeout(t: number) {
        this.mTimeout = t;
    }
    protected mTimeout: number = Task.INFINITY;

    // 当次任务的超时时间
    protected tempTimeout: number;

    /**
     * 任务是否正在进行中
     */
    public isRunning(): boolean {
        return this.mStatus == TaskStatus.RUNNING;
    }

    /**
     * 任务状态
     */
    public get status(): TaskStatus {
        return this.mStatus;
    }
    protected mStatus: TaskStatus = TaskStatus.IDLE;

    /**
     * 当前进度
     */
    public get progress(): number {
        return this.mProgress;
    }
    private mProgress: number = 0;

    // public getReason() {
    //     return this.mReason.error;
    // }

    /**
     * 任务是否已经完成
     */
    public get isComplete(): boolean {
        return this.mProgress >= 1;
    }

    protected mProgressSignal: TaskProgressSignal;
    protected mCompleteSignal: TaskCompleteSignal;
    protected mCancelSignal: TaskCancelSignal;
    // protected mErrorSignal: TaskErrorSignal;

    constructor(taskId?: TaskId) {
        super();
        this.mTaskId = taskId;
        this.mProgressSignal = new TaskProgressSignal();
        this.mCompleteSignal = new TaskCompleteSignal();
        this.mCancelSignal = new TaskCancelSignal();
        // this.mErrorSignal = new TaskErrorSignal();
    }

    /**
     * 超时等待器
     */
    protected get workWait(): riggerIOC.WaitForTime {
        if (!this.mWorkWait) this.mWorkWait = new riggerIOC.WaitForTime();
        return this.mWorkWait;
    }
    protected mWorkWait: riggerIOC.WaitForTime;

    /**
     * 开始任务
     * 开始任务前请先调用 prepare/reset做好准备
     */
    start(args?: any): Task {
        if (this.mStatus == TaskStatus.RUNNING) {
            throw new Error("now a task is running, please wait or cancel it before running again");
        }

        if (this.isWaitting()) return this;
        this.mStatus = TaskStatus.RUNNING;
        this.tempTimeout = this.mTimeout;
        this.waitTimeout();
        this.wait(args);

        return this;
    }

    /**
     * 准备开始任务
     * 作用同reset
     */
    prepare() {
        this.reset();
    }

    /**
     * 使任务完成
     * @param result 
     */
    done(result: any){
        this.setComplete(result);
    }

    /**
     * 使任务取消
     * @param reason 
     */
    public cancel(reason): void {
        this.setCancel(reason);
    }

    /**
     * 使任务以出错的方式结束，同 setError
     * @param reason 
     */
    error(reason: any): void{
       this.setError(reason);     
    }

    //==========================
    //监听接口
    //==========================
    /**
     * 
     * @param caller 
     * @param callback 
     * @param args 
     */
    public onComplete(caller: any, callback, args: any[] = []): void {
        this.mCompleteSignal && this.mCompleteSignal.on(caller, callback, args);
    }

    public offComplete(caller: any, callback): void {
        this.mCompleteSignal && this.mCompleteSignal.off(caller, callback);
    }

    public onProgreess(caller: any, callback, args: any[] = []): void {
        this.mProgressSignal && this.mProgressSignal.on(caller, callback, args);
    }

    public offProgreess(caller: any, callback): void {
        this.mProgressSignal && this.mProgressSignal.off(caller, callback);
    }

    public onCancel(caller: any, callback, args: any[] = []): void {
        this.mCancelSignal && this.mCancelSignal.on(caller, callback, args);
    }

    public offCancel(caller: any, callback): void {
        this.mCancelSignal && this.mCancelSignal.off(caller, callback);
    }

    // public onError(caller: any, callback, args: any[] = []): void {
    //     this.mErrorSignal && this.mErrorSignal.on(caller, callback, args);
    // }

    // public offError(caller: any, callback): void {
    //     this.mErrorSignal && this.mErrorSignal.off(caller, callback);
    // }

    //==========================
    //监听接口
    //==========================


    /**
     * 析构函数
     */
    public dispose(): void {
        if (this.mCompleteSignal) {
            this.mCompleteSignal.dispose();
            this.mCompleteSignal = null;
        }

        if (this.mProgressSignal) {
            this.mProgressSignal.dispose();
            this.mProgressSignal = null;
        }

        if (this.mCancelSignal) {
            this.mCancelSignal.dispose();
            this.mCancelSignal = null;
        }

        // if (this.mErrorSignal) {
        //     this.mErrorSignal.dispose();
        //     this.mErrorSignal = null;
        // }

        this.mStatus = TaskStatus.IDLE;

        super.dispose();

    }

    /**
     * 开始任务的真正逻辑
     */
    protected abstract onTaskStart(args?: any): void;

    /**
     * 取消任务的逻辑
     * @param reason 
     */
    protected abstract onTaskCancel(reason: any): void;

    /**
     * 更新进度
     * 由子类调用
     * @param p 
     */
    protected setProgress(p: number): void {
        this.mProgress = p;
        this.mProgressSignal && this.mProgressSignal.dispatch(this);
    }

    /**
     * 更新完成状态
     * 由子类调用
     * 如果未传递任何参数，则以true值作为完成结果
     */
    protected setComplete(result: any = true): void {
        if (!this.isWaitting()) return;
        if(this.isDone() || this.isCanceled()) return;

        this.cancelTimeOut();
        this.mStatus = TaskStatus.COMPLETE;
        super.done(result);
        this.mCompleteSignal && this.mCompleteSignal.dispatch(this);
    }

    /**
     * 当任务被取消时调用此接口派发消息
     * @param reason 
     */
    private setCancel(reason: any = false, status = TaskStatus.CANCELED): void {
        if (!this.isWaitting()) return;
        if(this.isDone() || this.isCanceled()) return;

        this.onTaskCancel && this.onTaskCancel(reason);

        this.cancelTimeOut();
        this.mStatus = status;
        super.cancel(reason);
        this.mCancelSignal && this.mCancelSignal.dispatch([this, reason]);
    }

    /**
     * 当任务发生错误时，使用此接口进行通知
     * 任务发生错误后，最终会通过onCancel通知监听者
     * @param error 
     */
    protected setError(error?: any): void {
        this.setCancel(error, TaskStatus.ERROR);
    }

    protected startTask(...args): Task {
        super.startTask(...args);
        this.onTaskStart(...args)
        return this;
    }

    protected async waitTimeout() {
        // 进行超时处理
        if (this.workWait.isWaitting())
            throw new Error("now a work wait is running, please wait or cancel it before running again");
        if (this.tempTimeout >= 0) {
            this.mWorkWait.reset();
            let ret = await this.mWorkWait.forMSeconds(this.tempTimeout).wait();
            if(ret.isOk){
                this.cancel("timed out");
            }
        }
    }

    protected cancelTimeOut(): void {
        if (this.mWorkWait && this.mWorkWait.isWaitting()) {
            this.mWorkWait.cancel();
            this.mWorkWait.reset();
        }
    }

}
