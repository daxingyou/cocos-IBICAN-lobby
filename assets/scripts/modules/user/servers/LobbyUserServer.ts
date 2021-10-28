import ModifyUserAvatarTask from "../tasks/ModifyUserAvatarTask";
import Task from "../../../../libs/common/scripts/utils/Task";
import LoginPwdChangeTask from "../tasks/LoginPwdChangeTask";
import ModifyNicknameTask from "../tasks/ModifyNicknameTask";
import Constants from "../../../../libs/common/scripts/Constants";
import LobbyConstants from "../../../LobbyConstants";
import { UserAmountPushSignal, UserInfoModifyPushSignal } from "../../../protocol/signals/signals";
import { UserAmountPush, UserInfoModifyPush } from "../../../protocol/protocols/protocols";
import LobbyUserModel from "../model/LobbyUserModel";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import ShowBindPhonePanelSignal from "../../giftBox/signals/ShowBindPhonePanelSignal";
import OnChangeSceneCompleteSignal from "../../../../libs/common/scripts/modules/scene/signals/OnChangeSceneCompleteSignal";


// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class LobbyUserServer extends riggerIOC.Server {
    @riggerIOC.inject(UserModel)
    private model: LobbyUserModel;

    @riggerIOC.inject(UserAmountPushSignal)
    public userAmountPushSignal: UserAmountPushSignal;

    @riggerIOC.inject(ShowBindPhonePanelSignal)
    public showBindPhoneSignal: ShowBindPhonePanelSignal;

    @riggerIOC.inject(OnChangeSceneCompleteSignal)
    private changeSceneCompleteSignal: OnChangeSceneCompleteSignal;

    @riggerIOC.inject(UserInfoModifyPushSignal)
    private userInfoModifyPushSignal: UserInfoModifyPushSignal;

    constructor() {
        super();
        this.addEventListener();
    }

    dispose() {
        this.removeEventListener();
        super.dispose();
    }

    /**
     * 头像修改请求
     * @param index 
     */
    modifUsetAvatarReq(index: number): ModifyUserAvatarTask {
        let task: ModifyUserAvatarTask = new ModifyUserAvatarTask();
        task.start(index);
        return task;
    }

    @riggerIOC.inject(Constants)
    private constants: LobbyConstants;

    /**
     * 登录密码修改
     * @param oldPwd 
     * @param newPwd 
     */
    loginPwdChangeReq(account: string): Task {
        // let task: XMLHttpRequestTask = new XMLHttpRequestTask();
        let task: LoginPwdChangeTask = new LoginPwdChangeTask();
        task.url = `${this.constants.jpApiUrl}passport/user/modifyPassword`;
        task.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // .setRequestHeader("token", this.loginModel.passPorts[account].token);
        return task;
    }

    /**
     * 昵称修改
     * @param nickname 
     */
    changeNicknameReq(nickname: string): Task {
        let task: ModifyNicknameTask = new ModifyNicknameTask();
        task.start(nickname);
        return task;
    }

    private addEventListener(): void {
        this.userAmountPushSignal.on(this, this.onUserAmountPush);
        this.changeSceneCompleteSignal.on(this, this.onChangeSceneComplete);
        this.userInfoModifyPushSignal.on(this, this.onUserInfoModify);
    }

    private removeEventListener(): void {
        this.userAmountPushSignal.off(this, this.onUserAmountPush);
        this.changeSceneCompleteSignal.off(this, this.onChangeSceneComplete);
        this.userInfoModifyPushSignal.off(this, this.onUserInfoModify);
    }

    private onUserAmountPush(resp: UserAmountPush): void {
        this.model.updateUserBalance(resp.amount);
    }

    private onChangeSceneComplete(sceneName: string) {
        cc.log(`change scene name:${sceneName}`)
        if("mainScene" == sceneName){
            // TODO 子游戏退出后，如果在析构子游戏这前先显示了此面板，会导致背板无法关闭
            // 先临时处理
            setTimeout(() => {
                this.showBindPhoneSignal.dispatch();
            }, 0);
        }
    }

    private onUserInfoModify(resp: UserInfoModifyPush) {
        this.model.updateUserInfo(resp.userInfo);
    }
}
