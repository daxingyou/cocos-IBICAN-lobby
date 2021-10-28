import BaseLoginMediator from "../../../../libs/common/scripts/modules/login/views/BaseLoginMediator";
import BaseLoginPanel from "../../../../libs/common/scripts/modules/login/views/BaseLoginPanel";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import LoginRequest from "../../../../libs/common/scripts/modules/login/models/LoginRequest";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LoginPanel, { loginPanelPage } from "./LoginPanel";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import LoginModel from "../../../../libs/common/scripts/modules/login/models/LoginModel";
import SituationModel from "../../../../libs/common/scripts/modules/situation/models/SituationModel";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class LoginMediator extends BaseLoginMediator {
    @riggerIOC.inject(BaseLoginPanel)
    protected view: LoginPanel;

    @riggerIOC.inject(LoginModel)
    private loginModel: LoginModel;

    onShow(): void {
        cc.log(`login mediator show:${this.view}`)
        this.addEventListener();
        this.view.pwdLoginToggle.check();
        this.view.pwdLoginToggle.node.emit('toggle', this.view.pwdLoginToggle);
        // let accountInfo = this.loginModel.getRecentlyUsedAccount();
        // if(accountInfo) {
        //     this.view.initAccount(accountInfo.account, accountInfo.tokenInfo);
        // }
    }

    onHide(): void {
        cc.log(`login mediator hide`);
        this.removeEventListener();
    }

    onDispose(): void {
        cc.log(`login mediator dispose`)
    }

    private addEventListener():void{
        this.view.onClickLoginSignal.on(this, this.onClickLoginBtn);
        this.onLoginSuccessSignal.on(this, this.onLoginSuccess);
    }

    private removeEventListener():void{
        this.view.onClickLoginSignal.off(this, this.onClickLoginBtn);
        this.onLoginSuccessSignal.off(this, this.onLoginSuccess);
    }

    @riggerIOC.inject(PushTipsQueueSignal)
    private tipsSignal: PushTipsQueueSignal;

    @riggerIOC.inject(SituationModel)
    private situationModel: SituationModel;

    private onClickLoginBtn(request: LoginRequest): void {
        cc.log(`in mediator, account:${request.account}, pw:${request.password}, authCode:${request.authCode}, if store:${request.ifStorePassword}`);
        // 检查帐号密码是否合法
        if(this.model.isPhoneNumValid(request.account)){
            this.situationModel.setLoginSpecGlobal(request)
            this.loginSignal.dispatch();
        }
        else{
            this.tipsSignal.dispatch("帐号或密码不合法")
        }
    }

    private onLoginSuccess():void{
        UIManager.instance.hidePanel(this.view);
        this.view.done(true);
    }   


}
