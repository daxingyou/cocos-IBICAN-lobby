import SituationServer from "../../../../libs/common/scripts/modules/situation/servers/SituationServer";
import SituationModel from "../../../../libs/common/scripts/modules/situation/models/SituationModel";
import BaseConnectionSpec from "../../../../libs/common/scripts/modules/network/servers/BaseConnectionSpec";
import LobbyConstants from "../../../LobbyConstants";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class LobbySituationServer extends SituationServer {

    @riggerIOC.inject(SituationModel)
    private model: SituationModel;

    constructor() {
        super();
        this.model.isInLobby = true;
        // this.model.isInVerifier = true;
        // riggerIOC.ApplicationContext.debug = true;
    }

    getConnectionSpecByInject(): BaseConnectionSpec {        
        return new BaseConnectionSpec((<LobbyConstants>this.constants).jpLobbyServerUrl)
    }
}
