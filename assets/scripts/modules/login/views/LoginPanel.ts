import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import BaseLoginPanel from "../../../../libs/common/scripts/modules/login/views/BaseLoginPanel";
import LoginRequest from "../../../../libs/common/scripts/modules/login/models/LoginRequest";
import ShowRegisterPanelSignal from "../../../../libs/common/scripts/modules/login/signals/ShowRegisterPanelSignal";
import BaseRegisterPanel from "../../../../libs/common/scripts/modules/login/views/BaseRegisterPanel";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import PanelStackFrame from "../../../../libs/common/scripts/utils/PanelStackFrame";
import Task from "../../../../libs/common/scripts/utils/Task";
import LoginServer from "../../../../libs/common/scripts/modules/login/servers/LoginServer";
import LobbyLoginServer, { phoneAuthCodeType } from "../servers/LobbyLoginServer";
import LoginModel from "../../../../libs/common/scripts/modules/login/models/LoginModel";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import RetrievePwdPanel from "./RetrievePwdPanel";
import CountDownTxtView from "./CountDownTxtView";
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

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginPanel extends BaseLoginPanel {
    @property(cc.Toggle)
    public pwdLoginToggle: cc.Toggle = null;

    @property(cc.Toggle)
    public autoLoginCodeToggle: cc.Toggle = null;

    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property(cc.Button)
    public forgetPwdBtn: cc.Button = null;

    @property(cc.Button)
    public loginBtn: cc.Button = null;

    @property(cc.Button)
    public registerBtn: cc.Button = null;

    @property(cc.EditBox)
    public accountInput: cc.EditBox = null;

    @property(cc.EditBox)
    public pwInput: cc.EditBox = null;

    @property(cc.Button)
    public getAuthCodeBtn: cc.Button = null;

    @property(cc.Label)
    public countDownTxt: cc.Label = null;

    @property(cc.Toggle)
    public storePwdToggle: cc.Toggle = null;

    @riggerIOC.inject(LoginServer)
    private lobbyLoginServer: LobbyLoginServer;

    @riggerIOC.inject(LoginModel)
    private loginModel: LoginModel;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    onShow(): void {
        super.onShow();
        this.addEventListener();
    }

    onExtra(account?: string): void {
        if (account) {
            this.accountInput.string = account;
        }
    }

    onHide(): void {
        super.onHide();
        this.removeEventListener();
    }

    private tokenInfo: {token: string, tokenSeconds: number} = null;
    initAccount(account: string, tokenInfo?: {token: string, tokenSeconds: number}) {
        // if(this.accountInput.string) return;
        this.accountInput.string = account;
        if(tokenInfo) {
            this.pwInput.string = 'abc123';
            this.tokenInfo = tokenInfo;
            this.storePwdToggle.check();
        }
        else {
            this.pwInput.string = '';
            this.tokenInfo = null;
            this.storePwdToggle.uncheck();
        }
    }

    private addEventListener(): void {
        this.closeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.loginBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickLoginBtn, this);
        this.registerBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickRegisterBtn, this);
        this.pwdLoginToggle.node.on('toggle', this.onToggleChanged, this);
        this.autoLoginCodeToggle.node.on('toggle', this.onToggleChanged, this);
        this.getAuthCodeBtn.node.on('click', this.getAuthCodeBtnClick, this);
        this.forgetPwdBtn.node.on('click', this.onForgetPwdBtnClick, this);
        this.pwInput.node.on('text-changed', this.onPwInputChanged, this);
        this.accountInput.node.on('text-changed', this.onAccountInputChanged, this);
    }

    private removeEventListener(): void {
        this.closeBtn.node.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.loginBtn.node.off(cc.Node.EventType.TOUCH_END, this.onClickLoginBtn, this);
        this.registerBtn.node.off(cc.Node.EventType.TOUCH_END, this.onClickRegisterBtn, this);
        this.pwdLoginToggle.node.off('toggle', this.onToggleChanged, this);
        this.autoLoginCodeToggle.node.off('toggle', this.onToggleChanged, this);
        this.getAuthCodeBtn.node.off('click', this.getAuthCodeBtnClick, this);
        this.forgetPwdBtn.node.off('click', this.onForgetPwdBtnClick, this);
        this.pwInput.node.off('text-changed', this.onPwInputChanged, this);
        this.accountInput.node.off('text-changed', this.onAccountInputChanged, this)
    }

    private onClickClose(): void {
        UIManager.instance.hidePanel(this);
        this.done(false);
        // this.hide();
    }

    private onPwInputChanged(edit: cc.EditBox) {
        this.tokenInfo = null;
    }

    private onAccountInputChanged(edit: cc.EditBox) {
        this.tokenInfo = null;
        this.pwInput.string = '';
    }
    
    /**忘记密码 */
    private onForgetPwdBtnClick() {
        // UIManager.instance.showPanel(RetrievePwdPanel, LayerManager.uiLayerName, true, null, new PanelStackFrame(this));
        UIManager.instance.showPanel(RetrievePwdPanel, LayerManager.uiLayerName, true);
    }
    
    /**登录按钮 */
    private onClickLoginBtn(): void {
        let account: string = this.accountInput.string;
        let password: string = this.pwInput.string;
        if(!account) {
            this.pushTipsQueueSignal.dispatch('账号不能为空');
            return;
        }
        // let ifStore:boolean = this.
        let req: LoginRequest = new LoginRequest();
        req.account = account;
        if(this._currentPage == loginPanelPage.pwdLoginPage) {
            if(!password) {
                this.pushTipsQueueSignal.dispatch('密码不能为空');
                return;
            }
            req.password = password;
            req.ifStorePassword = this.storePwdToggle.isChecked;
        }
        else if(this._currentPage == loginPanelPage.authCodeLoginPage) {
            if(!password) {
                this.pushTipsQueueSignal.dispatch('验证码不能为空');
                return;
            }
            req.authCode = password;
            req.ifStorePassword = false;
        }

        if(this.tokenInfo){
            req.token = this.tokenInfo.token;
            req.tokenTimeStamp = this.tokenInfo.tokenSeconds;
        }
        this.onClickLoginSignal.dispatch(req);
    }

    @riggerIOC.inject(ShowRegisterPanelSignal)
    private showRegisterSignal: ShowRegisterPanelSignal;

    /**注册账号 */
    private onClickRegisterBtn():void{
        // BaseRegisterPanel.show(LayerManager.uiLayerName, true, null, new PanelStackFrame(this));
        this.showRegisterSignal.dispatch();
    }

    /**
     * 获取验证码
     */
    async getAuthCodeBtnClick() {
        if(!this.getAuthCodeBtn.interactable) return;
        let account = this.accountInput.string;
        cc.log(`send authCode, account: ${account}`);
        if(this.loginModel.isPhoneNumValid(account)) {
            let task: Task = this.lobbyLoginServer.requestPhoneAuthCode(phoneAuthCodeType.login, account);
            let ret = await task.wait();
            let result = JSON.parse(ret.result);
            if(result && result.ret) {
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
            cc.log(result);
        }
        else {
            this.pushTipsQueueSignal.dispatch('手机号不合法');
        }
    }

    get currentPage(): loginPanelPage {
        return this._currentPage;
    }
    set currentPage(page: loginPanelPage) {
        this._currentPage = page;
        let pwdTip: cc.Label;
        pwdTip = cc.find('authcodeNode/pwdTip', this.node).getComponent(cc.Label);
        if(page == loginPanelPage.pwdLoginPage) {
            pwdTip.string = '密码';
            this.forgetPwdBtn.node.active = true;
            this.getAuthCodeBtn.node.active = false;
            this.pwInput.placeholder = '请输入密码';
        }
        else {
            pwdTip.string = '验证码';
            this.forgetPwdBtn.node.active = false;
            this.getAuthCodeBtn.node.active = true;
            this.pwInput.placeholder = '请输入验证码';
        }
    }
    private _currentPage: loginPanelPage;

    /**
     * 登录方式改变
     * @param toggle 
     */
    private onToggleChanged(toggle: cc.Toggle) {
        let name: string = toggle.node.name;
        switch(name) {
            case 'pwdLoginToggle':
                this.currentPage = loginPanelPage.pwdLoginPage;
                this.pwInput.inputFlag = cc.EditBox.InputFlag.PASSWORD;
                this.pwInput.inputMode = cc.EditBox.InputMode.SINGLE_LINE;
                this.pwInput.string = '';
                let accountInfo = this.loginModel.getRecentlyUsedAccount();
                if(accountInfo) {
                    this.initAccount(accountInfo.account, accountInfo.tokenInfo);
                }
                this.countDownTxt.node.getComponent(CountDownTxtView).isShowTxt = false;
                cc.find('remeberPwdNode', this.node).active = true;
                break;
            case 'authCodeLoginToggle':
                this.currentPage = loginPanelPage.authCodeLoginPage;
                this.pwInput.inputFlag = cc.EditBox.InputFlag.DEFAULT;
                this.pwInput.inputMode = cc.EditBox.InputMode.NUMERIC;
                this.pwInput.string = '';
                this.countDownTxt.node.getComponent(CountDownTxtView).isShowTxt = true;
                cc.find('remeberPwdNode', this.node).active = false;
                break;
            default:
                break;
        }
    }
}

export enum loginPanelPage {
    pwdLoginPage = 1,
    authCodeLoginPage
}