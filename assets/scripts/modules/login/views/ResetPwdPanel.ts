import Panel from "../../../../libs/common/scripts/utils/Panel";
import LoginModel from "../../../../libs/common/scripts/modules/login/models/LoginModel";
import LoginServer from "../../../../libs/common/scripts/modules/login/servers/LoginServer";
import LobbyLoginServer from "../servers/LobbyLoginServer";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import RetrievePwdPanel from "./RetrievePwdPanel";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
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
export default class ResetPwdPanel extends Panel {
    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property(cc.Button)
    public confirmBtn: cc.Button = null;

    @property(cc.EditBox)
    public newPwdInput: cc.EditBox = null;

    @property(cc.EditBox)
    public confirmNewPwdInput: cc.EditBox = null;

    @riggerIOC.inject(LoginModel)
    private loginModel: LoginModel;

    @riggerIOC.inject(LoginServer)
    private lobbyLoginServer: LobbyLoginServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushtipsQueueSignal: PushTipsQueueSignal;

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
        this.account = '';
        this.authCode = '';
    }

    onDispose() {
        super.onDispose();
    }

    private account: string = '';
    private authCode: string = '';
    onExtra([account, authCode]: [string, string]) {
        this.account = account;
        this.authCode = authCode;
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.confirmBtn.node.on('click', this.onConfirmBtnClick, this);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick, this);
        this.confirmBtn.node.off('click', this.onConfirmBtnClick, this);
    }

    private onCloseBtnClick() {
        this.closeWindow();
        UIManager.instance.showPanel(RetrievePwdPanel, LayerManager.uiLayerName, true);
    }

    private async onConfirmBtnClick() {
        if(!this.loginModel.isVaildPwd(this.newPwdInput.string)) {
            this.pushtipsQueueSignal.dispatch('请输入6-12位数字和字母的组合');
            return;
        }

        if(this.newPwdInput.string !== this.confirmNewPwdInput.string) {
            this.pushtipsQueueSignal.dispatch('两次输入的密码不一致');
            return;
        }

        let task = this.lobbyLoginServer.requestResetPwd(this.account, this.newPwdInput.string, this.authCode);
        let ret = await task.wait();
        let result = JSON.parse(ret.result);
        if(result && result.ret) {
            this.pushtipsQueueSignal.dispatch('密码重置成功');
            this.closeWindow();
            this.showLoginPanelSignal.dispatch();
        }
        else {
            let str: string = '密码重置失败';
            if(result && result.msg) str = result.msg;
            this.pushtipsQueueSignal.dispatch(str);
            this.onCloseBtnClick();
        }
    }
}
