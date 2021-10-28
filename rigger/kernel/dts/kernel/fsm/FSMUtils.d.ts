/**
* 状态机的常用工具函数
*/
declare module rigger {
    class FSMUtils {
        constructor();
        /**
         * 状态机的参数条件判断：相等
         * @param v
         */
        static equal(v: any): (paramsV: any) => boolean;
        static notEqual(v: any): (paramsV: any) => boolean;
        /**
         * 状态机的参数条件判断：参数值小于指定值
         * @param v
         */
        static less(v: any): (paramsV: any) => boolean;
        /**
         * 状态机的参数条件判断：参数值小于等于指定值
         * @param v
         */
        static lessEqual(v: any): (paramsV: any) => boolean;
        /**
         * 状态机的参数条件判断：参数值大于指定值
         * @param v
         */
        static greater(v: any): (paramsV: any) => boolean;
        /**
         * 状态机的参数条件判断：参数值大于等于指定值
         * @param v
         */
        static greaterEqual(v: any): (paramsV: any) => boolean;
    }
}
