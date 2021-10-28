import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import PersonalInfoView from "./PersonalInfoView";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../model/LobbyUserModel";
import { ModifyUserAvatarRespSignal, ModifyNicknameRespSignal } from "../../../protocol/signals/signals";
import { ModifyUserAvatarResp, ModifyNicknameResp } from "../../../protocol/protocols/protocols";
import LobbyUserInfo from "../model/LobbyUserInfo";
import OnUserInfoUpdateSignal from "../../../../libs/common/scripts/modules/user/signals/OnUserInfoUpdateSignal";
import BaseUserInfo from "../../../../libs/common/scripts/modules/user/models/BaseUserInfo";

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
export default class PersonalInfoMediator extends JPMediator {
    @riggerIOC.inject(PersonalInfoView)
    protected view: PersonalInfoView;

    @riggerIOC.inject(UserModel)
    private userModel: LobbyUserModel;

    @riggerIOC.inject(ModifyUserAvatarRespSignal)
    private modifyUserAvatarRespSignal: ModifyUserAvatarRespSignal;

    @riggerIOC.inject(ModifyNicknameRespSignal)
    private modifyNicknameRespSignal: ModifyNicknameRespSignal;

    @riggerIOC.inject(OnUserInfoUpdateSignal)
    private onUserInfoUpdateSignal: OnUserInfoUpdateSignal;

    constructor() {
        super();
    }

    onInit() {
        super.onInit();
    }

    onShow() {
        super.onShow();
        this.addProtocolListener();
        this.view.updateInfo(this.userModel.self);
    }

    onHide() {
        super.onHide();
        this.removeProtocolListener();
    }

    onDispose() {
        super.onDispose();
    }

    addProtocolListener() {
        this.modifyUserAvatarRespSignal.on(this, this.onModifyUserAvatarResp);
        this.modifyNicknameRespSignal.on(this, this.onModifyNicknameResp);
        this.onUserInfoUpdateSignal.on(this, this.onUserInfoUpdate);
    }

    removeProtocolListener() {
        this.modifyUserAvatarRespSignal.off(this, this.onModifyUserAvatarResp);
        this.modifyNicknameRespSignal.off(this, this.onModifyNicknameResp);
        this.onUserInfoUpdateSignal.off(this, this.onUserInfoUpdate);
    }

    /**
     * 
     * @param resp 头像更改成功
     */
    private onModifyUserAvatarResp(resp: ModifyUserAvatarResp) {
        this.userModel.self.icon = resp.avatar + '';
    }

    /**
     * 昵称修改成功
     * @param resp 
     */
    private onModifyNicknameResp(resp: ModifyNicknameResp) {
        this.userModel.self.nickName = resp.nickname;
        (this.userModel.self as LobbyUserInfo).modifyNicknameCount += 1;
        this.view.updateInfo(this.userModel.self);
    }

    private onUserInfoUpdate() {
        this.view.updateInfo(this.userModel.self);
    }
}
