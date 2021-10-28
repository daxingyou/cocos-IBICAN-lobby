import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import OnUserInfoUpdateSignal from "../../../../libs/common/scripts/modules/user/signals/OnUserInfoUpdateSignal";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import BalanceView from "./BalanceView";
import LobbyUserInfo from "../../user/model/LobbyUserInfo";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class BalanceMediator extends JPMediator {
    @riggerIOC.inject(OnUserInfoUpdateSignal)
    protected onUserInfoUpdateSignal: OnUserInfoUpdateSignal;

    @riggerIOC.inject(UserModel)
    protected userMode: UserModel;

    @riggerIOC.inject(BalanceView)
    protected view: BalanceView;

    onShow(): void {
        this.addEventListener();
        this.updateContent();
    }

    onHide(): void {
        this.removeEventListener();
    }

    private addEventListener(): void {
        this.onUserInfoUpdateSignal.on(this, this.onUserInfoUpdate)
    }

    private removeEventListener(): void {
        this.onUserInfoUpdateSignal.off(this, this.onUserInfoUpdate)
    }

    private onUserInfoUpdate() {
        this.updateContent();
    }

    private updateContent(): void {
        let self: LobbyUserInfo = this.userMode.self as LobbyUserInfo;
        if(self){
            this.view.balanceLabel.string = self.balance.toString();
        }
        else{
            this.view.balanceLabel.string = "0";
        }
    }

}
