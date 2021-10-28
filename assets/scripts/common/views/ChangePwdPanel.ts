import WaitablePanel from "../../../libs/common/scripts/utils/WaitablePanel";
import PushTipsQueueSignal from "../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import ChangePwdPanelTips from "../structurals/ChangePwdPanelTips";
import UIManager from "../../../libs/common/scripts/utils/UIManager";
import ChangePwdResult from "../structurals/ChangePwdResult";

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
export default class ChangePwdPanel extends WaitablePanel {
    @property(cc.EditBox)
    public oldPwdInputTxt: cc.EditBox = null;

    @property(cc.EditBox)
    public newPwdInputTxt: cc.EditBox = null;

    @property(cc.EditBox)
    public newPwdInputAgainTxt: cc.EditBox = null;

    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property(cc.Button)
    public cancelBtn: cc.Button = null;

    @property(cc.Button)
    public confirmBtn: cc.Button = null;

    /**提示信号 */
    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

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

    private tips: ChangePwdPanelTips = null;
    onExtra(changePwdPanelTips: ChangePwdPanelTips) {
        this.tips = changePwdPanelTips;
        this.initInputTips();
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.cancelBtn.node.on('click', this.onCloseBtnClick, this);
        this.confirmBtn.node.on('click', this.onConfirmBtnClick, this);
        this.oldPwdInputTxt.node.on('editing-did-ended', this.onInputTxtChanged, this);
        this.newPwdInputTxt.node.on('editing-did-ended', this.onInputTxtChanged, this);
        this.newPwdInputAgainTxt.node.on('editing-did-ended', this.onInputTxtChanged, this);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick, this);
        this.cancelBtn.node.off('click', this.onCloseBtnClick, this);
        this.confirmBtn.node.off('click', this.onConfirmBtnClick, this);
        this.oldPwdInputTxt.node.off('editing-did-ended', this.onInputTxtChanged, this);
        this.newPwdInputTxt.node.off('editing-did-ended', this.onInputTxtChanged, this);
        this.newPwdInputAgainTxt.node.off('editing-did-ended', this.onInputTxtChanged, this);
    }

    /**
     * 初始化密码输入框的提示语句
     * @param param0 
     */
    private initInputTips() {
        this.oldPwdInputTxt.placeholder = this.tips.oldPwdInputTips;
        this.newPwdInputTxt.placeholder = this.tips.pwdInputRuleTips;
        this.newPwdInputAgainTxt.placeholder = this.tips.newPwdInputAgainTips;
    }

    /**
     * 关闭、取消按钮点击回调
     */
    private onCloseBtnClick(btn: cc.Button) {
        // cc.log(btn);
        this.done(false);
    }

    /**
     * 确定按钮点击回调
     */
    async onConfirmBtnClick() {
        if(this.oldPwdInputTxt.string.length <= 0) {
            this.pushTipsQueueSignal.dispatch(this.tips.oldPwdInputTips);
            return;
        }
        if(this.newPwdInputTxt.string.length <= 0) {
            this.pushTipsQueueSignal.dispatch(this.tips.newPwdInputTips);
            return;
        }
        if(this.newPwdInputAgainTxt.string.length <= 0) {
            this.pushTipsQueueSignal.dispatch(this.tips.newPwdInputAgainTips);
            return;
        }
        if(this.newPwdInputTxt.string !== this.newPwdInputAgainTxt.string) {
            this.pushTipsQueueSignal.dispatch(this.tips.twoNewPwdNotEqualTips);
            this.newPwdInputAgainTxt.string = '';
            return;
        }
        
        let args: ChangePwdResult = new ChangePwdResult();
        args.oldPwd = this.oldPwdInputTxt.string;
        args.newPwd = this.newPwdInputAgainTxt.string;
        this.done(args);
    }

    /**
     * 密码输入文本回调
     * @param inputTxt 
     */
    private onInputTxtChanged(inputTxt: cc.EditBox) {
        let name = inputTxt.node.name;
        switch(name) {
            case 'oldPwdInputTxt':
                break;
            case 'newPwdInputTxt': 
                if(!this.isVaildPwd(inputTxt.string)) {
                    this.pushTipsQueueSignal.dispatch(this.tips.pwdInputRuleTips);
                    this.newPwdInputTxt.string = '';
                }
                break;
            case 'newPwdInputAgainTxt':
                if(this.newPwdInputTxt.string !== this.newPwdInputAgainTxt.string) {
                    this.pushTipsQueueSignal.dispatch(this.tips.twoNewPwdNotEqualTips);
                    this.newPwdInputAgainTxt.string = '';
                }
                break;
            default:
                break;
        }
    }

    /**
     * 密码是否符合规则 6-12位数字和字母的组合
     * @param pwd 
     */
    private isVaildPwd(pwd: string): boolean {
        if(pwd.length <= 0) return true;
        let re = /^[a-zA-Z0-9]{6,12}$/; //数字字母均可
        let reNumber = /^[0-9]{6,12}$/; //数字
        let reString = /^[a-zA-Z]{6,12}$/; //字母
        if(re.test(pwd) && !reNumber.test(pwd) && !reString.test(pwd)) {
            return true;   
        }
        return false
    }

}
