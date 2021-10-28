import Panel from "../../../../libs/common/scripts/utils/Panel";
import { MaintenancePush, Maintenance } from "../../../protocol/protocols/protocols";
import LobbySceneNames from "../../scene/LobbySceneNames";
import LoginServer from "../../../../libs/common/scripts/modules/login/servers/LoginServer";
import LobbyLoginServer from "../../login/servers/LobbyLoginServer";
import MaintenanceNoticeInfo from "../../login/tasks/MaintenanceNoticeInfo";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";

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
export default class MaintenancePanel extends Panel {
    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property(cc.Button)
    public confirmBtn: cc.Button = null;

    @property(cc.Label)
    public titleTxt: cc.Label = null;

    @property(cc.RichText)
    public contentTxt: cc.RichText = null;

    @riggerIOC.inject(LoginServer)
    private lobbyLoginServer: LobbyLoginServer;

    constructor() {
        super();
    }

    onShow() {
        super.onShow();
        this.addEventListener();
    }

    onHide() {
        super.onHide();
        this.removerEventListener();
    }

    public maintenanceId: number;
    onExtra([maintenanceTitle, maintenanceContent, id]: [string, string, number]) {
        this.titleTxt.string = maintenanceTitle;
        this.contentTxt.string = this.formatStr(maintenanceContent);
        this.maintenanceId = id;
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onExitClick, this);
        this.confirmBtn.node.on('click', this.onExitClick, this);
    }

    removerEventListener() {
        this.closeBtn.node.on('click', this.onExitClick, this);
        this.confirmBtn.node.on('click', this.onExitClick, this);
    }

    private formatStr(str: string): string {
        str = str.replace(/\[/g, '<');
        str = str.replace(/\]/g, '>');
        return str;
    }

    //是否维护结束
    public isMaintenanceOver: boolean = false;
    async onExitClick() {
        let currentSceneName = cc.director.getScene().name;
        if(currentSceneName && currentSceneName == LobbySceneNames.LOBBY_LOGIN_SCENE) {
            //请求维护公告
            let task = this.lobbyLoginServer.requestMaintanceNotice();
            let notice: riggerIOC.Result<MaintenanceNoticeInfo> = await task.wait();
            if(notice.isOk && notice.result.status == 2) {
                cc.game.end();
            }
            else {
                cc.game.restart();
            }
        }
        else {
            if(!this.isMaintenanceOver) cc.game.end();
            else cc.game.restart();
        }
    }

}
