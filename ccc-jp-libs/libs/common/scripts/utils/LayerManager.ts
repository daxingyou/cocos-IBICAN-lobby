import Panel from "./Panel";
import UIManager from "./UIManager";
import JPTools from "./jpTools/JPTools";
import AssetsUtils from "./AssetsUtils";
import OnChangeSceneCompleteSignal from "../modules/scene/signals/OnChangeSceneCompleteSignal";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
/**
 * 层级管理器，实际上起到了场景管理器的作用，需要添加到每一个场景的顶层节点上
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class LayerManager extends cc.Component {

    @property(cc.Node)
    sceneLayer: Layer = null;

    @property(cc.Node)
    uiLayer: Layer = null;

    @property(cc.Node)
    tipsLayer: Layer = null;

    @property(cc.Node)
    marqueeLayer: Layer = null;

    public static readonly sceneLayerName: string = "sceneLayer";
    public static readonly uiLayerName: string = "uiLayer";
    public static readonly tipsLayerName: string = "tipsLayer";
    public static readonly marqueeLayerName: string = "marqueeLayer";

    public static get jpTools(): cc.Node {
        return cc["$jp_tools"];
    }
    public static set jpTools(tools: cc.Node) {
        if (!CC_DEBUG) return;
        cc["$jp_tools"] = tools;
    }

    public static get nowSceneLayer(): Layer {
        return LayerManager.activeInstance.sceneLayer;
    }

    public static get nowUILayer(): Layer {
        return LayerManager.activeInstance.uiLayer;
    }

    public static get nowTipsLayer(): Layer {
        return LayerManager.activeInstance.tipsLayer;
    }

    public static get nowMarqueeLayer(): Layer {
        return LayerManager.activeInstance.marqueeLayer;
    }

    public static addToLayer(obj: cc.Node, layerOrIdOrName: string | number | Layer): void {
        let layer: Layer = LayerManager.getLayer(layerOrIdOrName);
        if (obj.parent == layer) {
            obj.setSiblingIndex(layer.childrenCount - 1);
        }
        else {
            obj.removeFromParent(false);
            layer.addChild(obj);
        }
    }

    public static getLayer(layerIdOrName: string | number | Layer): Layer {
        if (layerIdOrName instanceof cc.Node) return layerIdOrName;

        switch (layerIdOrName) {
            case LayerManager.sceneLayerName:
                return LayerManager.nowSceneLayer;
            case LayerManager.uiLayerName:
                return LayerManager.nowUILayer;
            case LayerManager.tipsLayerName:
                return LayerManager.nowTipsLayer;
            case LayerManager.marqueeLayerName:
                return LayerManager.nowMarqueeLayer;
            // 自定义层级后面实现
            default:
                return null;
        }
    }

    /**
     * 隐藏指定层上所有的面板
     * @param layerOrNameOrId 
     */
    public static hideAllPanels(layerOrNameOrId: string | number | Layer): void {
        let layer: Layer = this.getLayer(layerOrNameOrId);
        let children: cc.Node[] = layer.children;
        let panel: Panel;
        for (let i: number = children.length - 1; i >= 0;) {
            panel = children[i].getComponent<Panel>(Panel);
            if (panel && !panel.ignoreCloseOther) {
                UIManager.instance.unattachBackBlockingPanel(panel);
                panel.hide();
                return LayerManager.hideAllPanels(layerOrNameOrId);
            }
            else {
                i--;
            }
        }
        children = null;
    }

    // public static beforeChaneScene(): void {
    // if(!CC_DEBUG) return;
    // LayerManager.jpTools && LayerManager.jpTools.removeFromParent(); 
    // }

    // public static afterChangeScene(): void {
    // if(!CC_DEBUG) return;
    // if(LayerManager.jpTools){
    //     LayerManager.addToLayer(LayerManager.jpTools, LayerManager.tipsLayerName);
    // }
    // }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    protected static get activeInstance(): LayerManager {
        return cc["$activeSceneInstance"];
    }

    protected static set activeInstance(layerManager: LayerManager) {
        cc["$activeSceneInstance"] = layerManager;
    }

    private deps: string[];
    @riggerIOC.inject(OnChangeSceneCompleteSignal)
    private onChangeSceneCompleteSignal: OnChangeSceneCompleteSignal;
    // private sceneName: string;
    start() {
        LayerManager.activeInstance = this;

        if (CC_DEBUG) {
            if (!LayerManager.jpTools) {
                let jpTools: cc.Node = LayerManager.jpTools = this.node.parent.getChildByName("jpTools");
                if (jpTools) {
                    jpTools.active = true;
                    cc.game.addPersistRootNode(LayerManager.jpTools);
                    jpTools.addComponent(JPTools);
                }
            }
        }

        let scene: cc.Scene = cc.director.getScene();
        // this.sceneName = scene.name;
        // cc.log(`enter scene:${this.sceneName}`)
        this.deps = scene["dependAssets"];
        // cc.log(`scene deps:${this.deps.toString()}`);
        AssetsUtils.updateRefCount(this.deps, 1);

        let sceneName: string = cc.director.getScene().name;
        if ("testReScene" !== sceneName)
            this.onChangeSceneCompleteSignal.dispatch(cc.director.getScene().name);

    }

    // @riggerIOC.inject(Assets)
    onDestroy(): void {
        this.onChangeSceneCompleteSignal = null;
        AssetsUtils.updateRefCount(this.deps, -1);
    }
}

export type Layer = cc.Node;
