import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import RankPanel from "../views/RankPanel";

export default class ShowRankPanelCommand extends riggerIOC.Command {
    constructor() {
        super();
    }

    async execute(param: any, logined: boolean) {
        logined = true;
        if(logined) {
            UIManager.instance.showPanel(RankPanel, LayerManager.uiLayerName, true);
        }
    }
}