import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import PopularizeCodeImagePanel from "../views/PopularizeCodeImagePanel";

export default class ShowPopularizeCodeImageCommand extends riggerIOC.Command {
    constructor() {
        super();
    }

    async execute(param: any, logined: boolean) {
        logined = true;
        if(logined) {
            UIManager.instance.showPanel(PopularizeCodeImagePanel, LayerManager.uiLayerName, false);
        }
    }
}