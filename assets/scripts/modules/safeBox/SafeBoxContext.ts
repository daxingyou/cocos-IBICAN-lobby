import SafeBoxServer from "./servers/SafeBoxServer";
import SafeBoxModel from "./models/SafeBoxModel";
import SafeBoxPanel from "./views/SafeBoxPanel";
import InputPwdPanel from "./views/InputPwdPanel";
import InputPwdMediator from "./views/InputPwdMediator";
import SafeBoxMediator from "./views/SafeBoxMediator";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class SafeBoxContext extends riggerIOC.ModuleContext {
    /**
     * 绑定注入
     */
    bindInjections(): void {
        this.injectionBinder.bind(SafeBoxServer).toSingleton();
        this.injectionBinder.bind(SafeBoxModel).toValue(new SafeBoxModel());
    }

    /**
     * 绑定命令
     */
    bindCommands(): void {
    }

    /**
     * 绑定界面与Mediator
     */
    bindMediators(): void {
        this.mediationBinder.bind(SafeBoxPanel).to(SafeBoxMediator);
        this.mediationBinder.bind(InputPwdPanel).to(InputPwdMediator);
    }

    /**
     * 模块启动时的回调
     */
    protected onStart(): void {
        this.done();
    }

}
