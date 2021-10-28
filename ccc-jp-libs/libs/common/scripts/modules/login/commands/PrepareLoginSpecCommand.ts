import LoginRequest from "../models/LoginRequest";
import SituationServer from "../../situation/servers/SituationServer";

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
 * 准备登录描述信息的命令
 * 此命令为后续的登录命令做好准备
 * 获取步骤:
 * 1. 从局部环境中获取，也即本运行沙箱内
 * 2. 从全局环境中获取
 * 3. 通过和用户的交互获取
 */
@riggerIOC.autoDispose
export default class PrepareLoginSpecCommand extends riggerIOC.WaitableCommand {

    @riggerIOC.inject(SituationServer)
    private sitServer:SituationServer;

    async execute(){
        let spec: LoginRequest = await this.sitServer.getLoginSpec();
        this.done(spec);
    }
}
