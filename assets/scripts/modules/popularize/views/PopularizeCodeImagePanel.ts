import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import QRcodeUI from "../../../utils/qrcode/QRcodeUI";
import ScreenShot from "../../../utils/screenShot/ScreenShot";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import PopularizeModel from "../model/PopularizeModel";
// import AsyncRefreshList from "../../../../libs/common/scripts/utils/refreshList/AsyncRefreshList";
// import BaseRefreshListTask from "../../../../libs/common/scripts/utils/refreshList/task/BaseRefreshListTask";
// import TestRefreshTask from "../../../../libs/common/scripts/utils/refreshList/task/testRefreshTask";

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
export default class PopularizeCodeImagePanel extends Panel {

    @property(cc.Node)
    private contentNode: cc.Node = null;

    @property(cc.Button)
    private saveCodeImageButton: cc.Button = null;

    @property(QRcodeUI)
    qRcodeUI: QRcodeUI = null;

    @property(ScreenShot)
    screenshot: ScreenShot = null;   

    @property(cc.Button)
    public closeBtn: cc.Button = null;
    @riggerIOC.inject(PopularizeModel)
    private popularizeModel: PopularizeModel;

    constructor() {
        super();
    }

    public onInit(): void {
        super.onInit();
    }

    public onShow(): void {
        super.onShow();
        this.addEventListener();
        this.initCodeImage();
    }

    public onHide(): void {
        super.onHide();
        this.removeEventListener();
    }

    public onDispose(): void {
        super.onDispose();
    }

    private initCodeImage(): void {
        this.qRcodeUI.init(this.popularizeModel.qrCodeUrl);
    }

    private closeWindow(): void {
        UIManager.instance.hidePanel(this);
    }

    private addEventListener(): void {
        this.closeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onCloseBtnClick, this);
        this.saveCodeImageButton.node.on("click", this.onSaveCodeImage, this);
    }

    private removeEventListener(): void {
        this.closeBtn.node.off(cc.Node.EventType.TOUCH_END, this.onCloseBtnClick);
        this.saveCodeImageButton.node.off("click", this.onSaveCodeImage, this);
    }

    private onSaveCodeImage(): void {
        let rect: cc.Rect = new cc.Rect(0, 0, 283, 540);
        let date: Date = new Date(rigger.service.TimeService.instance.serverTime);
        let fileName = this.getDateString(date) + ".png"
        this.screenshot.screenshotByNode(this.screenshot.node, rect, fileName, ()=>{
            this.onCloseBtnClick();
        });
    }

    private getDateString(date: Date): string {
        return date.getFullYear()
            + "_" + (date.getMonth() + 1)
            + "_" + date.getDate()
            + "--" + date.getHours()
            + "-" + date.getMinutes()
            + "-" + date.getSeconds()
    }

    /**关闭按钮 */
    private onCloseBtnClick(): void {
        this.closeWindow();
    }

}
