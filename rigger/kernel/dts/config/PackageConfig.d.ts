/**
* name
*/
declare module rigger.config {
    class PackageConfig {
        /**
         * 包的全名
         */
        fullName: string;
        version: string;
        customServicesRoot: string[];
        /**
         * 依赖的包的信息
         */
        packages: config.DependentComponentInfo[];
        constructor();
    }
}
