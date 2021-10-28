import UserBriefView from "./views/UserBriefView";
import UserBriefMediator from "./views/UserBriefMediator";
import BalanceView from "./views/BalanceView";
import BalanceMediator from "./views/BalanceMediator";
import ShowSafeBoxPanelSignal from "./signals/ShowSafeBoxPanelSignal";
import MakeSureLoginedCommand from "../login/commands/MakeSureLoginedCommand";
import ShowSafeBoxPanelCommand from "./commands/ShowSafeBoxPanelCommand";
import ShowPersonalCenterPanelSignal from "../user/signals/ShowPersonalCenterPanelSingal";
import ShowPersonalCenterPanelCommand from "../user/commands/ShowPersonalCenterPanelCommand";
import LobbyMenuView from "./views/LobbyMenuView";
import LobbyMenuMediator from "./views/LobbyMenuMediator";
import RedDotUtils from "../../utils/redDot/RedDotUtils";
import RedDotNodeName from "../../utils/redDot/RedDotNodeName";

import SwitchHallSignal from "../../../libs/common/scripts/signals/SwitchHallSignal";
import NoticeSignal from "../../common/signals/NoticeSignal";
import SubGameClickCommand from "../subGames/commands/SubGameClickCommand";
import MakeSureBindMobileCommand from "../giftBox/commands/MakeSureBindMobileCommand";
import LobbyServer from "./servers/LobbyServer";
import ShowRechargePanelCommand from "../recharge/commands/ShowRechargePanelCommand";
import ShowRechargePanelByLobbySignal from "./signals/ShowRechargePanelByLobbySignal";


// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class LobbyContext extends riggerIOC.ModuleContext {
    /**
     * 绑定注入
     */
    bindInjections(): void {
        cc.log(`bind injections in Lobby context`);
        this.injectionBinder.bind(SwitchHallSignal).toSingleton();        
        this.injectionBinder.bind(NoticeSignal).toSingleton();        
        this.injectionBinder.bind(SubGameClickCommand).toSingleton();
        this.injectionBinder.bind(LobbyServer).toSingleton();
    }

    /**
     * 绑定命令
     */
    bindCommands(): void {
        // 尝试打开个人中心界面
        this.commandBinder.bind(ShowPersonalCenterPanelSignal)
        .inSequence()
        //确保已经登录
        .to(MakeSureLoginedCommand)
        //显示个人中心界面
        .to(ShowPersonalCenterPanelCommand);

        /**尝试打开保险箱界面 */
        this.commandBinder.bind(ShowSafeBoxPanelSignal)
        .inSequence()
        //确保已经绑定手机号
        .to(MakeSureBindMobileCommand)
        //显示保险箱界面
        .to(ShowSafeBoxPanelCommand);
        
        // this.commandBinder.bind( OnClickSignal ).to( SubGameClickCommand );

        this.commandBinder.bind(ShowRechargePanelByLobbySignal)
        .inSequence()
        .to(MakeSureBindMobileCommand)
        .to(ShowRechargePanelCommand);
    }

    /**
     * 绑定界面与Mediator
     */
    bindMediators(): void {
        this.mediationBinder.bind(UserBriefView).to(UserBriefMediator);
        this.mediationBinder.bind(BalanceView).to(BalanceMediator);
        this.mediationBinder.bind(LobbyMenuView).to(LobbyMenuMediator);    
    }

    /**
     * 模块启动时的回调
     */
    protected onStart(): void {
        RedDotUtils.registrRedDot(RedDotNodeName.TOP_NODE_ACTIVITY); //注册红点
        RedDotUtils.registrRedDot(RedDotNodeName.TOP_NODE_NOTICE); //注册红点
        RedDotUtils.registrRedDot(RedDotNodeName.TOP_NODE_MAIL); //注册红点
        this.done();
    }
}
