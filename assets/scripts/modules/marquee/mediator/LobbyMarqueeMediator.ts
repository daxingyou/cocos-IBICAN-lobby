import LobbyMarqueePanel from "../views/LobbyMarqueePanel";
import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import LobbyMarqueePlayEndOnceSignal from "../signals/LobbyMarqueePlayEndOnceSignal";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LobbyMarqueeModel from "../model/LobbyMarqueeModel";

export default class LobbyMarqueeMediator extends JPMediator {
    @riggerIOC.inject(LobbyMarqueePlayEndOnceSignal)
    private playNextMsgSignal: LobbyMarqueePlayEndOnceSignal;

    @riggerIOC.inject(LobbyMarqueePanel)
    protected view: LobbyMarqueePanel;

    @riggerIOC.inject(LobbyMarqueeModel)
    private model: LobbyMarqueeModel;

    async onShow(){
        this.addEventListener();
        this.playNextMessage();
    }

    onHide(): void {
        
        this.removeEventListener();
    }

    public addEventListener() {
        this.playNextMsgSignal.on(this, this.playNextMessage);
    }

    public removeEventListener() {
        this.playNextMsgSignal.off(this, this.playNextMessage);
    }

    private async playNextMessage() {
        await this.view.playNext();        
    }

}