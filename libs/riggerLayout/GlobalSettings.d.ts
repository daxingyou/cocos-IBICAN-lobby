/**
* 全局设定
*/
declare module riggerLayout {
    class GlobalSettings {
        /**
         * 真正的布局子项类，需要继承LayoutItem类
         */
        static realLayoutItemClass: any;
        constructor();
    }
}
