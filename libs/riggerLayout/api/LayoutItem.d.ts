/**
 * 布局项，最终被真正布局的项
 */
declare module riggerLayout {
    abstract class LayoutItem<T> {
        name: string | number;
        drawColor: string;
        rectangle: Rectangle;
        parent: Group;
        protected item: T;
        initX: number;
        protected initY: number;
        protected initWidth: number;
        protected initHeight: number;
        protected initScaleX: number;
        protected initScaleY: number;
        protected initPivoitX: number;
        protected initPivotY: number;
        x: number;
        y: number;
        protected mScaleX: number;
        scaleX: number;
        protected mScaleY: number;
        scaleY: number;
        offsetX: number;
        offsetY: number;
        abstract itemX: number;
        abstract itemY: number;
        abstract itemWidth: number;
        abstract itemHeight: number;
        abstract itemScaleX: number;
        abstract itemScaleY: number;
        abstract itemPivotX: number;
        abstract itemPivotY: number;
        compareItem(item: any): boolean;
        setPos(x: number, y: number): void;
        setScale(x: number, y: number): void;
        constructor(item: any);
        dispose(): void;
        /**
         * 两个比较自己和目标是否相等
         * 如果目标是LayoutItem,则比较二者引用是否相同
         * 如果目标非LayoutITem或其子类，则将目标和this.item的引用相比较
         * @param item
         */
        equal(item: any): boolean;
        protected draw(): void;
        setX(x: number): void;
        setY(y: number): void;
        setWidth(w: number): void;
        setHeight(h: number): void;
        setScaleX(sx: number): void;
        setScaleY(sy: number): void;
        /**
         * 是否相同（本身或其持有的显示对象相同）
         * @param item
         */
        isSame(item: any): boolean;
        /**
         * 测试显示矩形范围
         */
        measure(): void;
        protected initInfos(): void;
        /**
         * 将显示项映射到矩形
         */
        protected mapItem(): void;
        /**
         * 将矩形的设置映射到实际显示对象上
         */
        mapRectangle(): void;
        /**
         * 通过X，pivotX, scaleX的关系计算出其映射到矩形上后的X坐标
         */
        protected mapItemX(): number;
        protected mapRectangleX(): number;
        /**
         * 通过Y，pivotY, scaleY的关系计算出其映射到矩形上后的Y坐标
         *
         */
        protected mapItemY(): number;
        protected mapRectangleY(): number;
        protected mapItemWidth(): number;
        protected mapRectangleWidth(): number;
        protected mapItemHeight(): number;
        protected mapRectangleHeight(): number;
    }
}
