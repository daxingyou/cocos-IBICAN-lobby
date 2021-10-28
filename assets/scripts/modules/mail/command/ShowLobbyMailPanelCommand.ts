import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import LobbyMailPanel from "../views/LobbyMailPanel";

export default class ShowLobbyMailPanelCommand extends riggerIOC.WaitableCommand {

    async execute() {
        UIManager.instance.showPanel(LobbyMailPanel, LayerManager.uiLayerName, true);
    }
}