/**
* 自动布局容器基类
*/
declare module riggerLayout {
    class Group extends LayoutItem<any> {
        name: string | number;
        /**
         * 当子对象为时是否释放
         */
        doNotDestroy: boolean;
        /**
         * 距父容器左边距离
         * 格式:数字 -> 50, 字符串 -> "50%" | "50" | LayoutSpec | LayoutSpec[]
         */
        left: LayoutSpec | LayoutSpec[] | any;
        protected mLeft: LayoutSpec | LayoutSpec[] | any;
        /**
         * 距父级容器底部距离
         * 格式:数字 -> 50, 字符串 -> "50%" | "50" | LayoutSpec | LayoutSpec[]
         */
        bottom: LayoutSpec | LayoutSpec[] | any;
        mBottom: LayoutSpec | LayoutSpec[] | any;
        /**
         * 距父级容器右边的距离
         * 格式:数字 -> 50, 字符串 -> "50%" | "50" | LayoutSpec | LayoutSpec[]
         */
        right: LayoutSpec | LayoutSpec[] | any;
        mRight: LayoutSpec | LayoutSpec[] | any;
        /**
         * 距父级窗口顶部的距离
         * 格式:数字 -> 50, 字符串 -> "50%" | "50" | LayoutSpec | LayoutSpec[]
         */
        top: LayoutSpec | LayoutSpec[] | any;
        mTop: LayoutSpec | LayoutSpec[] | any;
        /**
         * 宽
         * 格式:数字 -> 50, 字符串 -> "50%" | "50" | LayoutSpec | LayoutSpec[]
         */
        width: LayoutSpec | LayoutSpec[] | any;
        mWidth: LayoutSpec | LayoutSpec[] | any;
        /**
         * 高
         * 格式:数字 -> 50, 字符串 -> "50%" | "50" | LayoutSpec | LayoutSpec[]
         */
        height: LayoutSpec | LayoutSpec[] | any;
        mHeight: LayoutSpec | LayoutSpec[] | any;
        /**
         * 在父级容器中距离X轴中心的位置
         * 格式:数字 -> 50, 字符串 -> "50%" | "50" | LayoutSpec | LayoutSpec[]
         */
        horizontalCenter: LayoutSpec | LayoutSpec[] | any;
        mHorizontalCenter: LayoutSpec | LayoutSpec[] | any;
        /**
         * 在父级容器中距离Y轴中心的位置
         */
        verticalCenter: LayoutSpec | LayoutSpec[] | any;
        mVerticalCenter: LayoutSpec | LayoutSpec[] | any;
        /**
         * 包含的子项
         */
        elementsContent: LayoutItem<any>[];
        /**
         * 子项数量
         */
        readonly numElements: number;
        /**
         * 将不同格式的布局规范适配成统一格式
         */
        adaptLayoutSpec(v: number | string | LayoutSpec | LayoutSpec[]): LayoutSpec | LayoutSpec[];
        /**
         * 此容器的布局对象
         */
        protected mLayout: LayoutBase;
        layout: LayoutBase;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        setScale(x: number, y: number): void;
        setPos(x: number, y: number): void;
        protected mitemX: number;
        itemX: number;
        protected mItemY: number;
        itemY: number;
        protected mItemWidth: number;
        itemWidth: number;
        protected mItemHeight: number;
        itemHeight: number;
        protected mItemScaleX: number;
        itemScaleX: number;
        protected mItemScaleY: number;
        itemScaleY: number;
        protected mItemPivotX: number;
        itemPivotX: number;
        protected mItemPivotY: number;
        itemPivotY: number;
        realWidth: number;
        realHeight: number;
        realX: number;
        realY: number;
        /**
         * 获取一个布局元素子项
         * @param index
         */
        getElementAt(index: number): LayoutItem<any>;
        /**
         * 通过名字获取元素
         * @param name
         */
        getElementByName(name: string | number): LayoutItem<any>;
        protected measuredWidth: number;
        protected measuredHeight: number;
        /**
         * 设置测量结果
         * @param width
         * @param height
         */
        setMeasuredSize(width: number, height: number): void;
        /**
         * 将一个显示对象添加到布局组
         * @param item
         */
        addChild(item: any): void;
        /**
         * 从所有子级中移除对象
         * @param item
         */
        remove(item: any): boolean;
        /**
         * 布局组中有子对象的矩形区域发生了变化
         */
        onChildRectangleChange(): void;
        /**
         * 更新布局
         * @param needMeasure
         */
        updateLayout(needMeasure?: boolean): void;
        /**
         *
         */
        updateChildrenLayout(): void;
        /**
         * 更新子对象布局并使用生效
         */
        updateAndApplyChildrenLayout(): void;
        /**
         * 测量显示矩形区域
         */
        measure(ifChild?: boolean): void;
        /**
         * 调整目标的元素的大小并定位这些元素
         *
         * @param x
         * @param y
         * @param unscaledWidth
         * @param unScaledHeight
         */
        beforeLayout(x: number, y: number, unscaledWidth: number, unScaledHeight: number): void;
        /**
         * 布局完成后再次调整布局
         *
         * @param x
         * @param y
         * @param realWidth
         * @param realHeight
         */
        afterLayout(x: number, y: number, realWidth: number, realHeight: number): void;
        constructor(item?: any);
        dispose(): void;
        /**
         * 将自身的矩形映射到所有子项
         */
        mapRectangle(): void;
        /**
         * 获取所在的适配层
         */
        getLayer(): LayoutLayer;
        /**
         * 偏移子对象
         * @param dx
         * @param dy
         */
        protected offsetChildren(dx: number, dy: number): void;
        /**
         * 缩放子对象
         * @param x
         * @param y
         */
        protected scaleChildren(x: number, y: number): void;
        /**
         * 绘制矩形区域，用于DEBUG
         */
        protected draw(): void;
        protected decideRealSize(): void;
        protected decideRealPos(): void;
        protected decideRealX(): void;
        protected decideRealY(): void;
        protected decideRealXByRight(): boolean;
        protected getDesignWidth(): number;
        protected getDesignHeight(): number;
        protected getParentDesignWidth(): number;
        protected getParentDesignHeight(): number;
        protected decideRealXByLeft(): boolean;
        protected decideRealXByCenter(): boolean;
        protected decideRealYByTop(): boolean;
        protected decideRealYByBottom(): boolean;
        protected decideRealYByCenter(): boolean;
        protected applyRealSize(): void;
        protected applyRealPos(): void;
        doRemove(item: any): boolean;
        private doAddChild(item);
        /**
         * 更新Group的最终真实宽度
         * 1. 如果未规定则取初始值（加入时的值)
         * 2. 如果同时填写了left与right,则优先取left与right
         * 3.
         * @param parentWidth
         */
        private decideRealWidth();
        private decideRealHeight();
        private decideHeightByTopAndBottom();
        /**
         * 根据左右边距确定宽：当同时规定了左右边距时，也意味着确定了宽
         */
        private decideWidthByLeftAndRight();
        private getParentRealWidth();
        private getParentRealHeight();
        /**
         * 析构适配规范设置
         */
        private disposeLayoutSpec();
        private disposeChildren();
        private doDisposeLayoutSpec(spec);
    }
}
