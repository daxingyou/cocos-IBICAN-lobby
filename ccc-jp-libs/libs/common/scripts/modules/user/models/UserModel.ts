import BaseUserInfo from "./BaseUserInfo";
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


export default class UserModel extends riggerIOC.Model {
    /**
     * 玩家信息发生变化时派发的信号
     */
    @riggerIOC.inject(OnUserInfoUpdateSignal)
    protected onUserInfoUpdateSignal: OnUserInfoUpdateSignal;

    /**
     * 自己的玩家信息，如果为空则表示还没登录
     */
    public get self(): BaseUserInfo {
        return this.mSelf;
    }
    protected mSelf: BaseUserInfo;

    // dispose(): void {

    // }
}
