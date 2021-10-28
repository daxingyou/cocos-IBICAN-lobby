/**
* 适配值
*/
declare module riggerLayout {
    class LayoutValue {
        /**
         * 值
         */
        value: [ValueType, number];
        /**
         * 最小值
         */
        min: [ValueType, number];
        /**
         * 最大值
         */
        max: [ValueType, number];
        constructor(value: [ValueType, number], min?: [ValueType, number], max?: [ValueType, number]);
        /**
         * 是否相对设计尺寸
         */
        isRelativeDesign(): boolean;
        /**
         * 计算最终值
         * @param refValue
         */
        calculateValue(refValue: number): number;
        /**
         *
         * @param refvalue 参考值
         * @param value 当前值
         */
        private calculateWithMin(refvalue, value);
        /**
         * 根据最大值
         * @param refValue
         * @param value
         */
        private calculateWithMax(refValue, value);
    }
}
