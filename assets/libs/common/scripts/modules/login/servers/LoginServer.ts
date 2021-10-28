import { Token } from "../models/LoginDefinitions";
import NetworkServer from "../../network/servers/NetworkServer";
import RegisterRequest from "../models/RegisterRequest";
import Task from "../../../utils/Task";
import LoginRequest from "../models/LoginRequest";
import UserModel from "../../user/models/UserModel";
import LoginModel from "../models/LoginModel";
import { KickUserPushSignal } from "../../../../../../scripts/protocol/signals/signals";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class LoginServer extends riggerIOC.Server {
    @riggerIOC.inject(NetworkServer)
    protected networkServer: NetworkServer;

    @riggerIOC.inject(LoginModel)
    protected loginModel: LoginModel;

    @riggerIOC.inject(KickUserPushSignal)
    protected kickUserPushSignal: KickUserPushSignal;

    /**
     * 用户数据模型
     */
    @riggerIOC.inject(UserModel)
    protected userModel: UserModel;

    constructor() {
        super();
    }

    // dispose(): void {
    // }

    requestRegister(requestData: RegisterRequest): Task {
        return
    }

    /**
     * 请求登录通行证系统
     * @param account 
     * @param password 
     */
    requestLoginPassport(request: LoginRequest): Task {
       return
    }

    requestLogin(token: Token): void {
       
    }

}
