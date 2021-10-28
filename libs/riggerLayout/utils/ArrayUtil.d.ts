/**
* 数组工具箱
*/
declare module riggerLayout {
    class ArrayUtil {
        /**
         * 在数组中查找指定元素的索引，如果未找到，则返回-1
         * @param arr
         * @param predFun
         */
        static findIndex(arr: any[], predFun: (ele: any, arr?: any[], idx?: number) => boolean): number;
        /**
         * 从数组中移除一个符合条件的元素，如果移除成功返回被移除元素的索引
         * 只移除第一个符合条件的元素
         * @param arr
         * @param predFun
         */
        static remove<T>(arr: T[], predFun: (ele: T, arr?: T[], idx?: number) => boolean): number;
        /**
         * 从数组中移除指定索引的元素
         * @param arr
         * @param idx
         */
        static removeAt(arr: any[], idx: number): any[];
        constructor();
    }
}
