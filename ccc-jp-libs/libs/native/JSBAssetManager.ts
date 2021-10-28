/**
 * 引擎资源管理器,jsb.AssetManager的包装
 */
export default class JSBAssetsManager {
    /**
     * 创建一个资源管理器,只在Native环境下有用
     * 如果创建失败，返回null
     * @param manifestUrl 
     * @param storagePath 
     * @param versionCompareHandle 
     */
    public static create(manifestUrl: string, storagePath: string, versionCompareHandle: (versionA: string, versionB: string) => number = null): JSBAssetsManager | null {
        if (!jsb) {
            return null;
        }
        return new JSBAssetsManager(manifestUrl, storagePath, versionCompareHandle);
    }

    protected inst: jsb.AssetsManager;
    protected constructor(manifestUrl: string, storagePath: string, versionCompareHandle: (versionA: string, versionB: string) => number = null) {
        this.inst = new jsb.AssetsManager(manifestUrl, storagePath, versionCompareHandle);
    }

    
    public setVerifyCallback(caller: any, callback: (path: string, asset: { md5: string, size: number, path: string, compressed: boolean }) => boolean, args?:any) {

    }
}