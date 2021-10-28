import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import PopularizeWithdrawalCommissionPanel from "../views/PopularizeWithdrawalCommissionPanel";

export default class ShowPopularizeWithdrawalCommissionCommand extends riggerIOC.Command {
    constructor() {
        super();
    }

    async execute(param: any, logined: boolean) {
        logined = true;
        if(logined) {
            console.log(" execute  PopularizeWithdrawalCommissionPanel")
            UIManager.instance.showPanel(PopularizeWithdrawalCommissionPanel, LayerManager.uiLayerName, false);
        }
    }
}