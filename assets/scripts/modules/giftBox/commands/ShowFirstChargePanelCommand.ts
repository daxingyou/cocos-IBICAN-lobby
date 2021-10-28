import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import FirstChargePanel from "../view/FirstChargePanel";

const {ccclass, property} = cc._decorator;

export default class ShowFirstChargePanelCommand extends riggerIOC.Command {
    constructor() {
        super();
    }

    async execute(param: any, logined: boolean) {
        if(logined) {
            UIManager.instance.showPanel(FirstChargePanel, LayerManager.uiLayerName, true);
        }
    }
}
