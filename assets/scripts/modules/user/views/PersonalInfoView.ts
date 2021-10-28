import JPView from "../../../../libs/common/scripts/utils/JPView";
import LobbyUserServer from "../servers/LobbyUserServer";
import ShowChangePwdPanelSignal from "../../../common/signals/ShowChangePwdPanelSignal";
import LoginModel from "../../../../libs/common/scripts/modules/login/models/LoginModel";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../model/LobbyUserModel";
import ShowRechargePanelByUserCenterSingal from "../signals/ShowRechargePanelByUserCenterSingal";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import BaseUserInfo from "../../../../libs/common/scripts/modules/user/models/BaseUserInfo";
import LobbyUserInfo from "../model/LobbyUserInfo";
import ChangePwdPanelTips from "../../../common/structurals/ChangePwdPanelTips";
import BindPhonePanel from "../../giftBox/view/BindPhonePanel";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import ChangeNicknamePanel from "./ChangeNicknamePanel";
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

const {ccclass, property} = cc._decorator;

@ccclass
export default class PersonalInfoView extends JPView {
    @property(cc.Button)
    public lastHeadSelectBtn: cc.Button = null;

    @property(cc.Button)
    public nextHeadSelectBtn: cc.Button = null;

    @property(cc.Sprite)
    public currentSelectHead: cc.Sprite = null;

    @property(cc.Button)
    public headSelectConfirmBtn: cc.Button = null;

    @property(cc.Button)
    public changePwdBtn: cc.Button = null;

    @property(cc.Button)
    public copyIdBtn: cc.Button = null;

    @property(cc.Button)
    public editNameBtn: cc.Button = null;

    @property(cc.Button)
    public bindPhoneBtn: cc.Button = null;

    @property(cc.Button)
    public rechargeBtn: cc.Button = null;

    @property(cc.Label)
    public idTxt: cc.Label = null;

    @property(cc.Label)
    public nameTxt: cc.Label = null;

    @property(cc.Label)
    public phoneNumberTxt: cc.Label = null;

    @property(cc.Label)
    public coinLabel: cc.Label = null;

    @property([cc.SpriteFrame])
    public headSpriteFrames: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    public headSelectBtnSpriteFrames: cc.SpriteFrame[] = [];

    @riggerIOC.inject(LobbyUserServer)
    private userServer: LobbyUserServer;

    @riggerIOC.inject(ShowChangePwdPanelSignal)
    private showChangePwdPanelSignal: ShowChangePwdPanelSignal;

    @riggerIOC.inject(LoginModel)
    private loginModel: LoginModel;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;

    @riggerIOC.inject(ShowRechargePanelByUserCenterSingal)
    private showRechargePanelByUserCenterSingal:ShowRechargePanelByUserCenterSingal;
    constructor() {
        super();
    }

    onInit() {
        super.onInit();
    }

    onShow() {
        super.onShow();
        this.addEventListener();
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
    }

    onDispose() {
        super.onDispose();
    }

    addEventListener() {
        this.lastHeadSelectBtn.node.on('click', this.onSwitchHeadBtnClick, this);
        this.nextHeadSelectBtn.node.on('click', this.onSwitchHeadBtnClick, this);
        this.changePwdBtn.node.on('click', this.onchangePwdBtnClick, this);
        this.headSelectConfirmBtn.node.on('click', this.onHeadSelectConfirmClick, this);
        this.editNameBtn.node.on('click', this.onEditNameBtnClick, this);
        this.bindPhoneBtn.node.on('click', this.onBindPhoneBtnClick, this);
        this.rechargeBtn.node.on('click', this.onChargeBtnClick, this);
        this.copyIdBtn.node.on('click', this.onCopyIdBtnClick, this);
    }

    removeEventListener() {
        this.lastHeadSelectBtn.node.off('click', this.onSwitchHeadBtnClick, this);
        this.nextHeadSelectBtn.node.off('click', this.onSwitchHeadBtnClick, this);
        this.changePwdBtn.node.off('click', this.onchangePwdBtnClick, this);
        this.headSelectConfirmBtn.node.off('click', this.onHeadSelectConfirmClick, this);
        this.editNameBtn.node.off('click', this.onEditNameBtnClick, this);
        this.bindPhoneBtn.node.off('click', this.onBindPhoneBtnClick, this);
        this.rechargeBtn.node.off('click', this.onChargeBtnClick, this);
        this.copyIdBtn.node.off('click', this.onCopyIdBtnClick, this);
    }

    private onChargeBtnClick():void
    {
        this.showRechargePanelByUserCenterSingal.dispatch();
        //UIManager.instance.showPanel(RechargePanel, LayerManager.uiLayerName, false);
    }

