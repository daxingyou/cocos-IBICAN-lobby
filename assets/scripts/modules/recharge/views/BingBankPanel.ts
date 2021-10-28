import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import RechargeServer from "../servers/RechargeServer";
import BindBankTask from "../task/BindBankTask";
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
export default class BindBankPanel extends Panel {
    @property(cc.Button)
    private closeBtn: cc.Button = null;

    @property(cc.Button)
    private confirmBtn: cc.Button = null;

    @property(cc.Button)
    private cancelBtn: cc.Button = null;

    @property(cc.EditBox)
    private ownerNameInput: cc.EditBox = null;

    @property(cc.EditBox)
    private bankNameInput: cc.EditBox = null;

    @property(cc.EditBox)
    private bankAccountInput: cc.EditBox = null;

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
            this.pushTipsQueueSignal.dispatch('请输入持卡人姓名');
            return;
        }

        if(!this.bankNameInput.string || this.bankNameInput.string.length <= 0) {
            this.pushTipsQueueSignal.dispatch('请输入开户行');
            return;
        }

        if(!this.bankAccountInput.string || this.bankAccountInput.string.length <= 0) {
            this.pushTipsQueueSignal.dispatch('请输入银行卡账号');
            return;
        }

        let bindBankTask: BindBankTask = this.rechargeServer.requestBindBank(this.bankAccountInput.string, this.ownerNameInput.string, this.bankNameInput.string);
        let result = await bindBankTask.wait();
        if(result.isOk) {
            this.pushTipsQueueSignal.dispatch('银行卡绑定成功');
            this.closeWindow();
        } else {
            let reason = result.reason;
            if(reason instanceof ErrResp) {
                this.pushTipsQueueSignal.dispatch(reason.errMsg);
            } else {
                cc.log(`bind bank failed: ${reason}`);
            }
        }
    }
}
