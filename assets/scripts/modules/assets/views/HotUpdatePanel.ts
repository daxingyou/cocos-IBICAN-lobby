import WaitablePanel from "../../../../libs/common/scripts/utils/WaitablePanel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager, { Layer } from "../../../../libs/common/scripts/utils/LayerManager";
import { BaseAlertResult } from "../../../../libs/common/scripts/modules/tips/models/BaseAlertInfo";

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
export default class HotUpdatePanel extends WaitablePanel {
    @property(cc.Button)
    public updateBtn: cc.Button = null;

    @property(cc.Button)
    public cancelBtn: cc.Button = null;

    @property(cc.RichText)
    public content: cc.RichText = null;

    public static show(notice, layer:string | number | Layer = LayerManager.uiLayerName, ifClose:boolean = true): HotUpdatePanel {
        return UIManager.instance.showPanel(HotUpdatePanel, layer, ifClose, notice) as HotUpdatePanel;
    }

    onShow(){
        cc.log(`now show hot update panel`)
        this.updateBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickUpdate, this);
        this.cancelBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickCancel, this);
    }

    onHide(){
        cc.log(`now hide hot update panel`)
        this.updateBtn.node.off(cc.Node.EventType.TOUCH_END, this.onClickUpdate, this);
        this.cancelBtn.node.off(cc.Node.EventType.TOUCH_END, this.onClickCancel, this);
    }

    onExtra(notice:string){
        cc.log(`hot update extra`)
        this.content.string = notice;
        cc.log(`after set content`)
    }

    private onClickUpdate(){
        this.done(BaseAlertResult.YES);
        UIManager.instance.hidePanel(this);
    }

    private onClickCancel(){
        this.done(BaseAlertResult.NO);
        UIManager.instance.hidePanel(this);
    }

}
