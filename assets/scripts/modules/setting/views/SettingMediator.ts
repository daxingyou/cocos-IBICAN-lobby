import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import SettingPanel from "./SettingPanel";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import ExitLoginSignal from "../../login/signals/ExitLoginSignal";
import SoundModel from "../../../../libs/common/scripts/modules/sound/models/SoundModel";
import OnUserInfoUpdateSignal from "../../../../libs/common/scripts/modules/user/signals/OnUserInfoUpdateSignal";

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

export default class SettingMediator extends JPMediator {
    @riggerIOC.inject(SettingPanel)
    protected view: SettingPanel;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;

    @riggerIOC.inject(ExitLoginSignal)
    private exitLoginSignal: ExitLoginSignal;

    @riggerIOC.inject(SoundModel)
    private soundModel: SoundModel;

    @riggerIOC.inject(OnUserInfoUpdateSignal)
    private onUserInfoUpdateSignal: OnUserInfoUpdateSignal;

    private _init: boolean;

    constructor() {
        super();
    }

    onShow() {
        super.onShow();
        this.addProtocolListener();
        this.initInfo();
    }

    onHide() {
        super.onHide();
        this.removeProtocolListener();
    }

    onDispose() {
        super.onDispose();
    }

    addProtocolListener() {
        this.exitLoginSignal.on(this, this.onExitLogin);
        this.onUserInfoUpdateSignal.on(this, this.onUserInfoUpdate);
    }

    removeProtocolListener() {
        this.exitLoginSignal.off(this, this.onExitLogin);
        this.onUserInfoUpdateSignal.off(this, this.onUserInfoUpdate);
    }

    /**
     * 更新面板
     */
    initInfo() {
        let loginAccount: string = '未绑定';
        if (this.lobbyUserModel.self && this.lobbyUserModel.self.mobile) {
            loginAccount = `${this.lobbyUserModel.self.mobile.substring(0, 3)}****${this.lobbyUserModel.self.mobile.substring(this.lobbyUserModel.self.mobile.length - 4)}`;
        }

        this.view.setAccount(loginAccount);

        let musicSlider: number = this.soundModel.musicVolume;
        let soundSlider: number = this.soundModel.effectVolume;
        let musicToggle: boolean = this.soundModel.musicSwitch;
        let soundToggle: boolean = this.soundModel.effectSwitch;
        this.view.updateToggle(musicToggle, soundToggle);
        this.view.updateSlider(musicSlider, soundSlider);
    }

    /**
     * 退出登录
     */
    private onExitLogin() {
        this.view.setAccount('未登录');
    }

    /**
     * 玩家信息更新
     */
    private onUserInfoUpdate() {
        let loginAccount: string = '未绑定';
        if (this.lobbyUserModel.self && this.lobbyUserModel.self.mobile) {
            loginAccount = `${this.lobbyUserModel.self.mobile.substring(0, 3)}****${this.lobbyUserModel.self.mobile.substring(this.lobbyUserModel.self.mobile.length - 4)}`;
            this.view.setAccount(loginAccount);
        }
    }
}
