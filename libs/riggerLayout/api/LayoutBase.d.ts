/**
* name
*/
declare module riggerLayout {
    class LayoutBase {
        /**
         * 此布局将测量其元素、调整其元素的大小并定位其元素的 Group 容器
         */
        target: Group;
        /**
         * 若要配置容器使用虚拟布局，请为与容器关联的布局的 useVirtualLayout 属性设置为 true
         */
        useVirtualLayout: boolean;
        /**
         * 如果 useVirtualLayout 为 true，则当布局目标改变时，布局目标可以使用此方法来清除已缓存布局信息
         */
        clearVirtualLayoutCache(): void;
        /**
         * 在已添加布局元素之后且在验证目标的大小和显示列表之前，由目标调用
         */
        elementAdded(index: number): void;
        /**
         * 返回此 Group 中可见的元素的索引
         */
        getElementIndicesInView(): number[];
        /**
         * 设置一个典型元素的大小
         * @param width
         * @param height
         */
        setTypicalSize(width: number, height: number): void;
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
        afterLayout(x: number, y: number, unscaledWidth: number, unScaledHeight: number): void;
        /**
         * 基于目标的内容测量其默认大小
         */
        measure(ifChild?: boolean): void;
        constructor();
        dispose(): void;
    }
}
