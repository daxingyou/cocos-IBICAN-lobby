import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import RechargePanel from "../views/RechargePanel";


export default class ShowRechargePanelCommand extends riggerIOC.Command {
    constructor() {
        super();
    }

    async execute(param: any, logined: boolean) {
        if(logined) {
            UIManager.instance.showPanel(RechargePanel, LayerManager.uiLayerName, true);
        }
    }
}
