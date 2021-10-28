/**
* name
*/
declare module riggerLayout {
    class Utils {
        /**
         * 判断参数是否是一个字符串
         */
        static isString(str: any): str is string;
        /**
         * 判断参数是否是一个数字
         * @param num
         */
        static isNumber(num: any): num is number;
        /**
         * 判断是否是函数
         * @param fun
         */
        static isFunction(fun: any): fun is Function;
        /**
         * 检查是否为空或未定义
         */
        static isNullOrUndefined(obj: any): boolean;
        /**
         * 字符串是否为空或空串
         */
        static isNullOrEmpty(str: string): boolean;
    }
}
