import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import LobbyMailAwardsPanel from "../views/LobbyMailAwardsPanel";

export default class ShowLobbyMailAwardsPanelCommand extends riggerIOC.WaitableCommand {

    async execute(mailId: number) {
        UIManager.instance.showPanel(LobbyMailAwardsPanel, LayerManager.uiLayerName, false, mailId);
    }
}