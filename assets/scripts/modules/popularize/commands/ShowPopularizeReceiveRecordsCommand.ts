import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import PopularizeReceiveRecordsPanel from "../views/PopularizeReceiveRecordsPanel";

export default class ShowPopularizeReceiveRecordsCommand extends riggerIOC.Command {
    constructor() {
        super();
    }

    async execute(param: any, logined: boolean) {
        logined = true;
        if(logined) {
            UIManager.instance.showPanel(PopularizeReceiveRecordsPanel, LayerManager.uiLayerName, false);
        }
    }
}