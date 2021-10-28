import SituationModel from "../../situation/models/SituationModel";
import PassPortInfo from "./PassportInfo";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class LoginModel extends riggerIOC.Model {
    @riggerIOC.inject(SituationModel)
    situationModel: SituationModel;

    public get passPorts(): { [key: string]: PassPortInfo } {
        if (!this.mPassPorts) this.mPassPorts = {};
        return this.mPassPorts;
    }
    protected mPassPorts: { [key: string]: PassPortInfo } = {};

    /**
     * 当前登录/激活的帐户，如果特殊情况下没有帐号，如只有TOKEN，则为TOKEN
     */
    public activatedAccount: string = null;

    /**
     * 是否有帐号登录了
     */
    public get isLogined(): boolean {
        // return !!this.activatedAccount;
        return this.mLogined;
    }

    public set isLogined(v: boolean) {
        this.mLogined = v;
    }
    private mLogined: boolean = false;

    /**登录平台 */
    public get platform(): platformType {
        return this._platform;
    }

    public set platform(v: platformType) {
        this._platform = v;
    }
    private _platform: platformType;

    dispose(): void {
        cc.log(`dispose login model`);
        super.dispose();
    }

    updatePassPort(info: PassPortInfo): void {
        this.passPorts[info.account] = info;
    }

    updatePassPortToken(account: string, token: string) {
        let old: PassPortInfo = this.passPorts[account];
        if (!old) old = this.passPorts[account] = new PassPortInfo(account);
        old.token = token;
    }

    /**
     * 记住通行证信息,保存在本地
     * @param info 
     */
    saveLocalPassPort(info: PassPortInfo): void {
        let jsonStr: string = `{`;
        if (info.platform) jsonStr += `"platform":"${info.platform}",`;
        if (info.account) jsonStr += `"account":"${info.account}",`;
        if (info.token) jsonStr += `"token":"${info.token}",`;
        if (info.tokenSeconds) jsonStr += `"tokenSeconds":"${info.tokenSeconds}",`;
        if (info.userId) jsonStr += `"userId":"${info.userId}",`;
        if (info.nickName) jsonStr += `"nickName":"${info.nickName}",`;
        if (info.icon) jsonStr += `"icon":"${info.icon}",`;
        jsonStr = jsonStr.substring(0, jsonStr.length - 1);
        jsonStr += `}`;
        cc.sys.localStorage.setItem(info.account, jsonStr);
    }

    /**
     * 储存最近使用的账号
     * @param account 
     */
    saveRecentlyUsedAccount(account: string) {
        cc.sys.localStorage.setItem('recentlyUsed', account);
    }

    /**
     * 获取存储在本地的指定账户的通讯信息
     * @param account 
     */
    getLocalPassPort(account: string): PassPortInfo {
        let value: string = cc.sys.localStorage.getItem(account);
        if (!value || value.length <= 0) return null;
        let obj = JSON.parse(cc.sys.localStorage.getItem(account));
        let info: PassPortInfo = new PassPortInfo(obj.account);
        info.icon = obj.icon;
        info.nickName = obj.nickName;
        info.platform = obj.platform;
        info.token = obj.token;
        info.tokenSeconds = obj.tokenSeconds;
        info.userId = obj.userId;
        return info;
    }

    /**
     * 删除存储在本地的指定账号的通行证信息 
     * @param account 
     */
    deleteLocalPassPort(account: string) {
        cc.sys.localStorage.removeItem(account);
    }

    /**
     * 获取本地存储种最近时间使用的一个账号
     */
    public getRecentlyUsedAccount(): { account: string, tokenInfo: { token: string, tokenSeconds: number } } {
        let account: string = cc.sys.localStorage.getItem('recentlyUsed');
        if (account && account.length > 0) {
            let tokenInfo: { token: string, tokenSeconds: number };
            let value = cc.sys.localStorage.getItem(account);
            if (!value || value.length <= 0) return { account: account, tokenInfo: null };
            let obj = JSON.parse(value);
            obj && (tokenInfo = { token: obj.token, tokenSeconds: obj.tokenSeconds });
            if (tokenInfo) {
                return { account: account, tokenInfo: tokenInfo };
            }
        }
        return null;
    }


    public isPhoneNumValid(phone: string): boolean {
        if (!phone) return false;
        if (phone.length !== 11) return false;

        let n: number = Number(phone);
        if (n == NaN) {
            return false
        }
        else {
            return true;
        }
    }

    // public isPasswordValid(pw: string): boolean {
    //     return pw && pw.length >= 6;
    // }

    /**
     * 密码是否符合规则 6-12位数字和字母的组合
     * @param pwd 
     */
    public isVaildPwd(pwd: string): boolean {
        if (pwd.length <= 0) return true;
        let re = /^[a-zA-Z0-9]{6,12}$/; //数字字母均可
        let reNumber = /^[0-9]{6,12}$/; //数字
        let reString = /^[a-zA-Z]{6,12}$/; //字母
        if (re.test(pwd) && !reNumber.test(pwd) && !reString.test(pwd)) {
            return true;
        }
        return false
    }

    public isVerifCodeValid(code: string): boolean {
        return true;
    }

    /**
     * 检查昵称是否有效
     * @param name 
     */
    public isValidNickname(name: string) {
        let re = /^[a-zA-Z0-9]{6,12}$/; //数字字母均可
        let recharacters = /^[\u4e00-\u9fa5]{2,6}$/; //汉字均可
        if (re.test(name) || recharacters.test(name)) {
            return true;
        }
        else {
            return false;
        }
    }
}

/**登录平台类型 1-通行证 2-微信 3-设备 */
export enum platformType {
    passport = 1,
    wexin,
    device
}
