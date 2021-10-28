import JPMediator from "../../../utils/JPMediator";
import BaseRegisterPanel from "./BaseRegisterPanel";
import RequestVerifyCodeSignal from "../signals/RequestVerifyCodeSignal";
import RequestRegisterSignal from "../signals/RequestRegisterSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class BaseRegisterMediator extends JPMediator {
    // 
    @riggerIOC.inject(BaseRegisterPanel)
    protected view: BaseRegisterPanel;

    // 请求注册验证码信号
    @riggerIOC.inject(RequestVerifyCodeSignal)
    protected requestVerifyCodeSignal: RequestVerifyCodeSignal;

    /**
     * 请求注册的信号
     */
    @riggerIOC.inject(RequestRegisterSignal)
    protected requestRegisterSignal: RequestRegisterSignal
    
}
