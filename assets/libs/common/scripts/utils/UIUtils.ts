import AssetsUtils from "./AssetsUtils";
import AssetCounterComponent from "./AssetCounterComponent";

/**
 * 一个
 */
export default class UIUtils {
    /**
     * 实例化
     * @param original 
     */
    public static instantiate(original: cc.Prefab): cc.Node;
    public static instantiate<T>(original: T): T; 
    public static instantiate(original: any): any 
    {
        if (original instanceof cc.Prefab) {
            let node = cc.instantiate(original);
            let counter: AssetCounterComponent = node.getComponent(AssetCounterComponent);
            if (!counter) {
                counter = node.addComponent(AssetCounterComponent);
            }
            let deps = cc.loader.getDependsRecursively(original);
            counter.setDeps(deps);
            return <any>node;
        }
        else if (original instanceof cc.Node) {
            let obj = cc.instantiate(original);
            let counter: AssetCounterComponent = obj.getComponent(AssetCounterComponent);
            if (!counter) {
                counter = obj.addComponent(AssetCounterComponent);
            }
            // 是否缓存有依赖
            let cacheDeps: string[] = original["$^deps"];
            if (!cacheDeps) {
                let temp = cc.js.createMap();
                UIUtils.visitNode(original, temp);
                cacheDeps = Object.keys(temp);
            }
            counter.setDeps(cacheDeps);
            return obj;
        }
        else {
            return cc.instantiate(original);
        }
    }

    /**
     * 获取指定节点所依赖的资源
     * @param node 
     * @param resMap 
     */
    public static visitNode(node: cc.Node, resMap: {}): void {
        for (let i = 0; i < node["_components"].length; i++) {
            UIUtils.visitComponent(node["_components"][i], resMap);
        }

        let children = node.children;
        for (let i = 0; i < children.length; i++) {
            UIUtils.visitNode(children[i], resMap);
        }
    }

    /**
     * 获取组件所依赖的资源
     * @param comp 
     * @param resMap 
     */
    public static visitComponent(comp: cc.Component, resMap: {}): void {
        let props = Object.getOwnPropertyNames(comp);
        for (var i = 0; i < props.length; i++) {
            var value = comp[props[i]];
            if (typeof value === 'object' && value) {
                if (Array.isArray(value)) {
                    for (let j = 0; j < value.length; j++) {
                        let val = value[j];
                        if (val instanceof cc.RawAsset) {
                            AssetsUtils.visitAsset(val, resMap);
                        }
                    }
                }
                else if (!value.constructor || value.constructor === Object) {
                    let keys = Object.getOwnPropertyNames(value);
                    for (let j = 0; j < keys.length; j++) {
                        let val = value[keys[j]];
                        if (val instanceof cc.RawAsset) {
                            AssetsUtils.visitAsset(val, resMap);
                        }
                    }
                }
                else if (value instanceof cc.RawAsset) {
                    AssetsUtils.visitAsset(value, resMap);
                }
            }
        }
    }
}