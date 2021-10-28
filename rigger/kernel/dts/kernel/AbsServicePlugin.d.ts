/**
* 服务插件的抽象基类
* 服务插件默认为后置插件
*/
declare module rigger {
    abstract class AbsServicePlugin implements IPlugin {
        constructor();
        /**
         * 插件名（全名，只有当具有此字段时才能进行注册)
         */
        static pluginName?: string;
        /**
         * 开始插件（添加插件时调用)
         */
        start(resultHandler: RiggerHandler, startupArgs: any): void;
        /**
         * 停止插件（卸载插件时调用)
         */
        stop(resultHandler: RiggerHandler): void;
        reStart(resultHandler: RiggerHandler): void;
        protected owner: rigger.service.IService;
        /**
         * 设置插件所有者
         */
        setOwner(owner: rigger.service.IService): void;
        /**
         * 获取插件所有者
         */
        getOwner<T extends service.IService>(): T;
        /**
         * 获取插件模式（前置或后置）
         */
        getPluginMode(): PluginMode;
        /**
         * 插件模式
         */
        protected pluginMode: PluginMode;
        /**
         * 插件开始时的回调
         * @param resultHandler
         * @param startupArgs
         */
        protected abstract onStart(resultHandler: RiggerHandler, startupArgs: any[]): void;
        /**
         * 插件停止时的回调
         * @param resultHandler
         */
        protected abstract onStop(resultHandler: RiggerHandler): void;
        /**
         * 插件重启时的回调
         * @param resultHandler
         */
        protected abstract onRestart(resultHandler: RiggerHandler): void;
    }
}
