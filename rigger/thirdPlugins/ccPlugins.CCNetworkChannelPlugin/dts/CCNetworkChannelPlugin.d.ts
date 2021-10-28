declare module ccPlugins {
    class CCNetworkChannelPlugin extends rigger.AbsServicePlugin {
        constructor();
        /**
         * 插件开始时的回调
         * @param resultHandler
         * @param startupArgs
         */
        protected onStart(resultHandler: rigger.RiggerHandler, startupArgs: any): void;
        /**
         * 插件停止时的回调
         * @param resultHandler
         */
        protected onStop(resultHandler: rigger.RiggerHandler): void;
        /**
         * 插件重启时的回调
         * @param resultHandler
         */
        protected onRestart(resultHandler: rigger.RiggerHandler): void;
        /**
         * @extends rigger.utils.DecoratorUtil.makeExtendable()
         * @param {NetworkChannelSpec[]} channelInfo 将要创建的频道的描述符
         * @returns {INetworkChannel[]}
         */
        protected createChannels(channelInfo: rigger.service.NetworkChannelSpec[]): rigger.service.INetworkChannel[];
    }
}
