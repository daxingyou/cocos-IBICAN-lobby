// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// const { ccclass, property } = cc._decorator;
// import jszip from "jszip-utils"
import LayerManager, { Layer } from "./LayerManager"
import Panel from "./Panel"
import BackBlockingPanel from "./BackBlockingPanel";
// import UIUtils from "./UIUtils";
import PanelStackFrame from "./PanelStackFrame";
import PanelPopSignal from "../signals/PanelPopSignal";
import AssetsUtils from "./AssetsUtils";
import UIUtils from "./UIUtils";
import AssetAllocator, { AssetAllocateResult } from "../modules/assets/models/AssetAllocator";
export default class UIManager {
    public static get instance(): UIManager {
        if (!UIManager.inst) UIManager.inst = new UIManager();
        return UIManager.inst;
    }
    private static inst: UIManager = null;

    private panelStack: PanelStackFrame[] = [];


    protected get prefabsMap(): {} {
        if (!this.mPrefabsMap) {
            this.mPrefabsMap = cc.js.createMap();
        }

        return this.mPrefabsMap;
    }
    private mPrefabsMap: {};

    // protected initedBackBlockingPanel: boolean = false;

    constructor() {
        this.panelStack = [];

        if (!this.backBlockingPanel) {
            // 初始化背板
            // 获取真实类
            // this.initedBackBlockingPanel = true;
            let bindInfo: riggerIOC.InjectionBindInfo = riggerIOC.InjectionBinder.instance.bind(BackBlockingPanel);
            let path: string = AssetsUtils.getResoucePath(bindInfo.realClass);
            this.backBlockingPanel = <BackBlockingPanel>this.instantiatePanel(path).node.getComponent(BackBlockingPanel);
        }
    }

    dispose(): void {
        this.panelStack.forEach(e => e.dispose());
        this.panelStack = [];
        // 析构缓存池里面的面板
        Panel.disposePool();
        if (this.mPrefabsMap) {
            for (var path in this.mPrefabsMap) {
                this.mPrefabsMap[path].dispose();
            }
        }
        this.mPrefabsMap = null;
        if (this.backBlockingPanel) {
            this.backBlockingPanel.node.destroy();
            this.backBlockingPanel = null;
            // this.initedBackBlockingPanel = false;
        }
        UIManager.inst = null;
    }

    /**
     * 显示面板
     * @param panelClass 
     * @param layerOrNameOrID 
     * @param closeOther 
     * @param funEx 
     * @param stackInfo 
     */
    showPanel(panelClass: { new(): Panel }, layerOrNameOrID: string | number | Layer, closeOther?: boolean, funEx?: any, stackInfo?: PanelStackFrame): Panel {
        // 获取真实类
        let bindInfo: riggerIOC.InjectionBindInfo = riggerIOC.InjectionBinder.instance.bind(panelClass);
        let path: string = AssetsUtils.getResoucePath(bindInfo.realClass);
        if (!path) throw new Error("seems unregistered panel:" + panelClass);
        // 实例化面板
        let panel: Panel = this.instantiatePanel(path);
        // // 绑定和获取Mediator
        // let mediator: JPMediator = <JPMediator>this.mediationBinder.createAndAttach(PanelClass, panel);
        if (panel) {
            if (stackInfo) {
                this.panelStack.push(stackInfo);
            }

            // 是否隐藏其它面板
            if (closeOther !== null && closeOther !== undefined) {
                panel.closeOther = closeOther;
            }

            // 是否需要关闭其它
            if (panel.closeOther) UIManager.instance.hideAllPanels(layerOrNameOrID);
            panel.show(layerOrNameOrID, funEx);
            // //记录面板的弹出次数
            this.panelPopCount(panel.resPath);
            // 是否需要显示背板层
            UIManager.instance.attachBackBlockingPanel(layerOrNameOrID, panel);
            return panel;
        }

        return null;
    }

    /**
     * 隐藏面板
     * @param panelOrNode 
     */
    hidePanel(panelOrNode: Panel | cc.Node): void {
        cc.log(`hide panel:${panelOrNode}`)
        let panel: Panel;
        if (panelOrNode instanceof Panel) {
            panel = panelOrNode;
        }
        else {
            panel = panelOrNode.getComponent<Panel>(Panel);
        }
        UIManager.instance.unattachBackBlockingPanel(panel);
        panel.hide();

        // cc.log(`panel frame len:${this.panelStack.length}`);
        // 是否有面板需要显示
        let frame: PanelStackFrame = this.panelStack.pop();
        if (frame) {
            this.showPanel(frame.panelClass, frame.layer, frame.closeOther, frame.params);
        }

    }

