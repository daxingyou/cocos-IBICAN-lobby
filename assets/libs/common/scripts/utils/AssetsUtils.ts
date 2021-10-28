export default class AssetsUtils {
    public static get assetsPackageManager() {
        if (!AssetsUtils.mAssetsPackageManager) {
            AssetsUtils.mAssetsPackageManager = new rigger.service.AssetsPackageManager();
        }
        // cc.log(`now print manager`);
        // for (var k in AssetsUtils.mAssetsPackageManager) {
        //     cc.log(`k:${k}`)
        // }
        return AssetsUtils.mAssetsPackageManager
    }
    public static mAssetsPackageManager = new rigger.service.AssetsPackageManager();
    // public static assetsPackageManager: rigger.service.AssetsPackageManager;


    private static get retainMap(): {} {
        // 初始化retain表
        if (!AssetsUtils.mRetainMap) {
            AssetsUtils.mRetainMap = cc["$rtnm"];
            if (!AssetsUtils.mRetainMap) {
                AssetsUtils.mRetainMap = cc["$rtnm"] = cc.js.createMap();
            }
        }

        return AssetsUtils.mRetainMap;
    }
    private static mRetainMap: {};
    /**
     * panel注册装饰器,用于将一个资源地址和面板关联起来
     * @param group 
     * @param pkg 
     * @param panelClass 
     */
    public static panel(group: string, pkg: string, panelClass: any, ifRetain: boolean = false) {
        if (!AssetsUtils.panelMap) AssetsUtils.panelMap = {};
        return (target: any, attrName: string) => {
            let path: string = target[attrName];
            if (!path) return;

            AssetsUtils.assetsPackageManager.registerPackage(pkg, [{ url: path, type: cc.Prefab }])
            AssetsUtils.assetsPackageManager.registerGroup(group, pkg);
            AssetsUtils.registerPanel(path, panelClass);
            if (ifRetain) {
                AssetsUtils.prepareRetainUrl(path);
            }
        }
    }

    public static panelEditor(group: string, pkg: string, panelClass: any, ifRetain: boolean = false) {
        return (target: any, attrName: string) => {

        }
    }

    public static isRetained(uuid: string): boolean {
        return AssetsUtils.retainMap[uuid];
    }

    public static applyRetain(): void {
        if (AssetsUtils.prepareRetainArr && AssetsUtils.prepareRetainArr.length > 0) {
            AssetsUtils.prepareRetainArr.forEach(e => AssetsUtils.retainUrl(e));
            AssetsUtils.prepareRetainArr = [];
        }
    }

    public static retainAssetKey(assetKey: string | string[]): void {
        let retainMap = AssetsUtils.retainMap;
        if (rigger.utils.Utils.isArray(assetKey)) {
            for (var i: number = 0; i < assetKey.length; ++i) {
                retainMap[assetKey[i]] = true;
            }
        }
        else {
            retainMap[assetKey] = true;
        }
    }

    public static retainUrl(url: string): void {
        let retainMap = AssetsUtils.retainMap;
        // 通过url查找其uuid列表
        let info: { type, uuid } | { type, uuid }[] = this.pathToUuid[url];
        if (rigger.utils.Utils.isArray(info)) {
            for (var i: number = 0; i < info.length; ++i) {
                retainMap[info[i].uuid] = true;
            }
        }
        else {
            retainMap[info.uuid] = true;
        }
    }

    /**
     * 更新资源的引用计数
     * @param assetsKeys 
     * @param acc 
     */
    public static updateRefCount(assetsKeys: string | string[], acc: number = 1 | -1): void {
        if (rigger.utils.Utils.isString(assetsKeys)) {
            AssetsUtils.doUpdateRefCount(assetsKeys, acc);
        }
        else {
            for (var i: number = 0; i < assetsKeys.length; ++i) {
                AssetsUtils.doUpdateRefCount(assetsKeys[i], acc);
            }
        }
    }

    public static updateRefDetails(url: string, assetsKeys: string | string[], acc: number = 1 | -1): void {
        if (rigger.utils.Utils.isString(assetsKeys)) {
            AssetsUtils.doUpdateRefDetails(assetsKeys, url, acc);
        }
        else {
            for (var i: number = 0; i < assetsKeys.length; ++i) {
                AssetsUtils.doUpdateRefDetails(assetsKeys[i], url, acc);
            }
        }
    }

    /**
     * 获取资源依赖的资源
     * @param asset 
     * @param excludeMap 
     */
    public static visitAsset(asset: cc.RawAsset, excludeMap: {}) {
        // Skip assets generated programmatically or by user (e.g. label texture)
        if (!asset["_uuid"]) {
            return;
        }
        // 此方法，引擎未暴露出来，只能使用这种hack的方式调用
        var key = cc.loader["_getReferenceKey"](asset);
        if (!excludeMap[key]) {
            excludeMap[key] = true;
            AssetsUtils.parseDepends(key, excludeMap);
        }
    }

    /**
     * 分析依赖
     * @param key 
     * @param parsed 
     */
    public static parseDepends(key: string, parsed: {}) {
        var item = cc.loader["getItem"](key);
        if (item) {
            var depends = item.dependKeys;
            if (depends) {
                for (var i = 0; i < depends.length; i++) {
                    var depend = depends[i];
                    if (!parsed[depend]) {
                        parsed[depend] = true;
                        AssetsUtils.parseDepends(depend, parsed);
                    }
                }
            }
        }
    }

    /**
     * 获取为面板关联的资源地址
     * @param panelClass 
     */
    public static getResoucePath(panelClass: Function): string {
        return panelClass["$res_path"];
    }

    public static getChildByName(root: cc.Node, name: string, ifRecursive: boolean = false): cc.Node {
        if (!ifRecursive) return root.getChildByName(name);

    }

    /**
     * 获取所有未使用的资源键
     * 如果这个资源从未被统计到过，则此资源也无法被获取到
     */
    public static getUnusedAssetKeys(): string[] {
        let all = AssetsUtils.cache;
        let ret: string[] = [];
        for (var key in all) {
            if (AssetsUtils.mAssetsCounterMap[key] || AssetsUtils.isRetained(key)) {
                continue;
            }
            else {
                ret.push(key);
            }
        }

        return ret;
    }

    /**
     * 获取正在使用中的资源键列表，主要用于调试
     * 未统计资源不在此列出
     */
    public static getInUseAssetKeys(): string[] {
        let ret: string[] = [];
        for (var key in AssetsUtils.mAssetsCounterMap) {
            if (AssetsUtils.mAssetsCounterMap[key] > 0) {
                ret.push(key);
            }
        }

        return ret;
    }

    /**
     * 获取未被统计过的资源键列表，此接口主要供调试用
     * 注意：如果资源加载了但从未使用，可能被认为是未统计的资源，如，预加载的资源
     */
    public static getUnStatisticAssetKeys(): string[] {
        let all = AssetsUtils.cache;
        let ret: string[] = [];
        for (var k in all) {
            if (k["endsWith"](".js")) {
                continue;
            }

            if (k in this.mAssetsCounterMap) {
                continue;
            }
            else {
                ret.push(k);
            }
        }

        return ret;
    }

    /**
     * 所有尚未释放的资源
     */
    public static getUnReleasedAssetKeys(): string[] {
        let all = AssetsUtils.cache;
        let ret: string[] = [];
        for (var k in all) {
            if (k["endsWith"](".js")) {
                continue;
            }

            ret.push(k);
        }

        return ret;
    }

    private static panelMap: {};
    public static registerPanel(resPath: string, panelClass: Function) {
        AssetsUtils.panelMap[resPath] = panelClass;
        panelClass["$res_path"] = resPath;
    }

    public static initRefCountMap() {
        if (!AssetsUtils.mAssetsCounterMap) {
            AssetsUtils.mAssetsCounterMap = cc["$_asCntMap_"];
            if (!AssetsUtils.mAssetsCounterMap) {
                AssetsUtils.mAssetsCounterMap = cc["$_asCntMap_"] = cc.js.createMap();
            }

        }
    }
    protected static mAssetsCounterMap: {};

    /**
     * 
     */
    // 2.1.2版本资源卸载有BUG，需要对内建材质进行手动+1
    public static retainBuiltinAssets(): void {
        if(cc["retainedBuiltin"]) return;
        let builtinMats = cc["AssetLibrary"].getBuiltins("material");
        if (builtinMats) {
            for (var k in builtinMats) {
                let deps = cc.loader.getDependsRecursively(builtinMats[k]);
                AssetsUtils.retainAssetKey(deps);
            }
            cc["retainedBuiltin"] = true;
        }
    }

    /**
     * 
     */
    public static initRefDetailsMap(): void {
        if (!AssetsUtils.mAssetsRefDetailsMap) {
            AssetsUtils.mAssetsRefDetailsMap = cc["$_asRefDetailMap_"];
            if (!AssetsUtils.mAssetsRefDetailsMap) {
                AssetsUtils.mAssetsRefDetailsMap = cc["$_asRefDetailMap_"] = cc.js.createMap();
            }
        }
    }

    public static getRefDetailsMap(): {} {
        return AssetsUtils.mAssetsRefDetailsMap;
    }

    /**
     * 将资源键转换为比较友好的资源名，只有resource下的资源才能被转换，其它资源原样返回
     * 已经被释放的资源无法被转换，将原样返回
     * @param key 
     */
    public static convertAssetKey(key: string): string {
        let cache = AssetsUtils.cache;
        let info = cache[key];
        if (!info) return key;
        let uuid = info.uuid;
        if (!uuid) return key;
        let uuidToPath = AssetsUtils.uuidToPath;
        let ret = uuidToPath[uuid];

        return ret || key;
    }

    private static prepareRetainArr: string[] = [];
    /**
     * 准备保持指定的url
     * @param url 
     */
    private static prepareRetainUrl(url: string): void {
        AssetsUtils.prepareRetainArr.push(url);
    }

    /**
     * 资源被引用的详细信息，调试用
     */
    // protected get assetsRefDetailsMap(): {} {

    // }
    protected static mAssetsRefDetailsMap: {};

    private static doUpdateRefCount(assetKey: string, acc: number = 1 | -1): void {
        if (AssetsUtils.mAssetsCounterMap[assetKey]) {
            AssetsUtils.mAssetsCounterMap[assetKey] += acc;
        }
        else {
            AssetsUtils.mAssetsCounterMap[assetKey] = acc;
        }
    }

    private static doUpdateRefCountDebug(assetKey: string, acc: number = 1 | -1): void {
        if (AssetsUtils.mAssetsCounterMap[assetKey]) {
            AssetsUtils.mAssetsCounterMap[assetKey] += acc;
        }
        else {
            AssetsUtils.mAssetsCounterMap[assetKey] = acc;
        }

        if (CC_DEBUG) {
            if (AssetsUtils.mAssetsCounterMap[assetKey] < 0) {
                throw (new Error(`${assetKey} 's ref count is less than zero:${AssetsUtils.mAssetsCounterMap[assetKey]}`));
            }
        }
    }

    private static doUpdateRefDetails(assetKey: string, url: string, acc: number = 1 | -1): void {
        let old: {} = AssetsUtils.mAssetsRefDetailsMap[assetKey];
        if (!old) {
            old = AssetsUtils.mAssetsRefDetailsMap[assetKey] = cc.js.createMap();
        }
        let oldNum: number = old[url] || 0;
        let newNum: number = oldNum += acc;
        if (newNum == 0) {
            delete old[url];
        }
        else if (newNum < 0) {
            throw new Error(`ref count less than 0, url:${url}`)
        }
        else {
            old[url] = newNum;
        }
    }

    /**
     * 获取uuid到资源路径的转换表，供调试用，且只有resources下的资源才有此信息
     */
    private static get uuidToPath(): {} {
        if (!AssetsUtils.mUuidToPath) {
            AssetsUtils.mUuidToPath = cc.js.createMap();
            let pathToUUID: {} = AssetsUtils.pathToUuid;
            for (var k in pathToUUID) {
                let info = pathToUUID[k];
                if (rigger.utils.Utils.isArray(info)) {
                    for (var i: number = 0; i < info.length; ++i) {
                        AssetsUtils.mUuidToPath[info[i].uuid] = `${k}:${info[i].type.name}`;
                    }
                }
                else {
                    AssetsUtils.mUuidToPath[info.uuid] = `${k}:${info.type.name}`;
                }
            }
        }

        return AssetsUtils.mUuidToPath;
    }
    private static mUuidToPath: {};

    private static get pathToUuid(): {} {
        return cc.loader["_assetTables"].assets._pathToUuid;
        // return cc.loader["_resources"]._pathToUuid;
    }

    /**
     * 当前缓存中的资源(已经加载的)
     */
    private static get cache(): {} {
        return cc.loader["_cache"];
    }
}
// hack debug模式下的接口
if (CC_DEBUG) {
    AssetsUtils["doUpdateRefCount"] = AssetsUtils["doUpdateRefCountDebug"];
    AssetsUtils["mAssetsRefDetailsMap"] = cc.js.createMap();
}

if (CC_EDITOR) {
    AssetsUtils.panel = AssetsUtils.panelEditor;
}

// 初始化引用计数
AssetsUtils.initRefCountMap();
AssetsUtils.initRefDetailsMap();
