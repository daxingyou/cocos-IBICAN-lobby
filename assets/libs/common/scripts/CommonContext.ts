import SituationContext from "./modules/situation/SituationContext";
import UserContext from "./modules/user/UserContext";
import LoginContext from "./modules/login/LoginContext";
import SettingsContext from "./modules/settings/SettingsContext";
import AssetsContext from "./modules/assets/AssetsContext";
import NetworkContext from "./modules/network/NetworkContext";
import SceneContext from "./modules/scene/SceneContext";
import StartContext from "./modules/start/StartContext";
import TipsContext from "./modules/tips/TipsContext";
import Constants from "./Constants";
import ReturnToLobbySignal from "./ReturnToLobbySignal";
import ReturnToLobbyCommand from "./ReturnToLobbyCommand";
import SoundContext from "./modules/sound/SoundContext";
import SituationModel from "./modules/situation/models/SituationModel";
import SituationServer from "./modules/situation/servers/SituationServer";
import DiagnoseUtils from "./utils/DiagnoseUtils";
import TouchFullScreen from "./utils/TouchFullScreen/TouchFullScreen";

export default class CommonContext extends riggerIOC.ApplicationContext {
    @riggerIOC.inject(SituationModel)
    private situationModel: SituationModel;

    @riggerIOC.inject(SituationServer)
    private situationServer: SituationServer;

    @riggerIOC.inject(Constants)
    private constants: Constants;

    constructor(appId?: number | string, ifLaunchImmediately: boolean = true) {
        super(appId, ifLaunchImmediately);
        if (!cc["dgUtils"]) {
            cc["dgUtils"] = DiagnoseUtils;
        }

    }

    /**
     * 是否可以返回大厅
     */
    get canReturnToLobby(): boolean {
        if (this.situationModel.isInLobby && cc["returnToLobby"]) return true;
        return !!this.situationServer.getLobbyUrl();
    }

    /**
     * 是否可以显示游戏记录
     */
    get canShowGameRecord(): boolean {
        return !!this.situationServer.getRecordUrl();
    }

    /**
     * 返回大厅
     */
    async returnToLobby() {
        if (this.situationModel.isInLobby && cc["returnToLobby"]) {
            await cc["returnToLobby"]();
        }
        else {
            // 通过lobbyUrl跳转
            let url = this.situationServer.getLobbyUrl();
            if (url) {
                window.location.href = url;
            }
            else {
                window.close();
            }
        }

        this.dispose();
    }

    /**
     * 退出游戏
     */
    exit(): void {
        this.returnToLobby();
    }

    /**
     * 显示游戏记录
     */
    showGameRecord(): void {
        let url = this.situationServer.getRecordUrl()
        if (!url) return;

        if (cc.sys.isNative) {
            // cc.sys.openURL(url);
            let params: reportParams = new reportParams();
            params.url = url;
            params.gameId = this.constants.situationId;
            cc["openReportView"] && cc["openReportView"](params);
        }
        else {
            window.open(url, "_blank");
        }
    }

    bindInjections(): void {
        cc.log("bind injections in common context")
        this.injectionBinder.bind(Constants).toSingleton();
    }

    bindCommands(): void {
        this.commandBinder.bind(ReturnToLobbySignal).to(ReturnToLobbyCommand);
    }

    /**
     * 注册模块：
     * 
     */
    registerModuleContexts(): void {
        this.registerBaseModuleContexts();
        this.registerOptionalModuleContexts();
        this.registerLateModuleContexts();
    }

    /**
     * 注册一些基础模块
     */
    protected registerBaseModuleContexts(): void {
        this.addModuleContext(SituationContext);
        this.addModuleContext(SettingsContext);
        this.addModuleContext(NetworkContext);
        this.addModuleContext(AssetsContext);
        this.addModuleContext(TipsContext);
        this.addModuleContext(SceneContext);
        this.addModuleContext(UserContext);
        this.addModuleContext(LoginContext);
        this.addModuleContext(SoundContext);
    }

    /**
     * 注册一些可选模块
     */
    protected registerOptionalModuleContexts(): void {

    }

    /**
     * 注册一些需要放在最后的模块
     */
    protected registerLateModuleContexts(): void {
        this.addModuleContext(StartContext);
    }

    onInit(): void {
        cc.log(`init common context`);
        if (!cc.sys.isNative && !this.situationModel.isInLobby && cc.sys.isMobile) {
            TouchFullScreen.instance.init();
        }
        this.injectionBinder.bind(CommonContext).toValue(this);
    }
}

export class reportParams {
    url: string;
    gameId?: number | string;
}
