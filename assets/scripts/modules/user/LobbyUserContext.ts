import UserContext from "../../../libs/common/scripts/modules/user/UserContext";
import UserModel from "../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "./model/LobbyUserModel";
import PersonalCenterPanel from "./views/PersonalCenterPanel";
import ShowPersonalCenterPanelCommand from "./commands/ShowPersonalCenterPanelCommand";
import ShowPersonalCenterPanelSignal from "./signals/ShowPersonalCenterPanelSingal";
import PersonalCenterMediator from "./views/PersonalCenterMediator";
import LobbyUserServer from "./servers/LobbyUserServer";
import ShowRechargePanelByUserCenterSingal from "./signals/ShowRechargePanelByUserCenterSingal";
import MakeSureBindMobileCommand from "../giftBox/commands/MakeSureBindMobileCommand";
import ShowRechargePanelCommand from "../recharge/commands/ShowRechargePanelCommand";
import PersonalInfoView from "./views/PersonalInfoView";
import PersonalInfoMediator from "./views/PersonalInfoMediator";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class LobbyUserContext extends UserContext {

    constructor(app: riggerIOC.ApplicationContext){
        super(app);
    }
    
    bindInjections(): void{
        super.bindInjections();
        this.injectionBinder.bind(UserModel).to(LobbyUserModel);
        this.injectionBinder.bind(LobbyUserServer).toValue(new LobbyUserServer());
        this.injectionBinder.bind(ShowPersonalCenterPanelSignal).toSingleton();
    }

    /**
     * 绑定命令
     */
    bindCommands(): void{
        super.bindCommands();
        this.commandBinder.bind(ShowPersonalCenterPanelSignal).to(ShowPersonalCenterPanelCommand);

        this.commandBinder.bind(ShowRechargePanelByUserCenterSingal)
        .inSequence()
        .to(MakeSureBindMobileCommand)
        .to(ShowRechargePanelCommand);
    }

    

    /**
     * 绑定界面与Mediator
     */
    bindMediators(): void{
        super.bindMediators();
        this.mediationBinder.bind(PersonalCenterPanel).to(PersonalCenterMediator);
        this.mediationBinder.bind(PersonalInfoView).to(PersonalInfoMediator);
    }
    /**
     * 模块启动时的回调
     */
    onStart(): void{
        this.done();
    }
}
