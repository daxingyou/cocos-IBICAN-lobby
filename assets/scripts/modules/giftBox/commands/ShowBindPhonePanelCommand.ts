import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import BindPhonePanel from "../view/BindPhonePanel";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";

export default class ShowBindPhonePanelCommand extends riggerIOC.Command {
    @riggerIOC.inject(UserModel)
    private userModel: LobbyUserModel;

    constructor() {
        super();
    }

    execute() {
        // cc.log(`test bind phone:${this.userModel.self.mobile}`);
        // cc.log(`test bind phone, has panel?${UIManager.getPanel(BindPhonePanel) == null}`)
        if(this.userModel.self && !this.userModel.self.mobile) {
            if(UIManager.getPanel(BindPhonePanel)) return;
            // cc.log(`test bind phone:now show bind phone panel`);
            UIManager.instance.showPanel(BindPhonePanel, LayerManager.uiLayerName, false);
        }
    }
}
