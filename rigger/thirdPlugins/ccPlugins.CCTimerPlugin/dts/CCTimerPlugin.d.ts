/**
* 适用于Cocos creater的定时插件
*/
declare module ccPlugins {
    class CCTimerPluginCallbackSpec {
        parent: CCTimerPlugin;
        caller: any;
        handlers: CCTimerPluginHandlerSpec[];
        private static POOL_SIGN;
        static create(plugin: CCTimerPlugin, caller: any): CCTimerPluginCallbackSpec;
        recover(): void;
        removeAt(idx: number): number;
        remove(handlerSpec: CCTimerPluginHandlerSpec): void;
        private checkIfKeep();
        constructor();
        dispose(): void;
    }
    class CCTimerPluginHandlerSpec {
        static create(callback: Function, caller: CCTimerPluginCallbackSpec, method: Function, args?: any[], restTimes?: number): CCTimerPluginHandlerSpec;
        recover(): void;
        execute(...args: any[]): void;
        compare(mehtod: Function): boolean;
        private static POOL_SIGN;
        parent: CCTimerPluginCallbackSpec;
        handler: rigger.RiggerHandler;
        callback: Function;
        restTimes?: number;
        constructor();
        init(callback: Function, caller: CCTimerPluginCallbackSpec, method: Function, args?: any[], restTimes?: number): void;
        dispose(ifRemoveFromParent?: boolean): void;
    }
    class CCTimerPlugin extends rigger.AbsServicePlugin {
        protected applicationEntity: cc.Component;
        protected listener: rigger.utils.ListenerManager;
        protected callbacks: CCTimerPluginCallbackSpec[];
        constructor();
        unschedule(callback: Function): void;
        schedule(callback: Function, interval?: number, repeat?: number, delay?: number): void;
        loop(delay: number, caller: any, method: Function, args?: Array<any>, coverBefore?: boolean, jumpFrame?: boolean): void;
        once(delay: number, caller: any, method: Function, args?: Array<any>, coverBefore?: boolean): void;
        clear(caller: any, method: Function): void;
        clearAll(caller: any): void;
        remove(callbackSpec: CCTimerPluginCallbackSpec): void;
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
         * 查找已经注册的回调， 如果找到则返回其索引元组
         * @param caller
         * @param method
         */
        private findCallback(caller, method);
        private addNewHandler(delay, repeat, caller, method, args?);
        private initCallbackSpec(caller);
        private addListener(delay, repeat, caller, method, args?, coverBefore?);
    }
}
