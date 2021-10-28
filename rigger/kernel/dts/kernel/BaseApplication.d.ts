/**
* name
*/
declare module rigger {
    enum ServiceStatus {
        /**
         * 启动中
         */
        Starting = 1,
        /**
         * 运行中
         */
        Running = 2
    }
    class BaseApplication implements IApplication {
        constructor();
        /**
         * 应用的单例
         */
        static readonly instance: BaseApplication;
        protected static mInstance: BaseApplication;
        static replacedServiceMap: {};
        /**
         * 服务全名与其定义的映射
         */
        static serviceFullNameDefinitionMap: {};
        /**
         * 插件命名及其定义的映射
         */
        static pluginFullNameDefinitionMap: {};
        /**
         *
         * @param resultHandler
         * @param config 应用配置
         */
        start(resultHandler: RiggerHandler, startUpArgs?: any): void;
        /**
         * 停止应用
         */
        stop(): void;
        protected applicationConfig: config.ApplicationConfig;
        /**
         * 设置配置文件
         */
        setConfig(cfg: config.ApplicationConfig): void;
        /**
         * 获取配置文件
         */
        getConfig<T extends config.ApplicationConfig>(): T;
        /**
         *
         * @param serviceCls
         * @param cb
         */
        startService<T extends service.AbsService>(serviceCls: any, cb: RiggerHandler, config?: config.ServiceConfig, startUpArgs?: any): boolean;
        /**
         *
         * @param service
         * @param cb
         * @param config
         * @param startUpArgs?
         */
        startServiceWithConfig<T extends rigger.service.AbsService>(cls: any, ser: rigger.service.AbsService, cb: RiggerHandler, config: rigger.config.ServiceConfig, startUpArgs?: any): void;
        /**
         * 根据服务名获取服务
         * @param serviceName
         */
        getService<T extends rigger.service.AbsService>(serviceName: string): T;
        /**
         * 根据服务名获取运行中的服务
         * @param serviceName 服务名
         */
        getRunningService<T extends rigger.service.AbsService>(serviceName: string): T;
        /**
         * 所有的服务映射
         */
        private _serviceMap;
        /**
         *
         * @param serviceName
         * @param service
         */
        registerService(serviceName: string, service: rigger.service.IService): boolean;
        /**
         *
         * @param serviceName
         */
        unregisterService(serviceName: string): boolean;
        /**
         * 服务是否注册过
         * @param serviceName
         */
        isServiceRegistered(serviceName: string): boolean;
        /**
         * 服务是否在运行
         * @param serviceName
         */
        isServiceRunning(serviceName: string): boolean;
        /**
         * 所有服务就绪时的回调
         * @param resultHandler
         */
        onAllServicesReady(resultHandler: rigger.RiggerHandler): void;
        private newConfigServiceName;
        private makeServiceClass;
        private doMakeServiceClass;
        /**
         * 获取真正的服务名(可以将服务名转换成被替换后的服务名)
         * @param serviceName
         */
        private getRealServiceName;
        private onKernelServiceReady;
        /**
         * 启动核心服务
         */
        private startKernelService;
        /**
         * 启动非核心服务（用户自己配置的）
         * @param cb
         */
        private startNonKernelService;
        /**
         * 启动应用依赖的各项服务
         * @param index
         * @param appConfig
         */
        private startApplicationDependentService;
        /**
         * 启动服务
         * @param service
         * @param cb
         * @param {...any[]} startUpArgs
         */
        private doStartService;
        /**
         * 服务启动完成
         * @param service
         * @param cb
         * @param resutlCode
         */
        private onServiceStartComplete;
    }
}
