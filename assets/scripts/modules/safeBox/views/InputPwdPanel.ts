import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import SafeBoxServer from "../servers/SafeBoxServer";
import { ErrResp } from "../../../protocol/protocols/protocols";
import WaitablePanel from "../../../../libs/common/scripts/utils/WaitablePanel";
import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";

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
export default class InputPwdPanel extends WaitablePanel {
    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property(cc.Button)
    public cancelBtn: cc.Button = null;

    @property(cc.Button)
    public confirmBtn: cc.Button = null;

    @property(cc.EditBox)
    private pwdInput: cc.EditBox = null;

    /**提示信号 */
    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal = null;

    /**保险箱服务 */
    @riggerIOC.inject(SafeBoxServer)
    private safeBoxServer: SafeBoxServer = null;

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

    private coin: number = 0;
    onExtra([coin]: [number]) {
        if(coin) {
            this.coin = coin;
        } 
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.cancelBtn.node.on('click', this.onCancelClick, this);
        this.confirmBtn.node.on('click', this.onConfirmClick, this);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick, this);
        this.cancelBtn.node.off('click', this.onCancelClick, this);
        this.confirmBtn.node.off('click', this.onConfirmClick, this);
    }

    private onCloseBtnClick() {
        this.done(false);
        this.closeWindow();
    }

    private onCancelClick() {
        this.done(false);
        this.closeWindow();
    }

    async onConfirmClick() {
        let pwd = this.pwdInput.string;
        if(!pwd || pwd == '') {
            this.pushTipsQueueSignal.dispatch('密码不能为空!');
        }
        else {
            BaseWaitingPanel.show("正在登录");
            let getMoneyTask = this.safeBoxServer.withdrawalMoneyReq(this.coin, pwd);
            let getMoneyResp = await getMoneyTask.wait();
            if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
            if(getMoneyResp.isOk) {
                this.done(true);
                this.closeWindow();
            }
            else {
                let reason = getMoneyResp.reason;
                cc.log(`getMonery Failed. reason: ${reason}`);
                if(reason instanceof ErrResp) {
                    this.pushTipsQueueSignal.dispatch(reason.errMsg);
                }
            }
        }
    }


}
