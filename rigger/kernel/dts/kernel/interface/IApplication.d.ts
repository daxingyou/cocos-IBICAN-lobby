/**
* name
*/
declare module rigger {
    interface IApplication {
        /**
         * 启动应用
         * @param
         */
        start(resultHandler: RiggerHandler): void;
        /**
         * 停止应用
         */
        stop(): void;
        /**
         * 注册服务
         */
        registerService(serviceName: string, service: service.IService): boolean;
        /**
         * 反注册服务
         */
        unregisterService(serviceName: string): any;
        /**
         * 设置配置文件
         */
        setConfig(cfg: config.ApplicationConfig): void;
        /**
         * 获取配置文件
         */
        getConfig<T extends config.ApplicationConfig>(): T;
    }
}
