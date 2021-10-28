/**
* name
*/
declare module riggerLayout {
    enum ValueType {
        None = 0,
        /**
         * 绝对值
         */
        Absolute = 1,
        /**
         * 相对值
         */
        Relative = 2,
        /**
         * 相对设计值
         */
        RelativeDesign = 3,
    }
}
