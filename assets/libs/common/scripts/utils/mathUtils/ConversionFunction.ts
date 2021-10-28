import FloatUtils from "./FloatUtils";

export default class ConversionFunction {

    /**
     * 数值转换 
     * @param num 原数据
     * @param point 小数点左移位数
     */
    public static intToFloat(num: number, point: number): number {
        let absNum: number = Math.abs(num);
        let negative: number = absNum === 0 ? 1 : absNum / num;
        let divisor: number = Math.pow(10, point);
        let temp: number = Math.floor(absNum / divisor);
        let tempDecimal = Math.floor(absNum % divisor) / divisor;
        let result: number = FloatUtils.accAdd(temp, tempDecimal) * negative;
        return result;
    }
}