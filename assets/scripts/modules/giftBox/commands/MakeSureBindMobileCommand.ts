import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import BaseAlertInfo, { BaseAlertStyle, BaseAlertResult } from "../../../../libs/common/scripts/modules/tips/models/BaseAlertInfo";
import BaseAlertPanel from "../../../../libs/common/scripts/modules/tips/views/BaseAlertPanel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import BindPhonePanel from "../view/BindPhonePanel";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MakeSureBindMobileCommand extends riggerIOC.WaitableCommand {
    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;

    constructor() {
        super();
    }

    async execute() {
        if (this.lobbyUserModel.self.mobile) {
            this.done(true);
        }
        else {
            // 让用户绑定手机号
            // let info: BaseAlertInfo = new BaseAlertInfo();
            // info.content = "请先绑定手机号";
            // info.style = BaseAlertStyle.YES_NO;
            // let panel: BaseAlertPanel = BaseAlertPanel.show(info);
            // let choice: BaseAlertResult = await panel.wait();
            // BaseAlertPanel.hide(panel);
            // if (BaseAlertResult.YES == choice) {
            let bindMobilePanel = UIManager.instance.showPanel(BindPhonePanel, LayerManager.uiLayerName, true) as BindPhonePanel;
            let ret: boolean = await bindMobilePanel.wait();
            this.done(ret);
            //}
            //else {
            //this.done(false);
            //}
        }
    }

    onCancel() {

    }
}
