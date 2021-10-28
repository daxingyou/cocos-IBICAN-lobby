import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import WithdrawCashPanel from "../views/withdrawCash/WithdrawCashPanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShowWithdrawCashPanelCommand extends riggerIOC.Command {
    constructor() {
        super();
    }

    async execute(param: any, logined: boolean) {
        if(logined) {
            UIManager.instance.showPanel(WithdrawCashPanel, LayerManager.uiLayerName, true);
        }
    }
}
