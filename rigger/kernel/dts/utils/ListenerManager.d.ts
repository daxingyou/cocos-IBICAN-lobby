/**
* name
*/
declare module rigger.utils {
    class ListenerManager {
        constructor();
        dispose(): void;
        private handlers;
        on(caller: any, method: Function, args: any[], once?: boolean): void;
        /**
         * 解除回调
         * @param caller
         * @param method
         */
        off(caller: any, method: Function): void;
        /**
         * 解除所有回调
         * @param caller
         * @param method
         */
        offAll(caller: any, method: Function): void;
        /**
         * 清除所有回调
         */
        clear(): void;
        execute(...args: any[]): void;
    }
}
