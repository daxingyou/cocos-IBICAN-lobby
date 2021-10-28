import LoginModel from "../../../../libs/common/scripts/modules/login/models/LoginModel";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import ChangeSceneSignal from "../../../../libs/common/scripts/modules/scene/signals/changeSceneSignal";
import LobbySceneNames from "../../scene/LobbySceneNames";
import SubGamesModel from "../../subGames/models/SubGamesModel";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";

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
export default class ExitLoginCommand extends riggerIOC.Command {
    @riggerIOC.inject(LoginModel)
    private loginModel: LoginModel;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;

    @riggerIOC.inject(ChangeSceneSignal)
    private changeSceneSignal: ChangeSceneSignal;

    @riggerIOC.inject(SubGamesModel)
    private subGameModel: SubGamesModel;

    @riggerIOC.inject(NetworkServer)
    private networkServer: NetworkServer;

    constructor() {
        super();
    }

    execute() {
        if(!this.loginModel.isLogined) return;
        this.networkServer.closeDefault();
        this.loginModel.isLogined = false;
        // this.subGameModel.makeUninitlized();
        this.subGameModel.reset();
        this.lobbyUserModel.resetUserInfo();
        UIManager.instance.resetPanelPopRecord();
        this.changeSceneSignal.dispatch([LobbySceneNames.LOBBY_LOGIN_SCENE, null, null])
        // cc.game.restart();
    }
}
