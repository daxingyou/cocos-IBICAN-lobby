import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import PopularizeRebateListPanel from "../views/PopularizeRebateListPanel";

export default class ShowPopularizeRebateListCommand extends riggerIOC.Command {
    constructor() {
        super();
    }

    async execute(param: any, logined: boolean) {
        logined = true;
        if(logined) {
            UIManager.instance.showPanel(PopularizeRebateListPanel, LayerManager.uiLayerName, false);
        }
    }
}