import BaseConnectionSpec from "./BaseConnectionSpec";
import Constants from "../../../Constants";
import DecoratorUtil from "../../../utils/DecoratorUtil";
import SituationServer from "../../situation/servers/SituationServer";
import CommandCodes from "../../../../../../scripts/protocol/CommandCodes";
import { BeatHeartRespSignal } from "../../../../../../scripts/protocol/signals/signals";
import BaseGetReconnectSpecTask, { BaseReconnectSpec } from "../tasks/BaseGetReconnectSpecTask";
import ReconnectTask from "../tasks/ReconnectTask";
import SituationModel from "../../situation/models/SituationModel";
// import HeartBeatProtocolPlugin from "../../../../../riggerPlugins/HeartBeatProtocolPlugin";
// import CommandCodes from "../../../../../../scripts/protocol/CommandCodes";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
enum ChannelStatus {
    // 
    None = 1,
    // 正在连接
    Connecting = 2,
    // 已经连接
    Connected = 3,
    // 准备重连（如，正在获取重连规范)
    PrepareReconnecting = 4,
    // 正在重连
    Reconnecting = 5,
    // 已经关闭
    Closed = 6,
}
export type ChannelName = string;
export default class NetworkServer extends riggerIOC.Server {

    @riggerIOC.inject(SituationServer)
    protected situationServer: SituationServer;

    @riggerIOC.inject(Constants)
    protected constants: Constants;

    @riggerIOC.inject(BeatHeartRespSignal)
    protected heartBeatSig: BeatHeartRespSignal;

    /**
     * 获取重连规范的任务
     */
    @riggerIOC.inject(BaseGetReconnectSpecTask)
    protected getReconnectSpecTask: BaseGetReconnectSpecTask;

    /**
     * 重连规范，当需要连接服务器时，如果此值不为空，则使用此规范进行重连，否则进行普通连接
     */
    protected reconnectSpec: BaseReconnectSpec = null;

    constructor() {
        super();

        DecoratorUtil.bindSignals();

        this.registerCommands(this.constants.defaultChannelName, CommandCodes);
        this.registerHeartBeatSignal(this.constants.defaultChannelName, this.heartBeatSig);
        this.registerSender(this.constants.defaultChannelName);
        ProtocolCmdAssemblerPlugin.registerCommandTransfer(this.constants.defaultChannelName, DecoratorUtil.getProtocolResponseClassName);
        NetworkServiceSignalRoutingPlugin.registerCommandSignalTransfer(this.constants.defaultChannelName, DecoratorUtil.getProtocolResponseSignal);
    }

    protected channelStatus: {} = {};
    protected waitingQueues: {} = {};
    dispose(): void {
        // 关闭所有网络
        // cc.log(`now dispose network server`)
        // this.closeDefault();
        this.disposeDefaultChannel();


        this.waitingQueues = {};
        this.channelStatus = {};

        this.unRegisterCommands(this.constants.defaultChannelName);
        this.unRegisterHeartBeatSignal(this.constants.defaultChannelName);
        this.unRegisterSender(this.constants.defaultChannelName);
        ProtocolCmdAssemblerPlugin.unRegisterCommandTransfer(this.constants.defaultChannelName);
        NetworkServiceSignalRoutingPlugin.unRegisterCommandSignalTransfer(this.constants.defaultChannelName);

        /**
         * 解绑所有协议信号
         */
        DecoratorUtil.unbindSignals();
        super.dispose();
    }

    /**
     * 获取频道状态
     * @param channelName 
     */
    public getChannelStatus(channelName: ChannelName): ChannelStatus {
        if (!this.channelStatus) return ChannelStatus.None;
        if (!this.channelStatus[channelName]) return ChannelStatus.None;
        return this.channelStatus[channelName];
    }


    /**
     * 将消息发送到默认频道
     * @param datas 
     */
    public sendDefault(...datas) {
        this.send(this.constants.defaultChannelName, ...datas);
    }



    /**
     * 将消息发送到指定频道 
     * @param channelName 
     * @param datas 
     */
    public send(channelName: ChannelName, ...datas): void {
        // cc.log(`send:${datas[0]}`);
        let status: ChannelStatus = this.getChannelStatus(channelName);
        if (status !== ChannelStatus.Connected) {
            // 加入等待队列
            this.pushInQueue(channelName, datas);
            // 如果当前没有进行连接或重连,也未准备重连，则进行连接或重连
            if (status !== ChannelStatus.Connecting
                && status !== ChannelStatus.Reconnecting 
                && status !== ChannelStatus.PrepareReconnecting) {
                // 如果有记录重连规范，则进行重连，重连后将规范置空
                if (this.reconnectSpec) {
                    this.reconnect(channelName, this.reconnectSpec);
                    this.reconnectSpec = null;
                }
                else {
                    // 如果没有记录重连规范，则进行普通连接
                    this.connect(channelName);
                }
            }
        }
        else {
            // cc.log(`sendSuccess:${datas[0]}, ${datas[1]}`);
            rigger.service.NetworkService.instance.send(channelName, ...datas);
        }
    }

