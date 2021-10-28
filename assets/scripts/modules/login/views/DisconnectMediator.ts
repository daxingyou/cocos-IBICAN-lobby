import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import DisconnectPanel from "./DisconnectPanel";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class DisconnectMediator extends JPMediator {
    @riggerIOC.inject(DisconnectPanel)
    protected view: DisconnectPanel;

    constructor() {
        super();
    }

    onShow() {
        this.view.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.view.reconnectBtn.node.on('click', this.onReconnectBtnClick, this);
    }

    onHide() {
        this.view.closeBtn.node.off('click', this.onCloseBtnClick, this);
        this.view.reconnectBtn.node.off('click', this.onReconnectBtnClick, this);

    }

    private onCloseBtnClick() {
        this.view.done(false);
        this.view.closeWindow();
    }

    private onReconnectBtnClick() {
        this.view.done(true);
        this.view.closeWindow();
    }
}
