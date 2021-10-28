import ShowRankPanelSignal from "./signals/ShowRankPanelSignal";
import ShowRankPanelCommand from "./commands/ShowRankPanelCommand";
import RankEarnGoldView from "./views/RankEarnGoldView";
import RankEarnGoldMediator from "./mediator/RankEarnGoldMediator";
import RankDrawCommissionView from "./views/RankDrawCommissionView";
import RankDrawCommissionMediator from "./mediator/RankDrawCommissionMediator";
import RankServer from "./server/RankServer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RankContext extends riggerIOC.ModuleContext {
    constructor(app: riggerIOC.ApplicationContext){
        super(app);
    }

    bindInjections(): void {
        // this.injectionBinder.bind(RechargeServer).toValue(new RechargeServer());
        this.injectionBinder.bind(RankServer).toValue(new RankServer());
        this.injectionBinder.bind(ShowRankPanelSignal).toSingleton();
    }

    bindCommands(): void {
        this.commandBinder.bind(ShowRankPanelSignal)
        .inSequence()
        .to(ShowRankPanelCommand);
    }

    bindMediators(): void {
        this.mediationBinder.bind(RankEarnGoldView).to(RankEarnGoldMediator);
        this.mediationBinder.bind(RankDrawCommissionView).to(RankDrawCommissionMediator);
    }

    onStart() {
        this.done();
    }
}
