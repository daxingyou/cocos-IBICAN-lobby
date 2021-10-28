import JPMediator from "../../../utils/JPMediator";
import LoginModel from "../models/LoginModel";
import RequestLoginSignal from "../signals/RequestLoginSignal";
import OnLoginSuccessSignal from "../signals/OnLoginSuccessSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class BaseLoginMediator extends JPMediator {
    @riggerIOC.inject(LoginModel)
    protected model:LoginModel;

    @riggerIOC.inject(RequestLoginSignal)
    protected loginSignal: RequestLoginSignal;

    @riggerIOC.inject(OnLoginSuccessSignal)
    protected onLoginSuccessSignal: OnLoginSuccessSignal
}
