/**
* name
*/
declare module rigger.config {
    /**
     * 服务配置
     */
    class ServiceConfig extends DependentComponentInfo {
        constructor();
        /**
         * 依赖的服务信息
         */
        services: config.ServiceConfig[];
        /**
         * 依赖的插件信息
         */
        plugins: config.DependentComponentInfo[];
    }
}
