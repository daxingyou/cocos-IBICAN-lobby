import BaseWaitingContentView from "./BaseWaitingContentView";
import Task from "../../../utils/Task";
import UIManager from "../../../utils/UIManager";
import LayerManager from "../../../utils/LayerManager";
import { TipsInfo } from "../models/TipsInfo";
import Panel from "../../../utils/Panel";
import UIUtils from "../../../utils/UIUtils";

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
export default class BaseWaitingPanel extends Panel {

    public static show(content: TipsInfo, task?: Task): BaseWaitingPanel {
        if(BaseWaitingPanel.waittingPanel) {
            UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
            BaseWaitingPanel.waittingPanel = null;
        }
        BaseWaitingPanel.waittingPanel = UIManager.instance.showPanel(BaseWaitingPanel, LayerManager.tipsLayerName, false, [content, task]) as BaseWaitingPanel;
        return BaseWaitingPanel.waittingPanel;
    }

    public static waittingPanel: BaseWaitingPanel;

    @property(cc.Prefab)
    protected template: cc.Prefab = null;

    protected contentView: BaseWaitingContentView = null;

    onLoad(){
        super.onLoad();
        this.needPopup = false;
    }
    
    public setContent(cont: string) {
        // cc.log(`set contet in waiting panel`)
        if (!this.contentView) {
            this.initContentView();
            this.node.addChild(this.contentView.node);
        }
        this.contentView.node.active = true;
        this.contentView.setContent(cont);
    }

    protected initContentView(): void {
        if (!this.template) throw new Error("the template should not be null");
        let node: cc.Node = UIUtils.instantiate(this.template);
        if (!this.node) throw new Error("please make sure the template is valid");
        this.contentView = node.getComponent<BaseWaitingContentView>(BaseWaitingContentView);
        if (!this.contentView) throw new Error("please make sure the BaseWaitingContentView or it's child has been attached");
    }

}
