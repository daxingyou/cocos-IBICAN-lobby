import Panel from "../../../utils/Panel";
import WaitablePanel from "../../../utils/WaitablePanel";
import BaseAlertInfo, { BaseAlertResult, BaseAlertStyle } from "../models/BaseAlertInfo";
import UIManager from "../../../utils/UIManager";
import LayerManager from "../../../utils/LayerManager";

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
/**
 * 一个警告/提示面板
 * let panel: BaseAlertPanel = BaseAlertPanel.show(new BaseAlertInfo());
 * let ret: BaseAlertResult = await panel.wait();
 */
@ccclass
export default class BaseAlertPanel extends WaitablePanel {
    @property({ type: cc.Button, displayName: "确定按钮" })
    yesBtn: cc.Button = null;

    @property({ type: cc.Button, displayName: "取消按钮" })
    noBtn?: cc.Button = null;

    @property({ type: cc.Button, displayName: "关闭按钮" })
    closeBtn?: cc.Button = null;

    @property({ displayName: "当显示两个按钮时，确定按钮的位置" })
    yesBtnPos: cc.Vec2 = new cc.Vec2(0, 0);

    @property({ displayName: "当显示两个按钮时，取消按钮的位置" })
    noBtnPos: cc.Vec2 = new cc.Vec2(0, 0);

    @property({ displayName: "当显示一按钮时，取消按钮的位置" })
    yesBtnPos2: cc.Vec2 = new cc.Vec2(0, 0);

    @property({ type: cc.Label, displayName: "标题标签" })
    titleLabel?: cc.Label = null;

    @property({ type: cc.Label, displayName: "内容标签" })
    contentLabel?: cc.Label = null;

    public static show(info: BaseAlertInfo, layer: string = LayerManager.uiLayerName, closeOther: boolean = true): BaseAlertPanel {
        return UIManager.instance.showPanel(BaseAlertPanel, layer, closeOther, info) as BaseAlertPanel;
    }

    public static hide(panel: BaseAlertPanel):void{
        UIManager.instance.hidePanel(panel);
    }

    onShow(): void {
        this.addEventListener();
    }

    onHide(): void {
        this.reset();
        this.removeEventListener();
    }

    onExtra(info?: BaseAlertInfo): void {
        if (!info) return;
        this.updateContent(info);
    }

    public done(ret: BaseAlertResult): void {
        super.done(ret);
    }

    public wait(): Promise<BaseAlertResult> {
        return super.wait();
    }

    protected updateContent(info: BaseAlertInfo): void {
        this.titleLabel && (this.titleLabel.string = info.title);
        this.contentLabel && (this.contentLabel.string = info.content);

        this.updateStyle(info);
    }

    protected updateStyle(info: BaseAlertInfo): void {
        switch (info.style) {
            case BaseAlertStyle.YES_NO:
                this.yesBtn.node.position = this.yesBtnPos;
                this.yesBtn.node.active = true;
                if (this.noBtn) {
                    this.noBtn.node.active = true;
                    this.noBtn.node.position = this.noBtnPos;
                }
                break;
            case BaseAlertStyle.YES:
                this.yesBtn.node.position = this.yesBtnPos2;
                this.yesBtn.node.active = true;
                if (this.noBtn) {
                    this.noBtn.node.active = false;
                }
                break;
            default:
                break;
        }
    }

    protected addEventListener(): void {
        this.yesBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickYesBtn, this);
        this.noBtn && this.noBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickNoBtn, this);
        this.closeBtn && this.closeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickCloseBtn, this);
    }

    protected removeEventListener(): void {
        this.yesBtn.node.off(cc.Node.EventType.TOUCH_END, this.onClickYesBtn, this);
        this.noBtn && this.noBtn.node.off(cc.Node.EventType.TOUCH_END, this.onClickNoBtn, this);
        this.closeBtn && this.closeBtn.node.off(cc.Node.EventType.TOUCH_END, this.onClickCloseBtn, this);
    }

    protected onClickYesBtn(): void {
        this.done(BaseAlertResult.YES);
        this.closeSelf();
    }

    protected onClickNoBtn(): void {
        this.done(BaseAlertResult.NO);
        this.closeSelf();
    }

    protected onClickCloseBtn(): void {
        this.done(BaseAlertResult.NO);
        this.closeSelf();
    }

    protected closeSelf(): void {
        UIManager.instance.hidePanel(this);
    }

}
