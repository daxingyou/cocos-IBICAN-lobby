/**
* name
*/
declare module rigger.service {
    abstract class AbsService implements IService, IExtendAble {
        constructor();
        /**
         * 服务名
         */
        static serviceName: string;
        /**
         * 获取应用
         */
        getApplication<T extends BaseApplication>(): T;
        protected application: BaseApplication;
        /**
         * 设置应用
         * @param app
         */
        setApplication(app: BaseApplication): void;
        protected static application: BaseApplication;
        static setApplication(app: BaseApplication): void;
        /**
         * 获取正在运行的服务
         * @param serviceName
         */
        static getRunningService<T extends AbsService>(serviceName: string): T;
        /**
         * 启动服务
         * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         * @param {any[]} startupArgs 启动参数
         *
         * @example resultHandler.runWith([true]) 启动成功
         */
        start(resultHandler: RiggerHandler, serviceConfig: config.ServiceConfig, startupArgs?: any): void;
        /**
         * 停止服务
         * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         * @example resultHandler.runWith([true]) 服务停用成功
         */
        stop(resultHandler: RiggerHandler): void;
        /**
         * 启动服务
         * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务重启成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         * @example resultHandler.runWith([true]) 重启
         */
        reStart(resultHandler: RiggerHandler): void;
        protected messageListenerMap: {};
        /**
         * 订阅消息
         * @param msg
         * @param caller
         * @param method
         * @param args
         */
        onMessage(msg: string | number, caller: any, method: Function, ...args: any[]): void;
        /**
         * 取消消息的订阅
         * @param msg
         * @param caller
         * @param method
         */
        offMessage(msg: string | number, caller: any, method: Function): void;
        /**
         * 关闭指定消息中所有指定句柄的订阅
         * @param msg
         * @param caller
         * @param method
         */
        offAllMessages(msg: string | number, caller: any, method: Function): void;
        /**
         * 清除所有的消息订阅
         */
        clearMessages(): void;
        /**
         * 派发消息
         * @param msg
         * @param args
         */
        dispatchMessage(msg: number | string, ...args: any[]): void;
        /**
         * 服务被唤醒时的回调
         * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         * @param {any} startupArgs 启动参数
         *
         * @example resultHandler.runWith([true]) 启动成功
         */
        protected abstract onStart(resultHandler: RiggerHandler, startupArgs: any): void;
        /**
         * 停止服务时的回调
         * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         * @example resultHandler.runWith([true]) 服务停用成功
         */
        protected abstract onStop(resultHandler: RiggerHandler): void;
        /**
         * 启动服务时的回调
         * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务重启成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         * @example resultHandler.runWith([true]) 重启
         */
        protected abstract onReStart(resultHandler: RiggerHandler): void;
        private extendedMethodMap;
        /**
         *
         * @param methodName
         */
        extendMethod(methodName: string): void;
        /**
         *
         * @param methodName
         * @param args
         */
        executeMethodPrefixExtension(methodName: string, args: any[]): any;
        /**
         *
         * @param methodName
         * @param args
         * @param initResult
         */
        executeMethodSuffixExtension(methodName: string, args: any[], initResult: any): any;
        hasAnyPlugins(methodName: string): boolean;
        /**
         * 是否就绪的标志位
         */
        protected readyFlag: boolean;
        /**
         * 服务是否就绪
         */
        isReady(): boolean;
        /**
         * 服务状态
         */
        private _serviceStatus;
        /**
         * 设置服务状态
         * @param status
         */
        setServiceStatus(status: ServiceStatus): ServiceStatus;
        /**
         * 获取服务状态
         */
        getServiceStatus(): ServiceStatus;
        /**
         * 服务的配置
         */
        readonly config: config.ServiceConfig;
        protected mConfig: config.ServiceConfig;
        /**
         * 获取服务的配置
         */
        getConfig<T extends rigger.config.ServiceConfig>(): T;
        /**
         * 启动服务依赖的所有插件
         * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         * @param {any} startupArgs 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         *
         * @example resultHandler.runWith([true]) 启动成功
         */
        private startPlugins;
        protected plugins: IPlugin[];
        /**
         * 单个插件启动成功
         * @param resultHandler
         * @param index
         * @param startupArgs
         * @param retCode
         */
        private onPluginStartComplete;
        /**
         * 所有的插件都启动成功了
         * @param resultHandler
         * @param startupArgs
         */
        private onAllPluginsStartComplete;
        private stopPlugins;
        private onPluginStopComplete;
        /**
         * 所有插件都停止了
         * @param resultHandler
         */
        private onAllPluginsStopComplete;
        private addPluginToMap;
        private executeMethodExtension;
        private makePluginClass;
    }
}
