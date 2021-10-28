/**
* name
*/
declare module rigger {
    class RiggerHandler {
        protected _id: number;
        readonly caller: any;
        private _caller;
        readonly method: Function;
        private _method;
        readonly once: boolean;
        private _once;
        readonly args: any[];
        private _args;
        constructor(caller: any, func: Function, args?: any[], once?: boolean);
        dispose(): void;
        private static riggerHandlerSign;
        static create(caller: any, fun: Function, args?: any[], once?: boolean): RiggerHandler;
        /**
         * 将一个RiggerHandler回收到对象池
         * @param handler
         */
        static recover(handler: rigger.RiggerHandler): void;
        /**
         * 将自身回收至对象池
         */
        recover(): void;
        /**
         * 无参执行
         */
        run(): any;
        /**
         * 带参执行
         * @param args
         */
        runWith(args: any[]): any;
        success(): void;
        fail(): void;
    }
}
