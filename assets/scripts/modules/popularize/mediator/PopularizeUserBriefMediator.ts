import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import {ModifyUserAvatarResp, ModifyNicknameResp } from "../../../protocol/protocols/protocols";
import LobbyUserInfo from "../../user/model/LobbyUserInfo";
import OnUserInfoUpdateSignal from "../../../../libs/common/scripts/modules/user/signals/OnUserInfoUpdateSignal";
import { ModifyUserAvatarRespSignal, ModifyNicknameRespSignal } from "../../../protocol/signals/signals";
import PopularizeUserBriefView from "../views/PopularizeUserBriefView";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class PopularizeUserBriefMediator extends JPMediator {
    @riggerIOC.inject(UserModel)
    private userModel: UserModel;

    @riggerIOC.inject(PopularizeUserBriefView)
    protected view: PopularizeUserBriefView

    @riggerIOC.inject(OnUserInfoUpdateSignal)
    protected onUserInfoUpdateSignal: OnUserInfoUpdateSignal;

    @riggerIOC.inject(ModifyUserAvatarRespSignal)
    private modifyUserAvatarRespSignal: ModifyUserAvatarRespSignal

    @riggerIOC.inject(ModifyNicknameRespSignal)
    private modifyNicknameRespSignal: ModifyNicknameRespSignal;

    onShow(): void {
        this.updateUserInfo();
        this.addEventListener();
    }

    onHide(): void {
        this.removeEventListener();
    }

    private addEventListener(): void {
        this.onUserInfoUpdateSignal.on(this, this.onUserInfoUpdate);
        this.modifyUserAvatarRespSignal.on(this, this.onModifyUserAvatarResp);
        this.modifyNicknameRespSignal.on(this, this.onModifyNicknameResp);
    }

    private removeEventListener(): void {
        this.onUserInfoUpdateSignal.off(this, this.onUserInfoUpdate);
        this.modifyUserAvatarRespSignal.off(this, this.onModifyUserAvatarResp);
        this.modifyNicknameRespSignal.off(this, this.onModifyNicknameResp);
    }

    private onUserInfoUpdate():void{
        this.updateUserInfo();
    }

    /**头像更改成功 */
    private onModifyUserAvatarResp(resp: ModifyUserAvatarResp) {
        this.view.setAvatar(Number(resp.avatar));
    }

    /**昵称更改成功 */
    private onModifyNicknameResp(resp: ModifyNicknameResp) {        
        let nickName:string;
        let self: LobbyUserInfo = this.userModel.self as LobbyUserInfo;
        if( self ){
            self.nickName = resp.nickname;
        }
        nickName = resp.nickname;
        this.view.setNickname(nickName);
    }

    private updateUserInfo(): void {
        let self: LobbyUserInfo = this.userModel.self as LobbyUserInfo;
        if(self){
            this.view.nickname.string = self.nickName;
            let nickName:string = `${self.nickName}`;
            this.view.setAvatar(Number(self.icon));
            this.view.setNickname(nickName);
            this.view.setVipLevel(self.vipLevel);
        }
        else{
            let iconList = [1, 2, 3, 4, 5, 6];
            let icon =  iconList[Math.floor(Math.random() * iconList.length)];
            this.view.setAvatar(icon);
            this.view.setNickname('未登录');
            this.view.setVipLevel(self.vipLevel);
        }
    }
}
