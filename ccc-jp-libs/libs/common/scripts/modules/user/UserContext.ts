import UserModel from "./models/UserModel";
import OnUserInfoUpdateSignal from "./signals/OnUserInfoUpdateSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class UserContext extends riggerIOC.ModuleContext {
    /**
     * 绑定注入
     */
    bindInjections(): void{
        cc.log(`bind injections in user context`)
        this.injectionBinder.bind(UserModel).toSingleton();
        this.injectionBinder.bind(OnUserInfoUpdateSignal).toSingleton();
    }

    /**
     * 绑定命令
     */
    bindCommands(): void{

    }

    /**
     * 绑定界面与Mediator
     */
    bindMediators(): void{

    }

    /**
     * 模块启动时的回调
     */
    protected onStart(): void{
        this.done();
    }

}
