/**
* name
*/
declare module rigger.service {
    class ConfigInfo {
        constructor();
        /**
         * 配置的当前状态
         */
        status: ConfigStaus;
        /**
         * 配置获取成功后需要回调的句柄列表
         */
        /**
         * 配置资源，如果加载成功，该字段会被初始化
         */
        data: config.ServiceConfig;
    }
    enum ConfigStaus {
        None = 1,
        Loading = 2,
        Ready = 3
    }
    abstract class ConfigService extends service.AbsService {
        constructor();
        /**
         * 启动服务
         * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         * @param {any} startupArgs 启动参数
         *
         * @example resultHandler.runWith([true]) 启动成功
         */
        start(resultHandler: RiggerHandler, serviceConfig: config.ServiceConfig, startupArgs?: any): void;
        /**
         * 服务名
         */
        static serviceName: string;
        /**
         * 服务启动时的回调
         * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         * @param {any[]} startupArgs 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         *
         * @example resultHandler.runWith([true]) 启动成功
         */
        protected onStart(resultHandler: RiggerHandler, startupArgs?: any): void;
        /**
         * 停止服务时的回调
         * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         * @example resultHandler.runWith([true]) 服务停用成功
         */
        protected onStop(resultHandler: RiggerHandler): void;
        /**
         * 启动服务时的回调
         * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务重启成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         * @example resultHandler.runWith([true]) 重启
         */
        protected onReStart(resultHandler: RiggerHandler): void;
        /**
         * 获取应用的配置
         * @param cb 获取到配置后，会以配置数据作为第一个附加参数回调句柄
         */
        getApplicationConfig(cb: RiggerHandler): any;
        private _serviceConfigMap;
        /**
         * 获取服务配置
         * @param serviceName
         */
        getServiceConfig(serviceName: string): config.ServiceConfig;
        /**
         * 服务配置加载完成
         * @param serviceName
         * @param data
         */
        /**
         * 加载配置
         * @param url 应用的配置的路径，此路径相对于bin目录
         * @param caller 加载完成后的回调域
         * @param method 加载完成后的回调方法
         * @param args 加载完成后的回调参数
         */
        protected abstract loadConfig(url: string, caller: any, method: Function, args?: any): void;
        protected onApplicationConfigInit(startCb: RiggerHandler): void;
        protected applicationConfig: config.ApplicationConfig;
        private applicationConfigHandlers;
        protected onApplicationConfigLoad(data: string | config.ApplicationConfig): void;
        private treateApplicationConfig;
        private initServiceConfigs;
        private getServiceConfigInfo;
        /**
         * 初始化应用的配置
         * @param resultHandler
         * @param serviceConfig
         * @param startupArgs
         */
        protected initApplicationConfig(resultHandler: RiggerHandler, serviceConfig: config.ServiceConfig, startupArgs?: any): void;
        /**
         * @plugin rigger.utils.DecoratorUtil.makeExtendable(true)
         * 生成应用的配置的路径
         *
        */
        protected makeApplicationConfigUrl(): string;
        private doStart;
    }
}
