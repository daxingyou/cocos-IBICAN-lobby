import BaseUserInfo from "../../../../libs/common/scripts/modules/user/models/BaseUserInfo";
import { LoginResp, UserAlipay, UserBank, UserInfo } from "../../../protocol/protocols/protocols";
import BankType from "../../recharge/models/BankType";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class LobbyUserInfo extends BaseUserInfo {
    /**昵称修改次数 */
    public modifyNicknameCount: number;

    /**绑定的支付宝信息 */
    public bindAlipay: UserAlipay;

    /**绑定的银行信息 */
    public bindBanks: UserBank;

    /**VIP等级 */
    public vipLevel: number;

    

    /**
     * 更新余额,默认会
     * @param newBalance 
     */
    updateBalance(newBalance: number): void {
        super.updateBalance(newBalance / 100);
    }

    constructor(resp: UserInfo) {
        super();
        this.userId = resp.userId;
        this.nickName = resp.nickname;
        this.balance = resp.balance / 100;
        // this.balance = resp.userInfo.balance;
        this.mobile = resp.mobile;
        this.icon = resp.avatar + '';
        this.modifyNicknameCount = resp.modifyNicknameCount;
        this.bindAlipay = resp.userAlipay ? resp.userAlipay : null;
        this.bindBanks = resp.userBank ? resp.userBank[0] : null;
        this.vipLevel = 0;
    }
}
