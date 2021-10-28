import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import RechargeServer from "../servers/RechargeServer";
import BindAlipayTask from "../task/BindAlipayTask";
import { ErrResp } from "../../../protocol/protocols/protocols";
import ShowWithdrawCashPanelSignal from "../signals/ShowWithdrawCashPanelSignal";

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
export default class BindAlipayPanel extends Panel {
    @property(cc.Button)
    private closeBtn: cc.Button = null;

    @property(cc.Button)
    private confirmBtn: cc.Button = null;

    @property(cc.Button)
    private cancelBtn: cc.Button = null;

    @property(cc.EditBox)
    private ownerNameInput: cc.EditBox = null;

    @property(cc.EditBox)
    private alipayAccountInput: cc.EditBox = null;

    constructor() {
        super();
    }

    onShow() {
        this.addEventListener();
    }

    onHide() {
        this.removeEventListener();
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseClick, this);
        this.cancelBtn.node.on('click', this.onCloseClick, this);
        this.confirmBtn.node.on('click', this.onConfirmClick, this);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseClick, this);
        this.cancelBtn.node.off('click', this.onCloseClick, this);
        this.confirmBtn.node.off('click', this.onConfirmClick, this);
    }

    @riggerIOC.inject(ShowWithdrawCashPanelSignal)
    private showWithdrawCashPanelSignal: ShowWithdrawCashPanelSignal;

    closeWindow() {
        UIManager.instance.hidePanel(this);
        this.showWithdrawCashPanelSignal.dispatch();
    }

    private onCloseClick() {
        this.closeWindow();
    }

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(RechargeServer)
    private rechargeServer: RechargeServer;

    private async onConfirmClick() {
        if(!this.ownerNameInput.string || this.ownerNameInput.string.length <= 0) {
            this.pushTipsQueueSignal.dispatch('请输入支付包实名');
            return;
        }

        if(!this.alipayAccountInput.string || this.alipayAccountInput.string.length <= 0) {
            this.pushTipsQueueSignal.dispatch('请输入有效支付宝账号');
            return;
        }

        let bindAlipayTask: BindAlipayTask = this.rechargeServer.requestBindAlipay(this.alipayAccountInput.string, this.ownerNameInput.string);
        let result = await bindAlipayTask.wait();
        if(result.isOk) {
            this.pushTipsQueueSignal.dispatch('支付宝绑定成功');
            this.closeWindow();
        }
        else {
            let reason = result.reason;
            if(reason instanceof ErrResp) {
                this.pushTipsQueueSignal.dispatch(reason.errMsg);
            } else {
                // this.pushTipsQueueSignal.dispatch(reason);
                cc.log(`bindAlipay failed: ${reason}`);
            }
        }
    }
}
