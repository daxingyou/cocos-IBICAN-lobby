import ShowRechargePanelSignal from "./signals/ShowRechargePanelSignal";
import MakeSureLoginedCommand from "../login/commands/MakeSureLoginedCommand";
import ShowRechargePanelCommand from "./commands/ShowRechargePanelCommand";
import ShowWithdrawCashPanelSignal from "./signals/ShowWithdrawCashPanelSignal";
import ShowWithdrawCashPanelCommand from "./commands/ShowWithdrawCashPanelCommand";
import MakeSureBindMobileCommand from "../giftBox/commands/MakeSureBindMobileCommand";
import RechargeServer from "./servers/RechargeServer";
import OrderListView from "./views/OrderListView";
import OrderListMediator from "./views/OrderListMediator";
import WithdrawDetailsPanel from "./views/withdrawCash/WithdrawDetailsPanel";
import WithdrawDetatilsMediator from "./views/withdrawCash/WithdrawDetailsMediator";
import WithdrawListView from "./views/withdrawCash/WithdrawListView";
import WithdrawListMeditator from "./views/withdrawCash/WithdrawListMediator";
import RechargeModel from "./models/RechargeModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RechargeContext extends riggerIOC.ModuleContext {
    constructor(app: riggerIOC.ApplicationContext){
        super(app);
    }

    bindInjections(): void {
        this.injectionBinder.bind(RechargeModel).toSingleton();
        this.injectionBinder.bind(RechargeServer).toValue(new RechargeServer());
    }

    bindCommands(): void {
        this.commandBinder.bind(ShowRechargePanelSignal)
        .inSequence()
        .to(MakeSureBindMobileCommand)
        .to(ShowRechargePanelCommand);

        this.commandBinder.bind(ShowWithdrawCashPanelSignal)
        .inSequence()
        .to(MakeSureBindMobileCommand)
        .to(ShowWithdrawCashPanelCommand);
    }

    bindMediators(): void {
        this.mediationBinder.bind(OrderListView).to(OrderListMediator);

        this.mediationBinder.bind(WithdrawDetailsPanel).to(WithdrawDetatilsMediator);

        this.mediationBinder.bind(WithdrawListView).to(WithdrawListMeditator);
    }

    onStart() {
        this.done();
    }
}
