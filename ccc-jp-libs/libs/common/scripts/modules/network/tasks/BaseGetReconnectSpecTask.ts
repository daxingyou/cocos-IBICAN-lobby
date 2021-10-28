import Task from "../../../utils/Task";
import { ChannelName } from "../servers/NetworkServer";

/**
 * 基础重连描述信息
 */
export class BaseReconnectSpec {
    /**
     * 频道名,由框架自动填充
     */
    channelName: ChannelName;

    /**
     * 重连的间隔
     */
    interval: number = 5000;

    /**
     * 尝试重连的次数
     */
    times: number = 3;

    /**
     * 重连成功后的回调
     */
    successHandler?: riggerIOC.Handler;

    /**
     * 重连失败后的回调
     */
    failedHandler?: riggerIOC.Handler;

    /**
     * 重连的url, 一般不需要
     */
    url?: string;

    /**
     * 重连端口，一般不需要
     */
    port?: number;

    dispose(): void {
        this.successHandler && this.successHandler.recover();
        this.failedHandler && this.failedHandler.recover();

        this.successHandler = this.failedHandler = null;
    }
}

/**
 * 此任务用于获取用于重连服务器的描述信息(即如何进行重连)
 * 各项目可重写并绑定此任务
 * 此任务完成后，应该设置一个有效的 BaseReconnectSpec
 * 如果未设置有效的BaseReconnectSpec,则认为不进行重连
 */
export default abstract class BaseGetReconnectSpecTask extends Task<BaseReconnectSpec, any> {
    /**
     * 任务开始的回调,会传入将要重连的频道名称
     * @param channelName 
     */
    onTaskStart(channelName: ChannelName): void {

    }

    setComplete(spec: BaseReconnectSpec): void {
        super.setComplete(spec);
    }
}