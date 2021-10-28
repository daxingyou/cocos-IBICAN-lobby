declare module ccPlugins {
    class CCWebsocketNetworkChannel implements rigger.service.INetworkChannel {
        private channelName;
        private channelType;
        private socket;
        private openListener;
        private errorListener;
        private closeListener;
        private messageListener;
        constructor(channelName: string | number);
        /**
         * 获取频道名称
         */
        getChannelName(): string | number;
        /**
         * 为频道建立连接
         * 如果当前频道处于非关闭状态（包括未初始化),则会发生错误
         * 连接开始前会注册各种事件(onopen,onerror,onclose)
         * @param ip ws://url 或 ws://url:port 或 wss://url等形式
         * @param port 端口，可以不填
         */
        connect(ip: string, port?: number): void;
        isEngaged(): boolean;
        /**
         * 通过频道发送数据
         * @param data
         * @throws new Error(`Socket is not ready to send, channel name:${this.channelName}`)
         */
        send(data: string | ArrayBufferLike | Blob | ArrayBufferView | rigger.utils.Byte): void;
        close(code?: number, reason?: string): void;
        onConnect(caller: any, method: Function, args: any[], once: boolean): void;
        offConnect(caller: any, method: Function): void;
        onError(caller: any, method: Function, args: any[], once: boolean): void;
        offError(caller: any, method: Function): void;
        onClose(caller: any, method: Function, args: any[], once: boolean): void;
        offClose(caller: any, method: Function): void;
        onMessage(caller: any, method: Function, args: any[], once: boolean): void;
        offMessage(caller: any, method: Function): void;
        private listenSocket;
        private disposeListeners;
    }
}