    public async makeSureChannelAvailable(channelName: ChannelName, ifInteractive: boolean = false) {
        if ((!this.channelStatus) || this.channelStatus[channelName] !== ChannelStatus.Connected) {
            if (ifInteractive) {
                // 通过交互方式询问是否连接
                let ret: riggerIOC.Result<BaseReconnectSpec> = await this.getReconnectSpecTask.wait();
                if (ret.isOk && ret.result) {
                    this.reconnect(channelName, ret.result);
                }
            }
            else {
                let defaultSpec: BaseReconnectSpec = new BaseReconnectSpec();
                this.reconnect(channelName, defaultSpec);
            }
        }
    }

    /**
     * 连接指定频道
     * @param channelName 
     */
    public async connect(channelName: ChannelName) {
        // 更改状态
        this.setChannelStatus(channelName, ChannelStatus.Connecting);

        // 从环境中或用户获取连接信息
        let spec: BaseConnectionSpec = await this.getChannelConnectionSpec(channelName);
        // 确保频道初始化
        rigger.service.NetworkService.instance.makeSureChanelInit([this.makeChnnelConfig(channelName)])

        rigger.service.NetworkService.instance.offConnect(channelName, this, this.onConnect);
        rigger.service.NetworkService.instance.offClose(channelName, this, this.onClose);
        rigger.service.NetworkService.instance.offError(channelName, this, this.onError);

        rigger.service.NetworkService.instance.onConnect(channelName, this, this.onConnect, [channelName], true);
        rigger.service.NetworkService.instance.onClose(channelName, this, this.onClose, [channelName], true);
        rigger.service.NetworkService.instance.onError(channelName, this, this.onError, [channelName], true);

        // 进行连接
        rigger.service.NetworkService.instance.connect(channelName, spec.url, spec.port);
    }

    /**
     * 重连
     * @param channelName 
     * @param reSpec 
     */
    public async reconnect(channelName: ChannelName, reSpec: BaseReconnectSpec) {
        if (reSpec.times <= 0) return;
        // 更新频道状态 
        this.setChannelStatus(channelName, ChannelStatus.Reconnecting);
        // 移除各种事件
        rigger.service.NetworkService.instance.offConnect(channelName, this, this.onConnect);
        rigger.service.NetworkService.instance.offClose(channelName, this, this.onClose);
        rigger.service.NetworkService.instance.offError(channelName, this, this.onError);

        rigger.service.NetworkService.instance.onClose(channelName, this, this.onClose, [channelName], true);
        rigger.service.NetworkService.instance.onError(channelName, this, this.onError, [channelName], true);

        if (!reSpec.url) {
            // 从环境中或用户获取连接信息
            let spec: BaseConnectionSpec = await this.getChannelConnectionSpec(channelName);
            reSpec.url = spec.url;
            reSpec.port = spec.port;
        }

        let task: ReconnectTask = new ReconnectTask(reSpec);
        let ret = await task.wait();
        task.dispose();
        task = null;
        if (ret.isOk) {
            // 重连成功
            this.onConnectSuccess(channelName);
            if (reSpec && reSpec.successHandler) {
                reSpec.successHandler.runWith([channelName]);
            }
            this.flush(channelName);
        }
        else {
            this.setChannelStatus(channelName, ChannelStatus.Closed);
            // 重连失败
            if (reSpec && reSpec.failedHandler) {
                reSpec.failedHandler.runWith([channelName]);
            }
        }
        reSpec.dispose();
    }

    /**
     * 关闭默认频道
     * @param code 
     */
    public closeDefault(code: number = 1000) {
        let channelName: string = this.constants.defaultChannelName;
        this.close(channelName, code);

    }

    public disposeDefaultChannel() {
        // this.closeDefault();
        this.closeDefault()
        let channelName: string = this.constants.defaultChannelName;
        rigger.service.NetworkService.instance.destroyChannel(channelName);
    }

    public close(channelName: ChannelName, code: number = 1000) {
        // cc.log(`close chanel:${channelName}`);

        rigger.service.HeartBeatService.instance.stopHeartBeat(channelName);
        rigger.service.NetworkService.instance.offClose(channelName, this, this.onClose);
        rigger.service.NetworkService.instance.close(channelName, code);

        if (this.channelStatus) {
            delete this.channelStatus[channelName];
        }
    }

    public closeAll(code: number = 1000) {
        for (var k in this.channelStatus) {
            this.close(k, code);
        }
    }

    @riggerIOC.inject(SituationModel)
    protected situationModel: SituationModel;

    protected handleReconnectSpec(spec: BaseReconnectSpec) {
        // 默认先奖频道状态设置为None
        this.setChannelStatus(spec.channelName, ChannelStatus.None);

        // 非原生版本且不是在大厅中，直接重新加载
        if ((!cc.sys.isNative) && (!this.situationModel.isInLobby)) {
            window.location.reload();
            return;
        }

        // 大厅环境下，默认退出
        if (spec && this.situationModel.isInLobby) {
            if (this.situationModel.isInLobby && cc["returnToLobby"]) {
                cc["returnToLobby"]();
            }
            return;
        }
    }

