import LayerManager, { Layer } from "./LayerManager"
import UIManager from "./UIManager";
import Panel from "./Panel";


// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BackBlockingPanel extends Panel {

    /**
     * 面板栈，用于面板关闭时恢复遮挡板状态 
     */
    private panels: Panel[] = [];
    onInit() {
        // this.panels = [];
        this.needPopup = false;
        this.ignoreCloseOther = true;
    }

    onDispose(): void {
        this.panels = null;
        // 未直接调用 UIManager.instance.resetBackBlockingPanel()
        // 因为相互引用会引发异常
        cc["$_backBlockingPanel"] = null;
        super.onDispose();
    }

    attach(layerOrNameOrId: number | string | Layer, panel: Panel): void {
        if (!panel) return;
        if (!panel.needBlockOther) return;
        if (layerOrNameOrId == null || layerOrNameOrId == undefined) return;
        this.panels.push(panel);
        if (layerOrNameOrId instanceof cc.Node) {
            if (layerOrNameOrId !== this.node.parent) {
                this.node.removeFromParent(false);
                layerOrNameOrId.addChild(this.node);
            }
        }
        else {
            LayerManager.addToLayer(this.node, layerOrNameOrId);
        }

        // 设置层级
        this.node.setSiblingIndex(panel.node.getSiblingIndex());

    }

    unattach(panel: Panel): void {
        let len: number = this.panels.length;
        if (len <= 0) return;
        if (this.panels[len - 1] == panel) {
            this.panels.pop();
            this.tryAttachNext();
        }
    }

    hide(): void {
        if (!this.node) return;
        // 移除
        this.node.parent.removeChild(this.node, true);
    }

    private tryAttachNext(): void {
        if (this.panels.length <= 0) {
            this.hide();
            return;
        }
        let panel: Panel = this.panels.pop();
        this.attach(panel.node.parent, panel);
    }

}
