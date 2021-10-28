import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import { LoginResp, UserInfo } from "../../../protocol/protocols/protocols";
import LobbyUserInfo from "./LobbyUserInfo";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class LobbyUserModel extends UserModel {

    public updateUserInfo(resp: UserInfo): void {
        this.mSelf = new LobbyUserInfo(resp);
        this.onUserInfoUpdateSignal.dispatch(this.mSelf);
    }

    public updateUserBalance(balance: number):void
    {
        (this.self as LobbyUserInfo).updateBalance(balance);
    }

    public resetUserInfo(): void {
        this.mSelf = null;
        this.onUserInfoUpdateSignal.dispatch(this.mSelf);
    }
}