    /**
     * 设置频道状态 
     * @param channelName 
     * @param status 
     */
    protected setChannelStatus(channelName: ChannelName, status: ChannelStatus): void {
        if(ChannelStatus.None == status){
            if(!this.channelStatus) return;
            if(!this.channelStatus[channelName]) return;
        }

        if(!this.channelStatus) this.channelStatus = {};
        this.channelStatus[channelName] = status;
    }

    /**
     * 将暂时无法发送的消息放入队列
     * @param channelName 
     * @param data 
     */
    private pushInQueue(channelName: ChannelName, data: any[]) {
        if (!this.waitingQueues) this.waitingQueues = {};
        let old: any[] = this.waitingQueues[channelName];
        if (!old) {
            old = this.waitingQueues[channelName] = [];
        }
        old.push(data);
    }

    private onConnect(channelName: ChannelName): void {
        this.onConnectSuccess(channelName);
        // 发送队列中的数据
        this.flush(channelName);
    }

    /**
     * 连接成功后需要做的事情
     * @param channelName 
     */
    private onConnectSuccess(channelName: ChannelName): void {
        rigger.service.NetworkService.instance.offConnect(channelName, this, this.onConnect);
        // 更改状态
        this.setChannelStatus(channelName, ChannelStatus.Connected);
        // 心跳
        rigger.service.HeartBeatService.instance.startHeartBeat(channelName);
    }

    private async onClose(channelName: ChannelName) {
        // 先将频道状态设置为重连准备中
        this.setChannelStatus(channelName, ChannelStatus.PrepareReconnecting);
        rigger.service.HeartBeatService.instance.stopHeartBeat(channelName);
        // 获取重连规范
        if (!this.getReconnectSpecTask.isWaitting()) {
            this.getReconnectSpecTask.reset();
        }

        let ret: riggerIOC.Result<BaseReconnectSpec> = await this.getReconnectSpecTask.wait();
        if (ret.isOk) {
            let spec = ret.result;
            spec.channelName = channelName;
            this.handleReconnectSpec(spec);
        }
        else {
            // 不进行重连
            cc.log(`network has been broken, but will not reconnect`);
            // 频道状态设置为closed
            this.setChannelStatus(channelName, ChannelStatus.Closed);
        }

    }

    private onError(channelName: ChannelName): void {
        if (this.channelStatus) {
            delete this.channelStatus[channelName];
        }
    }

    private flush(channelName: ChannelName): void {
        if (!this.waitingQueues) return;
        let waiting: any[][] = this.waitingQueues[channelName];
        delete this.waitingQueues[channelName];
        if (!waiting) return;

        for (var i: number = 0; i < waiting.length; ++i) {
            this.send(channelName, ...waiting[i]);
        }

        this.flush(channelName);
    }

    private getChannelConnectionSpec(channelName: string | number): Promise<BaseConnectionSpec> {
        return this.situationServer.getConnectionSpec(channelName);
    }

    private registerCommands(channelName: string | number, commands) {
        if (!rigger.service.HeartBeatService["$commandCodes"]) {
            rigger.service.HeartBeatService["$commandCodes"] = {};
        }
        rigger.service.HeartBeatService["$commandCodes"][channelName] = commands;
    }

    private unRegisterCommands(channelName) {
        rigger.service.HeartBeatService["$commandCodes"][channelName] = undefined;
    }

    private registerHeartBeatSignal(channelName: string | number, sig: riggerIOC.Signal<any>) {
        if (!rigger.service.HeartBeatService["$respSignal"]) {
            rigger.service.HeartBeatService["$respSignal"] = {};
        }
        rigger.service.HeartBeatService["$respSignal"][channelName] = sig;
    }

    private unRegisterHeartBeatSignal(channelName: string | number) {
        // let signal: riggerIOC.Signal<any> = rigger.service.HeartBeatService["$respSignal"][channelName];
        // if(signal){
        //     signal.
        // }
        rigger.service.HeartBeatService["$respSignal"][channelName] = undefined;

    }

    private registerSender(channelName: string | number) {
        if (!rigger.service.HeartBeatService["$netsender"]) {
            rigger.service.HeartBeatService["$netsender"] = {};
        }
        rigger.service.HeartBeatService["$netsender"][channelName] = this;
    }

    private unRegisterSender(channelName: string | number) {
        rigger.service.HeartBeatService["$netsender"][channelName] = undefined

    }

    /**
     * 生成指定频道的频道配置
     * @param channelName 
     */
    private makeChnnelConfig(channelName: string): rigger.service.NetworkChannelSpec {
        let cfg: any = rigger.service.NetworkService.instance.getConfig();
        let channels: rigger.service.NetworkChannelSpec[] = cfg.channels;
        if (channels && channels.length > 0) {
            let idx: number = channels.findIndex((v, idx, arr) => v.channelName == channelName);
            if (idx >= 0) {
                return channels[idx];
            }
        }

        return { channelName: channelName, channelType: 3 };
    }

}
