import Task from "../../../utils/Task";
import { BaseReconnectSpec } from "./BaseGetReconnectSpecTask";

/**
 * 重连任务，此任务主要由框架使用，一般不要尝试绑定或注入本任务类
 */
export default class ReconnectTask extends Task<boolean, any> {
    protected reconnectSpec: BaseReconnectSpec;

    /**
     * 计时器
     */
    protected get timer(): riggerIOC.WaitForTime {
        if (!this.mTimer) this.mTimer = new riggerIOC.WaitForTime();
        return this.mTimer;
    }
    private mTimer: riggerIOC.WaitForTime;

    constructor(spec: BaseReconnectSpec) {
        super();
        this.reconnectSpec = spec;
    }

    onTaskStart(): void {
        rigger.service.NetworkService.instance.onConnect(this.reconnectSpec.channelName,
            this, this.onConnect, [], true);
        rigger.service.NetworkService.instance.onError(this.reconnectSpec.channelName,
            this, this.onConnectError, [], true);

        this.doReconnect();
    }

    onTaskCancel(): void {
    }

    dispose():void{
        this.clearListener();
        super.dispose();
    }

    protected doReconnect(): void {
        if (this.reconnectSpec.times <= 0) {
            this.cancel(null);
            return;
        }

        --this.reconnectSpec.times;

        // 进行连接
        rigger.service.NetworkService.instance.connect(this.reconnectSpec.channelName,
            this.reconnectSpec.url, this.reconnectSpec.port);

        if (this.reconnectSpec.interval >= 0) {
            let service: rigger.service.TimeService
                = rigger.service.TimeService.getRunningService(rigger.service.TimeService.serviceName);
            service.loop(this.reconnectSpec.interval, this, this.onTimeout);
        }
    }

    protected onConnect(): void {
        // rigger.service.NetworkService.instance.offConnect(this.reconnectSpec.channelName,
        //     this, this.onConnect);
        // rigger.service.NetworkService.instance.offConnect(this.reconnectSpec.channelName,
        //     this, this.onConnect);
        this.setComplete(true);
    }

    protected onTimeout(): void {
        let service: rigger.service.TimeService = rigger.service.TimeService.getRunningService(rigger.service.TimeService.serviceName);
        service.clear(this, this.onTimeout);

        this.doReconnect();
    }

    protected onConnectError(): void {
        let service: rigger.service.TimeService = rigger.service.TimeService.getRunningService(rigger.service.TimeService.serviceName);
        service.clear(this, this.onTimeout);

        this.doReconnect();
    }

    protected clearListener(): void {
        rigger.service.NetworkService.instance.offConnect(this.reconnectSpec.channelName,
            this, this.onConnect);
        rigger.service.NetworkService.instance.offError(this.reconnectSpec.channelName,
            this, this.onConnectError);

        let service: rigger.service.TimeService = rigger.service.TimeService.getRunningService(rigger.service.TimeService.serviceName);
        service.clear(this, this.onTimeout);

    }
}