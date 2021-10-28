/**
* name
*/
declare module ccPlugins {
    class CCLocalTimePlugin extends rigger.AbsServicePlugin {
        constructor();
        /**
         * 获取本地时间的接口扩展
         */
        getLocalTime(): number;
        /**
         * 插件开始时的回调
         * @param resultHandler
         * @param startupArgs
         */
        protected onStart(resultHandler: rigger.RiggerHandler, startupArgs: any[]): void;
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
    }
}
