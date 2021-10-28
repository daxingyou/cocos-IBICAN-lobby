import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import PanelPopPlayCommand from "../commands/PanelPopPlayCommand";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class LobbySoundServer extends riggerIOC.Server {
    constructor() {
        super();
        this.addEventListener();
    }

    dispose() {
        this.removeEventListener();
    }

    private onPanelPop(panelName: string) {
        let cmd = new PanelPopPlayCommand();
        cmd.execute(panelName);
    }

    private addEventListener(): void {
        UIManager.instance.panelPopSignal.on(this, this.onPanelPop);
    }

    private removeEventListener(): void {
        UIManager.instance.panelPopSignal.off(this, this.onPanelPop);
        
    }

}   
