// import UserInfoContext from "./modules/userInfo/UserInfoContext";
import AssetsContext from "../libs/common/scripts/modules/assets/AssetsContext";
import { LobbyAssetsContext } from "./modules/assets/LobbyAssetsContext";
import SubGamesContext from "./modules/subGames/SubGamesContext";
import StartContext from "../libs/common/scripts/modules/start/StartContext";
import LobbyStartContext from "./modules/start/LobbyStartContext";
import LobbyContext from "./modules/lobby/LobbyContext";
import LobbyLoginContext from "./modules/login/LobbyLoginContext";
import LoginContext from "../libs/common/scripts/modules/login/LoginContext";
import UserContext from "../libs/common/scripts/modules/user/UserContext";
import LobbyUserContext from "./modules/user/LobbyUserContext";
import SituationContext from "../libs/common/scripts/modules/situation/SituationContext";
import LobbySituationContext from "./modules/situation/LobbySituationContext";
import ShowChangePwdPanelSignal from "./common/signals/ShowChangePwdPanelSignal";
import ShowChangePwdCommand from "./common/commands/ShowChangePwdCommand";
import SettingsContext from "../libs/common/scripts/modules/settings/SettingsContext";
import LobbySettingContext from "./modules/setting/LobbySettingContext";
import ActivityContext from "./modules/activity/ActivityContext";
import SafeBoxContext from "./modules/safeBox/SafeBoxContext";
import RechargeContext from "./modules/recharge/RechargeContext";
import GiftBoxContext from "./modules/giftBox/GiftBoxContext";
import NetworkContext from "../libs/common/scripts/modules/network/NetworkContext";
import LobbyNetworkContext from "./modules/network/LobbyNetworkContext";
import Constants from "../libs/common/scripts/Constants";
import LobbyConstants from "./LobbyConstants";
import TipsContext from "../libs/common/scripts/modules/tips/TipsContext";
import LobbyTipsContext from "./modules/tips/LobbyTipsContext";
import CommonContext from "../libs/common/scripts/CommonContext";
import SoundContext from "../libs/common/scripts/modules/sound/SoundContext";
import LobbySoundContext from "./modules/sound/LobbySoundContext";
import PopularizeContext from "./modules/popularize/PopularizeContext";
import RankContext from "./modules/rank/RankContext";
import LobbyMarqueeContext from "./modules/marquee/LobbyMarqueeContext";
import LobbyMailContext from "./modules/mail/LobbyMailContext";
import SceneContext from "../libs/common/scripts/modules/scene/SceneContext";
import LobbySceneContext from "./modules/scene/LobbySceneContext";

@MainLogicService.makeEntrance("lobby")
export class LobbyAppAppContext extends CommonContext {
    constructor() {
        super();
    }

    bindInjections(): void {
        super.bindInjections();
        this.injectionBinder.bind(Constants).to(LobbyConstants);

        this.injectionBinder.bind(AssetsContext).to(LobbyAssetsContext);
        this.injectionBinder.bind(StartContext).to(LobbyStartContext);
        this.injectionBinder.bind(LoginContext).to(LobbyLoginContext);
        this.injectionBinder.bind(UserContext).to(LobbyUserContext);
        this.injectionBinder.bind(SituationContext).to(LobbySituationContext);
        this.injectionBinder.bind(SettingsContext).to(LobbySettingContext);
        this.injectionBinder.bind(TipsContext).to(LobbyTipsContext);
        this.injectionBinder.bind(NetworkContext).to(LobbyNetworkContext);
        this.injectionBinder.bind(SoundContext).to(LobbySoundContext);
        this.injectionBinder.bind(SceneContext).to(LobbySceneContext);
    }

    bindCommands(): void {
        super.bindCommands();
        this.commandBinder.bind(ShowChangePwdPanelSignal).to(ShowChangePwdCommand);
    }

    registerOptionalModuleContexts(): void {
        this.addModuleContext(SubGamesContext);
        this.addModuleContext(LobbyContext);
        this.addModuleContext(SafeBoxContext);
        this.addModuleContext(ActivityContext);
        this.addModuleContext(GiftBoxContext);
        this.addModuleContext(RechargeContext);        
        this.addModuleContext(PopularizeContext);        
        this.addModuleContext(RankContext);        
        this.addModuleContext(LobbyMarqueeContext);        
        this.addModuleContext(LobbyMailContext);        
    }
 
    async onInit(){
        super.onInit();
        // await riggerIOC.waitForSeconds(5000);
        // cc.log(`now stop app`);
        // this.dispose();
    }
}
