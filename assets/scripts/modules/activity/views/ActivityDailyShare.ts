import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import ActivityServer from "../servers/ActivityServer";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import NativeUtils from "../../../../libs/native/NativeUtils";

import ActivityPanel, { page } from "./ActivityPanel";
import { url } from "inspector";


// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ActivityDailyShare extends Panel {
    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property(cc.Button)
    public wechatBtn: cc.Button = null;

    @property(cc.Button)
    public friendCircleBtn: cc.Button = null;

    @property(cc.Button)
    public qqBtn: cc.Button = null;

    @property(cc.Button)
    public qqSpaceBtn: cc.Button = null;

    @riggerIOC.inject(ActivityServer)
    private activityServer: ActivityServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    private shareData: shareWXWebData;

    onShow() {
        super.onShow();
        this.addEventListener();
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseBtnWindow, this);
        this.wechatBtn.node.on('click', this.onShareBtnClick, this);
        this.friendCircleBtn.node.on('click', this.onShareBtnClick, this);
        this.qqBtn.node.on('click', this.onShareBtnClick, this);
        this.qqSpaceBtn.node.on('click', this.onShareBtnClick, this);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnWindow, this);
        this.wechatBtn.node.off('click', this.onShareBtnClick, this);
        this.friendCircleBtn.node.off('click', this.onShareBtnClick, this);
        this.qqBtn.node.off('click', this.onShareBtnClick, this);
        this.qqSpaceBtn.node.off('click', this.onShareBtnClick, this);
    }

    private onShareBtnClick(btn: cc.Button) {
        switch(btn.node.name) {
            case "weixinBtn":
                this.share(0);
                break;
            case "pengyouquanBtn":
                this.share(1);
                break;
            case "qqBtn":
                break;
            case "qqkongjianBtn":
                break;
            default :
                break;
        }
    }

    private async share(type: number) {
        if(!NativeUtils.isInstallWx()) {
            this.pushTipsQueueSignal.dispatch('请先下载微信客户端');
        }
        else {
            if(!this.shareData) {
                let task = this.activityServer.getDailyShareLink();
                let result = await task.wait();
                if(result.isOk){
                    this.shareData = new shareWXWebData();
                    this.shareData.shareUrl = result.result.shareUrl;
                    this.shareData.title = result.result.shareTitle;
                    this.shareData.description = result.result.shareDescription;
                    this.shareData.imgBase64 = result.result.shareImage;
                }else{
                    cc.log(result.reason);
                }
            }
            NativeUtils.shareWebpageToWX(this.shareData.shareUrl, this.shareData.title, this.shareData.description, this.shareData.imgBase64, type);
            this.onSuccessShare(type + 1);
        }
    }

    private onCloseBtnWindow() {
        this.closeWindow();
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
        UIManager.instance.showPanel(ActivityPanel, LayerManager.uiLayerName,true,page.activity);
    }

    private async onSuccessShare(type: number){
        let task = this.activityServer.shareSuccessReq([this.shareData.shareUrl, type]);
        let result = await task.wait()  
        if(result.isOk){
            this.pushTipsQueueSignal.dispatch('分享成功！')
            // UIManager.instance.showPanel(GoldGainPanel, LayerManager.uiLayerName, false,1)
        }else{
            cc.log(result.reason)
        }
    }

    private uint8ArrayToBase64(uint8: Uint8Array): string {
        var CHUNK_SIZE = 0x8000; //arbitrary number
        var index = 0;
        var length = uint8.length;
        var result = '';
        var slice;
        while (index < length) {
          slice = uint8.subarray(index, Math.min(index + CHUNK_SIZE, length));
          result += String.fromCharCode.apply(null, slice);
          index += CHUNK_SIZE;
        }
        return btoa(result);
    }
}

export class shareWXWebData {
    public title: string;
    public description: string;
    public shareUrl: string;
    public imgBase64: string;
}