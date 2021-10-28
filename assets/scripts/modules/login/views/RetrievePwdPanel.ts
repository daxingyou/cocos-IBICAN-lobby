import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LoginModel from "../../../../libs/common/scripts/modules/login/models/LoginModel";
import LobbyLoginServer, { phoneAuthCodeType } from "../servers/LobbyLoginServer";
import LoginServer from "../../../../libs/common/scripts/modules/login/servers/LoginServer";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import Task from "../../../../libs/common/scripts/utils/Task";
import ResetPwdPanel from "./ResetPwdPanel";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import CountDownTxtView from "./CountDownTxtView";
import ShowLoginPanelSignal from "../../../../libs/common/scripts/modules/login/signals/ShowLoginPanelSignal";

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
export default class RetrievePwdPanel extends Panel {
    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property(cc.Button)
    public getAuthCodeBtn: cc.Button = null;

    @property(cc.Button)
    public nextBtn: cc.Button = null;

    @property(cc.EditBox)
    public accountInput: cc.EditBox = null;

    @property(cc.EditBox)
    public authCodeInput: cc.EditBox = null;

    @property(cc.Label)
    public countDownTxt: cc.Label = null;

    @riggerIOC.inject(LoginModel)
    private loginModel: LoginModel;

    @riggerIOC.inject(LoginServer)
    private lobbyLoginServer: LobbyLoginServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(ShowLoginPanelSignal)
    private showLoginPanelSignal: ShowLoginPanelSignal;

    constructor() {
        super();
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

    closeWindow() {
        UIManager.instance.hidePanel(this);
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.nextBtn.node.on('click', this.onNextBtnClick, this);
        this.getAuthCodeBtn.node.on('click', this.onGetAuthCodeBtnClick, this);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick, this);
        this.nextBtn.node.off('click', this.onNextBtnClick, this);
        this.getAuthCodeBtn.node.off('click', this.onGetAuthCodeBtnClick, this);
    }

    private onCloseBtnClick() {
        this.closeWindow();
        this.showLoginPanelSignal.dispatch();
    }

    private onNextBtnClick() {
        if(!this.loginModel.isPhoneNumValid(this.accountInput.string)) {
            this.pushTipsQueueSignal.dispatch('请输入合法手机号');
            return;
        }

        if(!this.loginModel.isVerifCodeValid(this.authCodeInput.string)) {
            this.pushTipsQueueSignal.dispatch('验证码非法');
            return;
        }

        UIManager.instance.showPanel(ResetPwdPanel, LayerManager.uiLayerName, true, [this.accountInput.string, this.authCodeInput.string]);
    }

    private async onGetAuthCodeBtnClick() {
        if(!this.getAuthCodeBtn.interactable) return;
        if(!this.loginModel.isPhoneNumValid(this.accountInput.string)) {
            this.pushTipsQueueSignal.dispatch('请输入合法手机号');
            return;
        }

        let task: Task = this.lobbyLoginServer.requestPhoneAuthCode(phoneAuthCodeType.reset, this.accountInput.string);
        let ret = await task.wait();
        let result = JSON.parse(ret.result);
        if(result) {
            if(result.ret) {
                this.pushTipsQueueSignal.dispatch('验证码已发送,请注意查收');
                this.getAuthCodeBtn.interactable = false;
                cc.find('sign', this.getAuthCodeBtn.node).active = false;
                let cb: riggerIOC.Handler = riggerIOC.Handler.create(this, () => {
                    this.getAuthCodeBtn.interactable = true;
                    this.countDownTxt.node.active = false;
                    cc.find('sign', this.getAuthCodeBtn.node).active = true;
                })
                this.countDownTxt.getComponent(CountDownTxtView).play(60, cb);
                this.countDownTxt.node.active = true;
            }
            else {
                if(result.msg) this.pushTipsQueueSignal.dispatch(result.msg);
            }
        }

    }
}
