import TipsContext from "../../../libs/common/scripts/modules/tips/TipsContext";
import PushTipsQueueSignal from "../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import LobbyTipCommand from "./command/LobbyTipCommand";
import PushWaitingQueueSignal from "../../../libs/common/scripts/modules/tips/signals/PushWaitingQueueSignal";
import PushWaitingQueueCommand from "../../../libs/common/scripts/modules/tips/commands/PushWaitingQueueCommand";
import BaseWaitingPanel from "../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import BaseWaitingMediator from "../../../libs/common/scripts/modules/tips/views/BaseWaitingMediator";
import BaseAlertPanel from "../../../libs/common/scripts/modules/tips/views/BaseAlertPanel";
import BaseAlertMediator from "../../../libs/common/scripts/modules/tips/views/BaseAlertMediator";
import LobbyTipsPanel from "./views/LobbyTipsPanel";
import LobbyTipsMediator from "./LobbyTipsMediator";
import LobbyPushTipsQueueSignal from "./signals/LobbyPushTipsQueueSignal";
import PushTipsQueueCommand from "../../../libs/common/scripts/modules/tips/commands/PushTipsQueueCommand";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class LobbyTipsContext extends TipsContext {
    bindInjections():void{
        super.bindInjections();
        this.injectionBinder.bind(LobbyTipCommand).to(PushTipsQueueCommand);
        // this.injectionBinder.bind(PushTipsQueueSignal).toValue(new LobbyPushTipsQueueSignal());
        // this.injectionBinder.bind(LobbyTipCommand).toSingleton();
    }

    /**
     * 绑定命令
     */
    bindCommands(): void {
        super.bindCommands();
        // this.commandBinder.bind(PushTipsQueueSignal).to(LobbyTipCommand);        
        this.commandBinder.bind(PushWaitingQueueSignal).to(PushWaitingQueueCommand);
    }

    /**
     * 绑定界面与Mediator
     */
    bindMediators(): void {     
        super.bindMediators()   
        this.mediationBinder.bind(LobbyTipsPanel).to(LobbyTipsMediator);
        this.mediationBinder.bind(BaseWaitingPanel).to(BaseWaitingMediator);
        this.mediationBinder.bind(BaseAlertPanel).to(BaseAlertMediator);
    }
}
