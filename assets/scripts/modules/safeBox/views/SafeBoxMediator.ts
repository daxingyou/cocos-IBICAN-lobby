import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import SafeBoxPanel from "./SafeBoxPanel";
import SafeBoxModel from "../models/SafeBoxModel";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LoginModel from "../../../../libs/common/scripts/modules/login/models/LoginModel";
import SafeBoxServer from "../servers/SafeBoxServer";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import OnUserInfoUpdateSignal from "../../../../libs/common/scripts/modules/user/signals/OnUserInfoUpdateSignal";
import { SoundUrlDefine } from "../../../../libs/common/scripts/modules/sound/SoundDefine";
import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import JPAudio from "../../../../libs/common/scripts/utils/JPAudio";
import LobbySoundChannels from "../../sound/LobbySoundChannels";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class SafeBoxMediator extends JPMediator {
    @riggerIOC.inject(SafeBoxPanel)
    protected view: SafeBoxPanel;

    /**保险箱数据模块 */
    @riggerIOC.inject(SafeBoxModel)
    private safeBoxModel: SafeBoxModel;

    /**玩家数据模块 */
    @riggerIOC.inject(UserModel)
    private userModel: LobbyUserModel;

    /**登录模块 */
    @riggerIOC.inject(LoginModel)
    private loginModel: LoginModel;

    @riggerIOC.inject(SafeBoxServer)
    private safeBoxServer: SafeBoxServer;

    @riggerIOC.inject(OnUserInfoUpdateSignal)
    private onUserInfoUpdateSignal: OnUserInfoUpdateSignal;

    @riggerIOC.inject(LobbySoundChannels.PANEL_POP_UP)
    private popupChannel: JPAudio;

    constructor() {
        super();
    }

    onInit() {
        super.onInit();
    }

    onShow() {
        super.onShow();
        this.addProtocolEventListener();
        this.initCoin();
        this.view.getMoneyToggle.check(); //初始化页面控制器
        this.view.getMoneyToggle.node.emit('toggle', this.view.getMoneyToggle);
        this.view.moneySlider.node.emit('slide', this.view.moneySlider);
    }

    onHide() {
        super.onHide();
        this.removeProtocolEventListener();
        this.popupChannel.stop();
    }

    onDispose() {
        super.onDispose();
    }

    addProtocolEventListener() {
        this.onUserInfoUpdateSignal.on(this, this.onUserInfoUpdate);
    }

    removeProtocolEventListener() {
        this.onUserInfoUpdateSignal.off(this, this.onUserInfoUpdate);
    }

    async initCoin() {
        let currentCoin: number = 0;
        let safeBoxCoin: number = 0;
        if(this.loginModel.isLogined) {
            currentCoin = this.userModel.self.balance;
        }
        
        BaseWaitingPanel.show("正在登录");
        let task = this.safeBoxServer.getSafeBoxCoinReq();
        let result = await task.wait();
        if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
        if(result.isOk) {
            safeBoxCoin = this.safeBoxModel.saveBoxCoin;
        }

        this.view.updateInfo(currentCoin, safeBoxCoin);
        // this.view.updateInfo(1000.5, 8888); //假数据
    }

    /**
     * 人物信息更新
     */
    private onUserInfoUpdate() {
        this.view.updateInfo(this.userModel.self.balance, this.safeBoxModel.saveBoxCoin);
    }
}
