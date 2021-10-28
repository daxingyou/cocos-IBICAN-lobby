/**
* name
*/
declare module rigger {
    interface IMethodPluginInfo {
        /**
         * 前置插件
         */
        prefixPlugins: IPlugin[];
        /**
         * 后置插件
         */
        suffixPlugins: IPlugin[];
    }
}
