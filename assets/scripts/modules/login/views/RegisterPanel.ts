import BaseRegisterPanel from "../../../../libs/common/scripts/modules/login/views/BaseRegisterPanel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import RegisterRequest from "../../../../libs/common/scripts/modules/login/models/RegisterRequest";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import ShowLoginPanelSignal from "../../../../libs/common/scripts/modules/login/signals/ShowLoginPanelSignal";
import CompactPanel from "./CompactPanel";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";

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
export default class RegisterPanel extends BaseRegisterPanel {
    @property(cc.Button)
    protected closeBtn: cc.Button = null;

    @property(cc.Button)
    protected registerBtn: cc.Button = null;

    @property(cc.Button)
    public getVerifyCodeBtn: cc.Button = null;

    @property(cc.EditBox)
    protected phoneNumInput: cc.EditBox = null;

    @property(cc.EditBox)
    protected passwordInput: cc.EditBox = null;

    @property(cc.EditBox)
    protected confirmPasswordInput: cc.EditBox = null;

    @property(cc.Toggle)
    public confirmPolicyToggle: cc.Toggle = null;

    @property(cc.Button)
    public readPolicyBtn: cc.Button = null;

    @property(cc.EditBox)
    protected verifyCodeInput: cc.EditBox = null;

    @property(cc.EditBox)
    protected nicknameInput: cc.EditBox = null;

    @property(cc.Label)
    public countDownTxt: cc.Label = null;

    @riggerIOC.inject(ShowLoginPanelSignal)
    private showLoginPanelSigna: ShowLoginPanelSignal;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    onShow(): void {
        this.addEventListener();
    }

    onHide(): void {
        this.removeEventListener();
    }

    private addEventListener(): void {
        this.closeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.getVerifyCodeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickGetVerifyCodeBtn, this);
        this.registerBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickRegisterBtn, this);
        this.readPolicyBtn.node.on('click', this.onReadPolicyBtnClick, this);
    }

    private removeEventListener(): void {
        this.closeBtn.node.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this)
        this.getVerifyCodeBtn.node.off(cc.Node.EventType.TOUCH_END, this.onClickGetVerifyCodeBtn, this);
        this.registerBtn.node.off(cc.Node.EventType.TOUCH_END, this.onClickRegisterBtn, this);
        this.readPolicyBtn.node.off('click', this.onReadPolicyBtnClick, this);
    }

    private onClickClose(): void {
        UIManager.instance.hidePanel(this);
        this.showLoginPanelSigna.dispatch();
    }


    private onClickGetVerifyCodeBtn(): void {
        if(this.getVerifyCodeBtn.interactable) {
            this.onClickGetVerifyCodeSignal.dispatch(this.phoneNumInput.string)
        }
    }

    private onClickRegisterBtn(): void {
        if(this.confirmPolicyToggle.isChecked == false) {
            this.pushTipsQueueSignal.dispatch('使用本游戏前，请勾选同意下方的用户协议');
            return;
        }

        if (this.confirmPasswordInput.string !== this.passwordInput.string) {
            // cc.error("password is not same");
            this.pushTipsQueueSignal.dispatch('两次密码输入不一致');
            return;
        }
        let req: RegisterRequest = new RegisterRequest();
        req.account = this.phoneNumInput.string;
        req.password = this.passwordInput.string;
        req.verifyCode = this.verifyCodeInput.string;
        req.nickName = this.nicknameInput.string;

        this.onClickRegisterBtnSignal.dispatch(req);
    }

    private onReadPolicyBtnClick() {
        UIManager.instance.showPanel(CompactPanel, LayerManager.uiLayerName, false);
    }
}
