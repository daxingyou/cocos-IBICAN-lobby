/**
 * Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。
 * Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。
 * 但是，right 和 bottom 属性与这四个属性是整体相关的。
 * 例如，如果更改 right 属性的值，则 width属性的值将发生变化；如果更改 bottom 属性，则 height 属性的值将发生变化
 */
declare module riggerLayout {
    class Rectangle implements IRecoverable {
        static readonly sign: string;
        static createInstance(): Rectangle;
        /**
         * 矩形左上角的 x 坐标
         */
        private mX;
        x: number;
        /**
         * 矩形左上角的 y 坐标
         */
        private mY;
        y: number;
        /**
         * 矩形的宽度（以像素为单位）
         */
        private mWidth;
        width: number;
        /**
         * 高度，以像素为单位
         */
        private mHeight;
        height: number;
        /**
         * 矩形左上角的 x 坐标
         */
        readonly left: number;
        /**
         * Y与height属性的和
         */
        readonly bottom: number;
        /**
         * x 和 width 属性的和
         */
        readonly right: number;
        /**
         * 矩形左上角的 y 坐标
         */
        readonly top: number;
        /**
         * 由该点的 x 和 y 坐标确定的 Rectangle 对象左上角的位置
         */
        topLeft: Point;
        /**
         * 由 right 和 bottom 属性的值确定的 Rectangle 对象的右下角的位置
         */
        bottomRight: Point;
        /**
         * 判断两个矩形是否相等
         * @param rect
         */
        equal(rect: Rectangle): boolean;
        /**
         * 设置矩形的属性
         * @param x
         * @param y
         * @param width
         * @param height
         */
        setTo(x: number, y: number, width: number, height: number): Rectangle;
        isEmpty(): boolean;
        setEmpty(): void;
        copyFrom(rect: Rectangle): Rectangle;
        clone(): Rectangle;
        offset(dx: number, dy: number): void;
        contains(x: number, y: number): boolean;
        containsPoint(point: Point): boolean;
        containsRect(rect: Rectangle): boolean;
        /**
         * 合并两个矩形并形成一个新矩形(此操作不会改变原来的矩形)
         * @param toUnion
         */
        union(toUnion: Rectangle): Rectangle;
        constructor(x?: number, y?: number, width?: number, height?: number);
        recover(): void;
        dispose(): void;
        private updateCorner();
    }
}
