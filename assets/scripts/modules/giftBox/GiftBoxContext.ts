import GiftBoxServer from "./servers/GiftBoxServer";
import ShowFirstChargePanelSignal from "./signals/ShowFirstChargePanelSignal";
import ShowFirstChargePanelCommand from "./commands/ShowFirstChargePanelCommand";
import ShowBindPhonePanelSignal from "./signals/ShowBindPhonePanelSignal";
import ShowBindPhonePanelCommand from "./commands/ShowBindPhonePanelCommand";
import MakeSureBindMobileCommand from "./commands/MakeSureBindMobileCommand";
import BindPhoneCompleteSignal from "./signals/BindPhoneCompleteSignal";
import GiftBoxModel from "./models/GiftBoxModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GiftBoxContext extends riggerIOC.ModuleContext {
    /**
     * 绑定注入
     */
    bindInjections(): void {
        cc.log(`bind injections in Lobby context`);
        this.injectionBinder.bind(GiftBoxServer).toValue(new GiftBoxServer());
        this.injectionBinder.bind(BindPhoneCompleteSignal).toSingleton();
        this.injectionBinder.bind(GiftBoxModel).toSingleton();
    }

    /**
     * 绑定命令
     */
    bindCommands(): void {
        this.commandBinder.bind(ShowFirstChargePanelSignal)
        .inSequence()
        .to(MakeSureBindMobileCommand)
        .to(ShowFirstChargePanelCommand);

        this.commandBinder.bind(ShowBindPhonePanelSignal)
        .to(ShowBindPhonePanelCommand);
    }

    /**
     * 绑定界面与Mediator
     */
    bindMediators(): void {
     
    }

    /**
     * 模块启动时的回调
     */
    protected onStart(): void {
        this.done();
    }
}
