/**
* 服务插件的通用接口
*/
declare module rigger {
    interface IPlugin {
        /**
         * 开始插件（添加插件时调用)
         */
        start(resultHandler: RiggerHandler, startupArgs?: any): void;
        /**
         * 停止插件（卸载插件时调用)
         */
        stop(resultHandler: RiggerHandler): void;
        /**
         * 重启插件
         */
        reStart(resultHandler: RiggerHandler): void;
        /**
         * 设置插件所有者
         */
        setOwner(owner: any): any;
        /**
         * 获取插件模式（前置或后置）
         */
        getPluginMode(): PluginMode;
    }
}
