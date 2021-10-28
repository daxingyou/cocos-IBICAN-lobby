/**
* 依赖的组件的信息
*/
declare module rigger.config {
    class DependentComponentInfo {
        /**
         * 服务的完整名称，可以根据服务完整名称反映出服务类
         */
        fullName: string;
        /**
         * 描述文字
         */
        desc: string;
        /**
         * 版本
         */
        version: string;
        /**
         * 服务源
         */
        src: string;
        /**
         * 相关代码，资源存放位置
         */
        dest: string;
    }
}
