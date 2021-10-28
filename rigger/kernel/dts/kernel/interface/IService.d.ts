/**
* name
*/
declare module rigger.service {
    interface IService {
        /**
         * 获取服务名
         */
        /**
         * 服务是否就绪
         */
        isReady(): boolean;
        /**
         * 获取应用
         */
        getApplication<T extends BaseApplication>(): T;
        /**
         * 设置应用
         */
        setApplication(app: BaseApplication): void;
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
         * 启动服务
         * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         * @param {config.ServiceConfig} serviceConfig 服务配置
         * @param {any?} startupArgs 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         *
         * @example resultHandler.runWith([true]) 启动成功
         */
        start(resultHandler: RiggerHandler, serviceCofig: config.ServiceConfig, startupArgs?: any): void;
        /**
         * 停止服务
         * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         * @param {config.ServiceConfig} serviceConfig 服务配置
         *
         * @example resultHandler.runWith([true]) 服务停用成功
         */
        stop(resultHandler: RiggerHandler, serviceCofig: config.ServiceConfig): void;
        /**
         * 启动服务
         * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务重启成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         *
         * @example resultHandler.runWith([true]) 重启
         */
        reStart(resultHandler: RiggerHandler, serviceCofig: config.ServiceConfig): void;
    }
}
