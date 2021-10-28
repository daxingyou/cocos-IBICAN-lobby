import XMLHttpRequestTask from "../../../../libs/common/scripts/utils/XMLHttpRequestTask";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

export default class LoginPwdChangeTask extends XMLHttpRequestTask {
    constructor(method?: "POST" | "GET", url?: string) {
        super(method, url);
    }

    start([mobile, newPwd, oldPwd]: [string, string, string]): LoginPwdChangeTask {
        this.setParams("oldPassword", oldPwd);
        this.setParams("newPassword", newPwd);
        this.setParams("mobile", mobile);
        return super.start() as LoginPwdChangeTask;
    }

    protected onReadyStateChange(evt:Event) {
        if(this.xmlHttpRequest.response) {
            let result = JSON.parse(this.xmlHttpRequest.response);
            if(result.ret) {
                this.setComplete(result);
            }
            else {
                // this.setComplete(false);
                this.cancel(result);
            }
        }
    }
}
