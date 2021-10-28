import LoginRequest from "../models/LoginRequest";

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
 * 请求登录通行证系统的命令
 * 如果只传递了第一个参数，则将其当作token往下传递
 * 此命令完成后，会将一个token传递给下一个命令
 */
export default class RequestLoginPassportCommand extends riggerIOC.WaitableCommand {
    async execute(_, req: LoginRequest) {
        this.done(req);
    }

    onCancel():void{
        
    }


}
