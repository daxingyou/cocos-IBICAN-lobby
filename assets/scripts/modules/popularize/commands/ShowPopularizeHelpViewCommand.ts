import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import PopularizeHelpPanel from "../views/PopularizeHelpPanel";

export default class ShowPopularizeHelpViewCommand extends riggerIOC.Command {
    constructor() {
        super();
    }

    async execute(param: any, logined: boolean) {
        logined = true;
        if(logined) {
            UIManager.instance.showPanel(PopularizeHelpPanel, LayerManager.uiLayerName, false);
        }
    }
}