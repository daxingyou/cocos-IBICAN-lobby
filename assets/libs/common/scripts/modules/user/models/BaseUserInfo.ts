import OnUserInfoUpdateSignal from "../signals/OnUserInfoUpdateSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
/**
 * 玩家基础信息
 */
export default class BaseUserInfo {
    @riggerIOC.inject(OnUserInfoUpdateSignal)
    private onUserInfoUpdateSignal: OnUserInfoUpdateSignal;

    userId: string | number;
    mobile: string;
    nickName: string;
    icon: string;
    balance: number;
    type: string | number;
    gm: string | number;

    /**
     * 更新余额，更新完后会触发:OnUserInfoUpdateSignal
     * @param balance 
     */
    updateBalance(balance: number): void {
        this.balance = balance;
        this.onUserInfoUpdateSignal.dispatch();
    }

    updateMobile(mobile: string): void {
        this.mobile = mobile;
        this.onUserInfoUpdateSignal.dispatch();
    }

    updateNickName(nickName: string): void {
        this.nickName = nickName;
        this.onUserInfoUpdateSignal.dispatch();
    }

    updateIcon(icon: string): void {
        this.icon = icon;
        this.onUserInfoUpdateSignal.dispatch();
    }
}
