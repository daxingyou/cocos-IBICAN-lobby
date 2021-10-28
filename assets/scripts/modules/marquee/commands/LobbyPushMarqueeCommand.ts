import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import LobbyMarqueePanel from "../views/LobbyMarqueePanel";
import LobbySceneNames from "../../scene/LobbySceneNames";

export default class LobbyPushMarqueeCommand extends riggerIOC.WaitableCommand {
    private panel: LobbyMarqueePanel;

    async execute() {
        if(cc.director.getScene().name != LobbySceneNames.MainScene) {
            if(this.panel) {
                cc.log(`now hide Marqueue panel`)
                UIManager.instance.hidePanel(this.panel);
                this.panel = null;
                this.done();
            }
            return;
        }
        if (this.panel) return;

        this.panel = <LobbyMarqueePanel>UIManager.instance.showPanel(LobbyMarqueePanel, LayerManager.marqueeLayerName, false);
        cc.log(" this panel show panel ", this.panel)
        this.panel.prepare();
        await this.panel.wait();
        
        cc.log(`now hide Marqueue panel`)
        UIManager.instance.hidePanel(this.panel);
        this.panel = null;
        this.done();
    }
}