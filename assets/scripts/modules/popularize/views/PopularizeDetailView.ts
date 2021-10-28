import JPView from "../../../../libs/common/scripts/utils/JPView";
import StartPopularizeUpgradeUserSignal from "../signals/StartPopularizeUpgradeUserSignal";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import OnUserInfoUpdateSignal from "../../../../libs/common/scripts/modules/user/signals/OnUserInfoUpdateSignal";
import UIUtils from "../../../../libs/common/scripts/utils/UIUtils";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import NativeUtils from "../../../../libs/native/NativeUtils";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import SwitchHallSignal from "../../../../libs/common/scripts/signals/SwitchHallSignal";
import QRcodeUI from "../../../utils/qrcode/QRcodeUI";
import ActivityServer from "../../activity/servers/ActivityServer";
import NativeFileUtils from "../../../../libs/native/NativeFileUtils";
import { shareWXWebData } from "../../activity/views/ActivityDailyShare";
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
export default class PopularizeDetailView extends JPView {
    @property([cc.Prefab])
    contentPrefab: cc.Prefab[] = [];

    @property(cc.Button)
    private wxBtn: cc.Button = null;

    @property(cc.Button)
    private pyqBtn: cc.Button = null;

    @property(cc.Button)
    private qqBtn: cc.Button = null;

    @property(cc.Button)
    private qqSpaceBtn: cc.Button = null;

    private currentContentNode: cc.Node = null;

    readonly contentType: any = { Freeze: 0, Detail: 1 }
    private _currentContentType: number = null;

    @riggerIOC.inject(StartPopularizeUpgradeUserSignal)
    private startPopularizeUpgradeUserSignal: StartPopularizeUpgradeUserSignal;

    @riggerIOC.inject(OnUserInfoUpdateSignal)
    private onUserInfoUpdateSignal: OnUserInfoUpdateSignal;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(ActivityServer)
    private activityServer: ActivityServer;

    private shareData: shareWXWebData;

    constructor() {
        super();
    }

    onInit() {
        super.onInit();
    }

    onDispose() {
        super.onDispose();
    }

    onShow() {
        // super.onShow();
        this.addEventListener();
        this.showContentNode();
    }

    private showContentNode() {
        let contentType: number = this.contentType.Detail;
        if (this._currentContentType == contentType) return;
        this._currentContentType = contentType;
        if (this.currentContentNode) {
            this.currentContentNode.destroy()
            this.currentContentNode = null;
        };
        this.currentContentNode = UIUtils.instantiate(this.contentPrefab[this._currentContentType]);
        if (this.currentContentNode) {
            this.node.addChild(this.currentContentNode)
        };
    }

    private addEventListener(): void {
        this.startPopularizeUpgradeUserSignal.on(this, this.showContentNode);
        this.onUserInfoUpdateSignal.on(this, this.showContentNode);
        this.wxBtn.node.on("click", this.onShareBtnClick, this);
        this.pyqBtn.node.on("click", this.onShareBtnClick, this);
        this.qqBtn.node.on("click", this.onShareBtnClick, this);
        this.qqSpaceBtn.node.on("click", this.onShareBtnClick, this);
    }

    private removeEventListener(): void {
        this.startPopularizeUpgradeUserSignal.off(this, this.showContentNode);
        this.onUserInfoUpdateSignal.off(this, this.showContentNode);
        this.wxBtn.node.off("click", this.onShareBtnClick, this);
        this.pyqBtn.node.off("click", this.onShareBtnClick, this);
        this.qqBtn.node.off("click", this.onShareBtnClick, this);
        this.qqSpaceBtn.node.off("click", this.onShareBtnClick, this);
    }

    public onHide(): void {
        // super.onHide();
        this.removeEventListener();
    }

    private onShareBtnClick(btn: cc.Button) {
        switch(btn.node.name) {
            case "weixinBtn":
                this.shareToWX(0);
                break;
            case "pengyouquanBtn":
                this.shareToWX(1);
                break;
            case "qqBtn":
                break;
            case "qqkongjianBtn":
                break;
            default :
                break;
        }
    }

    /**
     * 分享到微信
     * @param type 0- 对话 1-朋友圈 
     */
    private async shareToWX(type: number) {
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

    private async onSuccessShare(type: number){
        let task = this.activityServer.shareSuccessReq([this.shareData.shareUrl, type]);
        let result = await task.wait()  
        if(result.isOk){
            this.pushTipsQueueSignal.dispatch('分享成功！')
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
