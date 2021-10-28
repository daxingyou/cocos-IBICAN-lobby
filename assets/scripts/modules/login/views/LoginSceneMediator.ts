import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import LoginScene from "./LoginScene";
import AssetsServer from "../../../../libs/common/scripts/modules/assets/servers/AssetsServer";
import HotUpdateTask from "../../../../libs/common/scripts/modules/assets/tasks/HotUpdateTask";
import LobbyLoginServer from "../servers/LobbyLoginServer";
import GetUpdateNoticeTask from "../tasks/GetUpdateNoticeTask";
import HotUpdatePanel from "../../assets/views/HotUpdatePanel";
import { BaseAlertResult } from "../../../../libs/common/scripts/modules/tips/models/BaseAlertInfo";
import ShowLoginPanelSignal from "../../../../libs/common/scripts/modules/login/signals/ShowLoginPanelSignal";
import BaseLoginPanel from "../../../../libs/common/scripts/modules/login/views/BaseLoginPanel";
import ChangeSceneSignal from "../../../../libs/common/scripts/modules/scene/signals/changeSceneSignal";
import SceneNames from "../../../../libs/common/scripts/modules/scene/models/SceneNames";
import LobbyReadyCommand from "../../start/LobbyReadyCommand";
import QuicklyLoginSignal from "../signals/QuicklyLoginSignal";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import CompactPanel from "./CompactPanel";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import LoginServer from "../../../../libs/common/scripts/modules/login/servers/LoginServer";
import OnLoginSuccessSignal from "../../../../libs/common/scripts/modules/login/signals/OnLoginSuccessSignal";
import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import LobbySoundChannels from "../../sound/LobbySoundChannels";
import JPAudio from "../../../../libs/common/scripts/utils/JPAudio";
import StopMusicSignal from "../../../../libs/common/scripts/modules/sound/signals/StopMusicSignal";
import Constants from "../../../../libs/common/scripts/Constants";
import LobbyConstants from "../../../LobbyConstants";
import AssetsModel from "../../../../libs/common/scripts/modules/assets/models/AssetsModel";
import NativeUtils from "../../../../libs/native/NativeUtils";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class LoginSceneMediator extends JPMediator {

    @riggerIOC.inject(LoginScene)
    protected loginScene: LoginScene;

    @riggerIOC.inject(AssetsServer)
    private assetsServer: AssetsServer;

    @riggerIOC.inject(AssetsModel)
    private assetsModel: AssetsModel;

    @riggerIOC.inject(LoginServer)
    private loginServer: LobbyLoginServer;

    @riggerIOC.inject(QuicklyLoginSignal)
    private quicklyLoginSignal: QuicklyLoginSignal;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;


    @riggerIOC.inject(LobbySoundChannels.LOBBY_BEAUTY_SPEAKING)
    private lobbyBeautySpeaking: JPAudio;

    @riggerIOC.inject(StopMusicSignal)
    private stopMusicSignal: StopMusicSignal;

    @riggerIOC.inject(Constants)
    private lobbyConstants: LobbyConstants;

    // @riggerIOC.inject(MakeSureInstallMetaTask)
    // private makeSureInstallMetaTask: MakeSureInstallMetaTask; 

    onInit(): void {
    }

    async onShow() {
        NativeUtils.setOrientation(1);
        this.stopMusicSignal.dispatch();
        this.lobbyBeautySpeaking.stop();
        this.addEventListener();
        this.loginScene.comfirmPolicyToggle.check();
        this.loginScene.switchHotUpdate();

        // cc.log(`login scene mediator show`)
        this.loginScene.showTips("正在检查更新");

        // 首先确保安装元数据(还有BUG，暂时取消)
        // let installRet = await this.assetsServer.makeSureInstallMetaCorrect().wait();
        // if(installRet.isOk){
        //     if(installRet.result){
        //         this.afterHotUpdate();
        //         return;
        //     }
        // }
        // else{
        //     throw new Error("make sure install meta task failed:" + installRet.reason);
        // }

        let version: string = this.assetsModel.version;
        // cc.log(`local version:${version}`);
        let envStr: string = this.lobbyConstants.env == "" ? "" : `${this.lobbyConstants.env}-`;
        this.loginScene.versionTxt.string = `${envStr}v${version}`;

        // 向服务器请求版本对应的公告
        let noticeTask: GetUpdateNoticeTask = this.loginServer.requestUpdateNotice(version);
        let notice = await noticeTask.wait();
        // cc.log(`notice:${notice}`);
        // 显示更新提示界面,由用户选择是否更新
        if (notice.isOk) {
            let panel: HotUpdatePanel = HotUpdatePanel.show(notice.result.updateContent);
            let choice: BaseAlertResult = await panel.wait();
            switch (choice) {
                case BaseAlertResult.YES:
                    this.hotUpdate();
                    break;
                default:
                    cc.game.end();
            }
        }
        else {
            this.hotUpdate();
        }
    }

    onHide() {
        this.removeEventListener();
    }

    protected async hotUpdate() {
        if (!this.loginScene.enableHotUpdate) {
            return this.allReady();
        }

        // 检查版本文件
        let checkTask: HotUpdateTask = this.assetsServer.checkHotUpdate();
        if (!checkTask) return this.allReady();
        let ret = await checkTask.wait();
        if (jsb.EventAssetsManager.NEW_VERSION_FOUND == ret.result) {
            // let info: BaseAlertInfo = new BaseAlertInfo();
            // info.content = `有内容需要更新:${checkTask.totalFiles} files, ${checkTask.totalBytes} bytes`;
            // info.style = BaseAlertStyle.YES;
            // let panel: BaseAlertPanel = BaseAlertPanel.show(info);
            // await panel.wait();
            this.doHotUpdate();
        }
        else {
            return this.allReady();
        }
    }

    protected async doHotUpdate() {
        this.loginScene.showTips("开始更新");
        let sp: string[] = jsb.fileUtils.getSearchPaths();
        let updateTask: HotUpdateTask = this.assetsServer.startHotUpdate();
        // 监听进度
        updateTask.onProgreess(this, this.onHotUpdateProgression);
        let ret = await updateTask.wait();
        // 取消进度监听
        updateTask.offProgreess(this, this.onHotUpdateProgression);
        if (ret.isOk) {
            this.loginScene.showTips("更新完成");
            // let alertInfo: BaseAlertInfo = new BaseAlertInfo();
            // alertInfo.style = BaseAlertStyle.YES;
            // alertInfo.content = `更新完成\npath len :${ret.length}\nnew search pathes:${ret}`;
            // let panel: BaseAlertPanel = BaseAlertPanel.show(alertInfo);
            // await panel.wait();
            this.afterHotUpdate();
        }
        else {
            cc.game.end();
        }


    }

    protected afterHotUpdate() {
        cc.audioEngine.stopAll();
        cc.game.restart();
    }

    protected allReady() {
        this.loginScene.switchReady();
    }

    protected onHotUpdateProgression(task: HotUpdateTask) {
        this.loginScene.showTips(`正在更新：${(task.progress * 100).toFixed(4)}%`);
        this.loginScene.progressBar.progress = task.progress;
    }

    @riggerIOC.inject(ShowLoginPanelSignal)
    private showLoginPanelSignal: ShowLoginPanelSignal;

    @riggerIOC.inject(ChangeSceneSignal)
    private changeSceneSignal: ChangeSceneSignal;

    @riggerIOC.inject(OnLoginSuccessSignal)
    private onLoginSuccessSignal: OnLoginSuccessSignal;

    protected async onClickMobileLogin() {
        if (this.loginScene.comfirmPolicyToggle.isChecked == false) {
            this.pushTipsQueueSignal.dispatch('使用本游戏前，请勾选同意下方的用户协议');
            return;
        }
        this.onLoginSuccessSignal.on(this, this.onLoginSuccess);
        let panel: BaseLoginPanel = BaseLoginPanel.show();
        // let ret = await panel.wait();
        // if (ret) {
        //     // 进入主场景
        //     // BaseWaitingPanel.show("正在进入游戏");
        //     this.changeSceneSignal.dispatch([SceneNames.MainScene, null, new LobbyReadyCommand()])
        // }
    }

    private onQuickLogin(): void {
        if (this.loginScene.comfirmPolicyToggle.isChecked == false) {
            this.pushTipsQueueSignal.dispatch('使用本游戏前，请勾选同意下方的用户协议');
            return;
        }
        this.onLoginSuccessSignal.on(this, this.onLoginSuccess);
        this.quicklyLoginSignal.dispatch();
    }

    private onLoginSuccess() {
        cc.log(`loginScene onLoginSuccess`);
        this.onLoginSuccessSignal.off(this, this.onLoginSuccess);
        UIManager.instance.showPanel(BaseWaitingPanel, LayerManager.tipsLayerName, false, ["进入大厅"]);
        this.changeSceneSignal.dispatch([SceneNames.MainScene, null, new LobbyReadyCommand()])
    }

    private onReadPolicyBtnClick(): void {
        UIManager.instance.showPanel(CompactPanel, LayerManager.uiLayerName, false);
    }

    protected addEventListener(): void {
        this.loginScene.mobileLoginBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickMobileLogin, this);
        this.loginScene.quickLoginBtn.node.on(cc.Node.EventType.TOUCH_END, this.onQuickLogin, this);
        this.loginScene.readPolicyBtn.node.on('click', this.onReadPolicyBtnClick, this);
    }

    protected removeEventListener(): void {
        this.loginScene.mobileLoginBtn.node.off(cc.Node.EventType.TOUCH_END, this.onClickMobileLogin, this);
        this.loginScene.quickLoginBtn.node.off(cc.Node.EventType.TOUCH_END, this.onQuickLogin, this);
        this.loginScene.readPolicyBtn.node.off('click', this.onReadPolicyBtnClick, this);
    }
}