    /**
     * 更新数据
     * @param info 
     */
    public updateInfo(info: BaseUserInfo) {
        let changNicknameTime = (this.lobbyUserModel.self as LobbyUserInfo).modifyNicknameCount;
        if(changNicknameTime >= 1) this.editNameBtn.node.active = false;

        this.currentHeadIndex = Number(info.icon);
        this.idTxt.string = info.userId + '';
        this.nameTxt.string = info.nickName + '';
        this.coinLabel.string = info.balance + '';
        if(!info.mobile) {
            this.phoneNumberTxt.string = '未绑定';
            this.phoneNumberTxt.node.color = new cc.Color().fromHEX("#FEF9E4");
            this.bindPhoneBtn.node.active = true;
        }
        else {
            this.bindPhoneBtn.node.active = false;
            this.phoneNumberTxt.node.color = new cc.Color().fromHEX("#FEF9E4");
            this.phoneNumberTxt.string = `${info.mobile.substring(0, 3)}****${info.mobile.substring(info.mobile.length - 4)}`;
        }
    }

    get currentHeadIndex(): number {return this._currentHeadIndex;}
    set currentHeadIndex(index: number) {
        if(index >= 6) index = 6;
        if(index <= 1) index = 1;
        this._currentHeadIndex = index;
        this.currentSelectHead.spriteFrame = this.headSpriteFrames[index - 1];

        let lastHeadSelectBtnBg = cc.find('Background', this.lastHeadSelectBtn.node);
        let nextHeadSelectBtnBg = cc.find('Background', this.nextHeadSelectBtn.node);
        //初始化
        lastHeadSelectBtnBg.getComponent(cc.Sprite).spriteFrame = this.headSelectBtnSpriteFrames[1]
        this.lastHeadSelectBtn.node.scaleX = -Math.abs(this.lastHeadSelectBtn.node.scaleX);
        this.lastHeadSelectBtn.interactable = true;
        nextHeadSelectBtnBg.getComponent(cc.Sprite).spriteFrame = this.headSelectBtnSpriteFrames[1];
        this.nextHeadSelectBtn.node.scaleX = Math.abs(this.nextHeadSelectBtn.node.scaleX);
        this.nextHeadSelectBtn.interactable = true;

        if(index == 1) {
            //左边已无头像浏览
            lastHeadSelectBtnBg.getComponent(cc.Sprite).spriteFrame = this.headSelectBtnSpriteFrames[0]
            this.lastHeadSelectBtn.node.scaleX = Math.abs(this.lastHeadSelectBtn.node.scaleX);
            this.lastHeadSelectBtn.interactable = false;
        }
        if(index == 6) {
            //右边已无头像浏览
            nextHeadSelectBtnBg.getComponent(cc.Sprite).spriteFrame = this.headSelectBtnSpriteFrames[0];
            this.nextHeadSelectBtn.node.scaleX = -Math.abs(this.nextHeadSelectBtn.node.scaleX);
            this.nextHeadSelectBtn.interactable = false;
        }
    }

    //当前头像Index
    private _currentHeadIndex: number = 0;
    /**
     * 头像切换按钮
     * @param btn 
     */
    private onSwitchHeadBtnClick(btn: cc.Button) {
        let name = btn.node.name;
        switch(name) {
            case 'leftSelectBtn':
                this.currentHeadIndex -= 1;
                break;
            case 'rightSelectBtn':
                this.currentHeadIndex += 1;
                break;
            default: 
                break;
        }
    }

    /**
     * 密码修改回调
     */
    private onchangePwdBtnClick() {
        let mobile = this.lobbyUserModel.self.mobile;
        if(mobile) {
            let tips: ChangePwdPanelTips = new ChangePwdPanelTips();
            tips.oldPwdInputTips = '请输入登录密码';
            tips.newPwdInputTips = '请输入新的登录密码';
            tips.newPwdInputAgainTips = '请再次输入新的登录密码';
            let task = this.userServer.loginPwdChangeReq(this.loginModel.activatedAccount);
            this.showChangePwdPanelSignal.dispatch([tips, task]);
        }
        else {
            UIManager.instance.showPanel(BindPhonePanel, LayerManager.uiLayerName, true);
        }
    }

    /**
     * 头像更改回调
     */
    async onHeadSelectConfirmClick() {
        let index = this.currentHeadIndex;
        let task = this.userServer.modifUsetAvatarReq(index);
        let result = await task.wait();
        if(result.isOk) {
            this.pushTipsQueueSignal.dispatch('更换头像成功');
        }
        else {
            cc.log(`headChange failed. reason: ${result.reason}`);
            this.pushTipsQueueSignal.dispatch('更换头像失败');
        }
    }

    /**
     * 昵称修改回调
     */
    async onEditNameBtnClick() {
        let changNicknameTime = (this.lobbyUserModel.self as LobbyUserInfo).modifyNicknameCount;
        if(changNicknameTime >= 1) {
            this.pushTipsQueueSignal.dispatch("一个账号只能修改一次昵称");
        }
        else {
            UIManager.instance.showPanel(ChangeNicknamePanel, LayerManager.uiLayerName, false);
        }
    }

    /**
     * 绑定手机
     */
    private onBindPhoneBtnClick() 
    {
        UIManager.instance.showPanel(BindPhonePanel, LayerManager.uiLayerName, true);
    }

    /**
     * 复制id
     */
    private onCopyIdBtnClick() {
        let result = NativeUtils.copy(this.idTxt.string);
        if(result) {
            this.pushTipsQueueSignal.dispatch('复制成功');
        } else {
            this.pushTipsQueueSignal.dispatch('复制失败');
        }
        // NativeUtils.copy(this.idTxt.string);
    }
}
