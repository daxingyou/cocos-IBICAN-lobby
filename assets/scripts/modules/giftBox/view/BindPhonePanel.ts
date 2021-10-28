import LoginModel from "../../../../libs/common/scripts/modules/login/models/LoginModel";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import GiftBoxServer from "../servers/GiftBoxServer";
import { ErrResp } from "../../../protocol/protocols/protocols";
import WaitablePanel from "../../../../libs/common/scripts/utils/WaitablePanel";
import OnUserInfoUpdateSignal from "../../../../libs/common/scripts/modules/user/signals/OnUserInfoUpdateSignal";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import BindPhoneCompleteSignal from "../signals/BindPhoneCompleteSignal";
import { SoundUrlDefine } from "../../../../libs/common/scripts/modules/sound/SoundDefine";
import LobbySoundChannels from "../../sound/LobbySoundChannels";
import JPAudio from "../../../../libs/common/scripts/utils/JPAudio";

//绑定手机号有礼

const {ccclass, property} = cc._decorator;

@ccclass
export default class BindPhonePanel extends WaitablePanel {

    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property(cc.Button)
    public bindingBtn:cc.Button = null;

    @property(cc.EditBox)
    public phoneNumInput:cc.EditBox = null;

    @property(cc.EditBox)
    public captchaInput:cc.EditBox = null;

    @property(cc.EditBox)
    public pwInput:cc.EditBox = null;

    @property(cc.EditBox)
    public repeatPwInput:cc.EditBox = null;

    @property(cc.Button)
    public getCaptchaBtn:cc.Button = null;

    @riggerIOC.inject(LoginModel)
    public loginModel: LoginModel;

    @riggerIOC.inject(PushTipsQueueSignal)
    public pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(GiftBoxServer)
    private giftBoxServer: GiftBoxServer;

    @property(cc.Node)
    public captchaBtnBg:cc.Node = null;

    @property(cc.Node)
    public countDownTxtView:cc.Node = null;


    @riggerIOC.inject(OnUserInfoUpdateSignal)
    protected onUserInfoUpdateSignal: OnUserInfoUpdateSignal;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;

    @riggerIOC.inject(BindPhoneCompleteSignal)
    private bindPhoneCompleteSignal: BindPhoneCompleteSignal;

    @riggerIOC.inject(LobbySoundChannels.PANEL_POP_UP)
    private popUpEffect: JPAudio;
    
    private isCanGetCaptcha:boolean;
    constructor() {
        super();
    }

    onInit() {
        super.onInit();
        this.isCanGetCaptcha = true;
        this.captchaBtnBg.active = true;
        this.countDownTxtView.active = false;
    }

    onShow() {
        super.onShow();
        this.addEventListener();
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
        this.popUpEffect.stop();
    }

    onDispose() {
        super.onDispose();
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
    }

    addEventListener() {
       this.closeBtn.node.on('click', this.onCloseBtnClick, this);
       this.bindingBtn.node.on('click', this.bindHandle, this);

       this.getCaptchaBtn.node.on('click', this.getCaptchaHandle, this)
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick, this);
        this.bindingBtn.node.off('click', this.bindHandle, this);
        this.getCaptchaBtn.node.off('click', this.getCaptchaHandle, this)
    }

    //获取验证码
    private async getCaptchaHandle()
    {   
        if(!this.isCanGetCaptcha)return;
        if(this.phoneNumInput.string == "")
        {
            this.pushTipsQueueSignal.dispatch('手机号不能为空');
            return;
        }
        if(!this.loginModel.isPhoneNumValid(this.phoneNumInput.string)) 
        {
            this.pushTipsQueueSignal.dispatch('手机号输入错误，请重新输入');
            return;
        }
        let task = this.giftBoxServer.sendBindMobileVerifyCode(this.phoneNumInput.string);
        let result = await task.wait();
        if(result.isOk) 
        {
            this.onGetCaptchaMeg(result.result.seconds)
        }
        else 
        {
            let reason = result.reason;
            if(reason instanceof ErrResp) {
                this.pushTipsQueueSignal.dispatch(reason.errMsg);
            }
        }
    }

    private captchaTime:number = 0;
    private onGetCaptchaMeg(time:number):void
    {
        this.isCanGetCaptcha = false;
        this.captchaTime = time;

        this.captchaBtnBg.active = false;
        // this.countDownTxtView = true;
        this.countDownTxtView.active = true;
        let txtCom = this.countDownTxtView.getComponent("CountDownTxtView")
       
        txtCom.play(time, riggerIOC.Handler.create(this, this.countTxtEnd));

        // this.timeoutLabel.string  = this.captchaTime.toString();
        // let timeId = setInterval(()=>{
        //     this.captchaTime --;
        //     this.timeoutLabel.string  = this.captchaTime + "秒";
        //     if(this.captchaTime == 0)
        //     {
        //         clearInterval(timeId);
        //     }
            
        // }, 1000);
    }

    //倒计时
    private countTxtEnd():void
    {
        this.captchaBtnBg.active = true;
        this.countDownTxtView.active = false;
        let txtCom = this.countDownTxtView.getComponent("CountDownTxtView");
        txtCom.stopImmediately();
    }

    //立即绑定
    private async bindHandle()
    {
        if(this.phoneNumInput.string=="")
        {
            this.pushTipsQueueSignal.dispatch('手机号不能为空');
            return;
        }

        if(!this.loginModel.isPhoneNumValid(this.phoneNumInput.string)) 
        {
            this.pushTipsQueueSignal.dispatch('手机号输入错误，请重新输入');
            return;
        }

        if(this.captchaInput.string=="")
        {
            this.pushTipsQueueSignal.dispatch('验证码不能为空');
            return;
        }
        if(this.pwInput.string =="" || this.repeatPwInput.string == "")
        {
            this.pushTipsQueueSignal.dispatch('密码不能为空');
            return;
        }

        if(!this.loginModel.isVaildPwd(this.pwInput.string)) {
            this.pushTipsQueueSignal.dispatch('密码请输入6-12位数字、字母或者数字字母组合');
            return;
        }

        if(this.pwInput.string !== this.repeatPwInput.string) 
        {
            this.pushTipsQueueSignal.dispatch('两次密码输入不一致');
            return;
        }

        
        let task = this.giftBoxServer.bindMobile([this.phoneNumInput.string, this.captchaInput.string, this.pwInput.string]);
        let result = await task.wait();
        if(result.isOk) 
        {
            this.pushTipsQueueSignal.dispatch('绑定成功');
            //cc.log("绑定成功");
            //更新用户信息
            this.lobbyUserModel.self.mobile = this.phoneNumInput.string;
            this.onUserInfoUpdateSignal.dispatch();
            
            let txtCom = this.countDownTxtView.getComponent("CountDownTxtView");
            txtCom.stopImmediately();
            this.done(true);
            this.closeWindow();
            this.bindPhoneCompleteSignal.dispatch();
        }
        else 
        {
            this.isCanGetCaptcha = false;
            let reason = result.reason;
            if(reason instanceof ErrResp) {
                this.pushTipsQueueSignal.dispatch(reason.errMsg);
                this.done(false);
            }
        }
        
    }




     /**关闭按钮 */
     private onCloseBtnClick() {
        this.done(false);
        this.closeWindow();
    }
}
