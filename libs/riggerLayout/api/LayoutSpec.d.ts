/**
* 布局规范类，用于设置布局参数
*/
declare module riggerLayout {
    class LayoutSpec {
        /**
         * 相对设计值进行缩放的标签
         */
        static readonly RelativeDesign: string;
        /**
         * 布局规范类型
         */
        private specType;
        /**
         * 调用域，只有在LayoutSpecType.Custom下才有效
         */
        private thisObj;
        /**
         * 最小屏幕比 LayoutSpecType.ScreenSize下，此字段表示最小宽高比,否则表示判断函数
         */
        private minRatioOrFunction;
        /**
         * 最大屏幕比， LayoutSpecType.ScreenSize下，此字段表示最大宽高比,否则表示判断函数的参数列表
         */
        private maxRatioOrArgs;
        /**
         * 符合条件后，需要应用的布局参数
         */
        private value;
        /**
         * 最大值
         */
        max: [ValueType, number];
        /**
         * 最小值
         */
        min: [ValueType, number];
        /**
         * 解析用户填写的值规范
         * @param v
         */
        static parseValueSpecs(v: number | string): [ValueType, number];
        /**
         * 计算真实的布局设置值
         *
         * @param specOrSpecArray 布局规范或规范数组
         * @param realWidth 真实屏幕宽
         * @param realHeight 真实屏幕高
         * @param realRatio 真实屏幕宽高比
         */
        static calculateRealValue(specOrSpecArray: LayoutSpec | LayoutSpec[], realWidth: number, realHeight: number): LayoutValue;
        constructor();
        dispose(): void;
        /**
         * @param thisObj 自定义的条件判断函数的调用域
         * @param fun 自定义的条件判断函数
         * @param args 传入的参数值，同时框架会将判断发生时的真实屏幕宽，并附加在用户的参数列表尾部
         * @param limit 此条件下的限定值
         * @param min 最小值
         * @param max 最大值
         */
        static createByCustom(thisObj: any, fun: Function, args: any[], value: string | number, min?: string | number, max?: string | number): LayoutSpec;
        /**
         * 根据指定参数创建一个LayoutSpec实例
         * @param minRatio 最小屏幕宽高比, 如果是 -1 表示忽略
         * @param maxRatio 最大屏幕宽高比, 如果是 -1 表示忽略
         * @param limit 此条件下的限定值
         * @param min 最小值
         * @param max 最大值
         *
         */
        static create(minRatio: number, maxRatio: number, value: string | number, min?: string | number, max?: string | number): LayoutSpec;
        /**
         * 计算真实的布局参数
         * @param realWidth 真实屏幕宽
         * @param realHeight 真实屏幕高
         */
        calculateRealValue(realWidth: number, realHeight: number): LayoutValue;
        private calculateRealValueByScreenSize(realWidth, realHeight);
        private calculateRealValueByCustom(realWidth, realHeight);
        /**
         * 是否需要忽略
         * @param v
         */
        private isIgnored(v);
        /**
         * 根据最大与最小限制计算最终值
         * @param parentWidth
         * @param parentHeight
         */
        /**
         * 以屏幕尺寸为条件创建一个实例
         * @param minRatio 最小屏幕宽高比
         * @param maxRatio 最大屏幕宽高比
         * @param limit 此条件下的限定值
         */
        private static createInstWithSizeCondition(minRatio, maxRatio, limit, min?, max?);
        /**
         * 以自定义条件创建一个实例
         * @param fun
         * @param args
         * @param limit
         */
        private static createInstWithCustom(thisObj, fun, args, limit, min, max);
    }
}
