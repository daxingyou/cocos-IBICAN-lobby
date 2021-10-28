import { Password, Token, AccountT } from "./LoginDefinitions";
import { ShareCode } from "../../../../../native/NativeUtils";

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
 * 定义了登录需要的信息
 */
export default class LoginRequest {
    // 帐号
    public account?: AccountT;
    // 密码
    public password?: Password;
    // 令牌
    public token?: Token;
    //令牌有效时间戳
    public tokenTimeStamp?: number;
    //验证码
    public authCode?: string;
    //是否记住密码
    public ifStorePassword:boolean = false;
    //设备id
    public deviceId?: string;
    //登录模式 1.通行证 2.微信 3.设备
    public platform: number = 1;
    //分享标识
    public shareCode?: ShareCode;
    constructor() {
    }
}
