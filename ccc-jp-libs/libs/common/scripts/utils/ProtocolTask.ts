import Task from "./Task";
import { ErrResp } from "../../../../scripts/protocol/protocols/protocols";
import { ErrRespSignal } from "../../../../scripts/protocol/signals/signals";
import NetworkServer from "../modules/network/servers/NetworkServer";

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
 * 协议收发任务，它监听了错误码协议
 */
export default class ProtocolTask<RespType = any> extends Task<RespType, ErrResp> {
    @riggerIOC.inject(ErrRespSignal)
    protected errSignal: ErrRespSignal;

    @riggerIOC.inject(NetworkServer)
    protected networkServer: NetworkServer;

    protected respSignal: riggerIOC.Signal<RespType>;

    constructor(cmd?: number, respSignalClass?: { new(): riggerIOC.Signal<RespType> }) {
        super(cmd);
        this.init(cmd, respSignalClass);
    }

    /**
     * 初始化
     * @param cmd 
     * @param respSignalClass 
     */
    init(cmd: number, respSignalClass: { new(): riggerIOC.Signal<RespType> } = null): void {
        this.mTaskId = cmd;
        if (this.respSignal) this.respSignal.off(this, this.onResp);
        
        if(respSignalClass){
            this.respSignal = riggerIOC.InjectionBinder.instance.bind(respSignalClass).getInstance();
        }
        else{
            this.respSignal = null;
        }

        this.respSignal && this.respSignal.on(this, this.onResp);
        
        this.errSignal.off(this, this.onErrorResp);
        this.errSignal.on(this, this.onErrorResp);
    }

    start(args?: any): ProtocolTask<RespType> {
        // 监听协议
        return super.start(args) as ProtocolTask<RespType>;
    }

    onTaskStart(req): void {
        this.networkServer.sendDefault(this.taskId, req);
        if (!this.respSignal) this.setComplete(null);
    }

    onTaskCancel(): void {
    }

    dispose(): void {
        this.removeListener();
        super.dispose();
    }

    /**
     * 收到错误码时
     * @param err 
     */
    protected onErrorResp(err: ErrResp): void {
        if (err.cmd !== this.taskId) return;
        if (this.isWaitting()) this.cancel(err);
    }

    protected onResp(respType: RespType): void {
        this.setComplete(respType);
    }

    private removeListener() {
        this.errSignal.off(this, this.onErrorResp);
        this.respSignal && this.respSignal.off(this, this.onResp);
    }
}
