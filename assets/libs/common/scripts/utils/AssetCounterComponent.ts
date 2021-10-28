/**
 * 一个资源计数管理组件，挂载此组件的结点，当其被初始化时，会自动对其持有的资源引用计数+1
 * 当节点被销毁时，则计数-1
 * 注意，如果一个节点从未被激活过，则不会对其资源的引用计数有任何影响
 */
import UIUtils from "./UIUtils";
import AssetsUtils from "./AssetsUtils";

const { ccclass } = cc._decorator;
@ccclass
export default class AssetCounterComponent extends cc.Component {
    public setDeps(deps: string[]): void {
        this.deps = deps;
    }

    public getDeps(): string[] {
        return this.deps;
    }
    protected deps: string[];

    private isEverInited: boolean = false;
    onLoad(): void {
        this.initDeps();
        if (this.deps) {
            AssetsUtils.updateRefCount(this.deps, 1);
        }
        this.isEverInited = true;
    }

    onLoadDebug(): void {
        this.initDeps();
        if (this.deps) {
            AssetsUtils.updateRefCount(this.deps, 1);
            // 引用的详细信息，DEBUG用
            AssetsUtils.updateRefDetails(this.node.name, this.deps, 1)
        }
        this.isEverInited = true;
    }

    onDestroy(): void {
        // this.setDeps(null);
        if (!this.isEverInited) return;
        if (this.deps) {
            AssetsUtils.updateRefCount(this.deps, -1);
        }
        this.deps = null;
        this.isEverInited = false;
    }

    protected initDeps(): void {
        if (!this.deps) {
            let deps = cc.js.createMap();
            UIUtils.visitNode(this.node, deps);
            this.setDeps(Object.keys(deps));
        }
    }
}

// DEBUG设置
if (CC_DEBUG) {
    AssetCounterComponent.prototype.onLoad = AssetCounterComponent.prototype.onLoadDebug;
}