    /**
     * 获取一个指定类型的面板（已经显示出来的)
     * @param panelClass 
     */
    public static getPanel(panelClass: { new(): Panel }): Panel | null {
        return Panel.getPanel(panelClass)
    }

    public hideAllPanels(layerOrNameOrId: string | number | Layer) {
        LayerManager.hideAllPanels(layerOrNameOrId);
    }

    private get backBlockingPanel(): BackBlockingPanel {
        return cc["$_backBlockingPanel"] || null;
    }
    private set backBlockingPanel(panel: BackBlockingPanel) {
        cc["$_backBlockingPanel"] = panel;
    }

    public resetBackBlockingPanel(): void {
        // this.initedBackBlockingPanel = false;
        this.backBlockingPanel = null;
    }
    public attachBackBlockingPanel(layerOrNameOrId: number | string | Layer, panel: Panel): void {
        if (!panel.needBlockOther) return;
        if (this.backBlockingPanel) {
            this.backBlockingPanel.attach(layerOrNameOrId, panel);
        }
        else {
            // 获取真实类
            let bindInfo: riggerIOC.InjectionBindInfo = riggerIOC.InjectionBinder.instance.bind(BackBlockingPanel);
            let path: string = AssetsUtils.getResoucePath(bindInfo.realClass);
            this.backBlockingPanel = <BackBlockingPanel>this.instantiatePanel(path).node.getComponent(BackBlockingPanel);
            if (!this.backBlockingPanel) {
                throw new Error("failed to instantiate BackBlockingPanel");
            }
            this.attachBackBlockingPanel(layerOrNameOrId, panel);
        }
    }

    public unattachBackBlockingPanel(panel: Panel): void {
        if (!panel) return;
        if (!this.backBlockingPanel) return;
        this.backBlockingPanel.unattach(panel);
    }

    private instantiatePanel(path: string): Panel {
        // 是否有缓存
        // let poolService: rigger.service.PoolService = rigger.service.PoolService.instance;
        let panelNode: cc.Node = Panel.pool.getItem<cc.Node>(path);

        if (panelNode) {
            return panelNode.getComponent<Panel>(Panel);
        }
        else {
            // 看资源是否有加载
            // let res: cc.Prefab = rigger.service.AssetsService.instance.getCache(path);
            let allocator: AssetAllocator<cc.Prefab> = this.prefabsMap[path];
            if (!allocator) {
                allocator = this.prefabsMap[path] = new AssetAllocator<cc.Prefab>();
                // 这里是假定资源提前加载了
                allocator.alloc(path);
            }
            let res = allocator.getAsset();
            let panel: Panel = null;

            if (res) {
                panelNode = UIUtils.instantiate(res);
                panel = panelNode.getComponent<Panel>(Panel);
                if (panel) {
                    panel.resPath = path;
                    return panel;
                }
                else {
                    throw new Error(`make sure ${path} is a panel`)
                    // return null;
                }
            }
            else {
                throw new Error("ensure the panel res has been loaded:" + path);
            }
        }
    }

    /**面板弹出次数记录 */
    private panelPopRecord: { [name: string]: { count: number } } = {};
    public getPanelPopRecord(): { [name: string]: { count: number } } {
        return this.panelPopRecord;
    }

    /**重置面板弹出次数 */
    private resetPanelPopRecord() {
        this.panelPopRecord = {};
    }

    /**面板弹出信号 */
    get panelPopSignal(): PanelPopSignal {
        if (!this._panelPopSignal) this._panelPopSignal = new PanelPopSignal();
        return this._panelPopSignal;
    }
    private _panelPopSignal: PanelPopSignal;

    /**
     * 统计面板的弹出
     * @param resPath 面板资源路径
     */
    private panelPopCount(resPath: string) {
        if (this.panelPopRecord[resPath]) {
            this.panelPopRecord[resPath].count += 1;
        }
        else {
            this.panelPopRecord[resPath] = { count: 1 };
        }
        this.panelPopSignal.dispatch(resPath);
    }
}
