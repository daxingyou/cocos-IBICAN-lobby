/**
 * 事件服务
 */
declare module rigger.service {
    class EventService extends AbsService {
        constructor();
        /**
         * 服务名
         */
        static serviceName: string;
        static readonly instance: EventService;
        /**
         * 服务启动时的回调
         * @param {RiggerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         * @param {any[]} startupArgs 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         *
         * @example resultHandler.runWith([true]) 启动成功
         */
        protected onStart(resultHandler: RiggerHandler, startupArgs?: any): void;
        /**
         * 停止服务时的回调
         * @param {RiggerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         * @example resultHandler.runWith([true]) 服务停用成功
         */
        protected onStop(resultHandler: RiggerHandler): void;
        /**
         * 启动服务时的回调
         * @param {RiggerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务重启成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
         * @example resultHandler.runWith([true]) 重启
         */
        protected onReStart(resultHandler: RiggerHandler): void;
        private HANDLER_FIELD_TYPE_CALLER;
        private HANDLER_FIELD_TYPE_HANDLER;
        private HANDLER_FIELD_TYPE_INSTANCE;
        /**
         * 注册事件监听
         */
        addEventListener(eventName: string | number, obj: any, caller: any, handler: Function): void;
        /**
         * 移除事件监听
         */
        removeEventListener(eventName: any, obj: any, caller: any, handler: Function): void;
        /**
         * 派发事件注册了的事件将被触发
         */
        dispatchEvent(eventName: string | number, obj?: any, ...data: any[]): void;
        /**
         * 事件名与其对应的回调句柄的映射,以事件名为键，
         * 回调结构{HANDLER_FIELD_TYPE_CALLER:caller, HANDLER_FIELD_TYPE_HANDLER:handler, HANDLER_FIELD_TYPE_INSTANCE:instance}
         */
        private _handlerMap;
    }
}
