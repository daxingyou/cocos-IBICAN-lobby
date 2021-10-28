import ShowPopularizePanelSignal from "./signals/ShowPopularizePanelSignal";
import MakeSureBindMobileCommand from "../giftBox/commands/MakeSureBindMobileCommand";
import StartPopularizeUpgradeUserSignal from "./signals/StartPopularizeUpgradeUserSignal";
import ShowPopularizeHelpViewSignal from "./signals/ShowPopularizeHelpViewSignal";
import ShowPopularizeReceiveRecordsSignal from "./signals/ShowPopularizeReceiveRecordsSignal";
import ShowPopularizeWithdrawalCommissionSignal from "./signals/ShowPopularizeWithdrawalCommissionSignal";
import ShowPopularizeRebateListPanelSignal from "./signals/ShowPopularizeRebateListPanelSignal";
import PopularizeServer from "./server/PopularizeServer";
import PopularizeRecordsView from "./views/PopularizeRecordsView";
import PopularizeRecordsMediator from "./mediator/PopularizeRecordsMediator";
import PopularizeReceiveRecordsPanel from "./views/PopularizeReceiveRecordsPanel";
import PopularizeReceiveRecordsMediator from "./mediator/PopularizeReceiveRecordsMediator";
import ShowPopularizeCodeImageSignal from "./signals/showPopularizeCodeImageSignal";
import PopularizeUserBriefView from "./views/PopularizeUserBriefView";
import PopularizeUserBriefMediator from "./mediator/PopularizeUserBriefMediator";
import PopularizeModel from "./model/PopularizeModel";
import ShowPopularizePanelCommand from "./commands/ShowPopularizePanelCommand";
import ShowPopularizeHelpViewCommand from "./commands/ShowPopularizeHelpViewCommand";
import ShowPopularizeReceiveRecordsCommand from "./commands/ShowPopularizeReceiveRecordsCommand";
import ShowPopularizeWithdrawalCommissionCommand from "./commands/ShowPopularizeWithdrawalCommissionCommand";
import ShowPopularizeRebateListCommand from "./commands/ShowPopularizeRebateListCommand";
import ShowPopularizeCodeImageCommand from "./commands/ShowPopularizeCodeImageCommand";
import LobbyMarqueeServer from "../marquee/server/LobbyMarqueeServer";

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

@ccclass
export default class PopularizeContext extends riggerIOC.ModuleContext {
    constructor(app: riggerIOC.ApplicationContext){
        super(app);
    }


    bindInjections(): void {
        this.injectionBinder.bind(PopularizeServer).toValue(new PopularizeServer());
        this.injectionBinder.bind(PopularizeModel).toSingleton();
        // this.injectionBinder.bind(StartPopularizeUpgradeUserSignal).toSingleton();  
        this.injectionBinder.bind(ShowPopularizeHelpViewSignal).toSingleton();  
        this.injectionBinder.bind(ShowPopularizeReceiveRecordsSignal).toSingleton();  
        this.injectionBinder.bind(ShowPopularizeWithdrawalCommissionSignal).toSingleton();  
        this.injectionBinder.bind(ShowPopularizeRebateListPanelSignal).toSingleton();  
        // this.injectionBinder.bind(LobbyMarqueeServer).toSingleton();
    }

    bindCommands(): void {
        this.commandBinder.bind(ShowPopularizePanelSignal)
        .inSequence()
        // .to(MakeSureBindMobileCommand)
        .to(ShowPopularizePanelCommand);
        this.commandBinder.bind(StartPopularizeUpgradeUserSignal).to(MakeSureBindMobileCommand);

        this.commandBinder.bind(ShowPopularizeHelpViewSignal).to(ShowPopularizeHelpViewCommand)
        this.commandBinder.bind(ShowPopularizeReceiveRecordsSignal).to(ShowPopularizeReceiveRecordsCommand);
        this.commandBinder.bind(ShowPopularizeWithdrawalCommissionSignal).to(ShowPopularizeWithdrawalCommissionCommand);
        this.commandBinder.bind(ShowPopularizeRebateListPanelSignal).to(ShowPopularizeRebateListCommand);
        this.commandBinder.bind(ShowPopularizeCodeImageSignal).to(ShowPopularizeCodeImageCommand);
    }

    bindMediators(): void {
        this.mediationBinder.bind(PopularizeRecordsView).to(PopularizeRecordsMediator);
        this.mediationBinder.bind(PopularizeReceiveRecordsPanel).to(PopularizeReceiveRecordsMediator);
        this.mediationBinder.bind(PopularizeUserBriefView).to(PopularizeUserBriefMediator);
    }

    onStart() {
        this.done();
    }
}
