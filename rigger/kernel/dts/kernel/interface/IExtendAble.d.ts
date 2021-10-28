/**
* name
*/
declare module rigger {
    interface IExtendAble {
        /**
         * 对方法进行扩展
         */
        extendMethod(methodName: string): void;
        /**
         * 是否有装插件
         */
        hasAnyPlugins(methodName: string): boolean;
        /**
         * 执行指定方法前置扩展
         */
        executeMethodPrefixExtension(methodName: string, args: any[]): void;
        /**
         * 执行指定方法的后置扩展
         */
        executeMethodSuffixExtension(methodName: string, args: any[], initResult: any): any;
    }
}
