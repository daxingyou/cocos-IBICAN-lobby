import TipsModel from "../../../../libs/common/scripts/modules/tips/models/TipsModel";
import { TipsInfo } from "../../../../libs/common/scripts/modules/tips/models/TipsInfo";
import LobbyTipsPanel from "../views/LobbyTipsPanel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";


// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class LobbyTipCommand extends riggerIOC.Command {
    @riggerIOC.inject(TipsModel)
    private tipsModel: TipsModel;

    private panel: LobbyTipsPanel;

    async execute(tip:TipsInfo) {
        if(!tip) return;
        if(tip == 'null' || tip == 'undefined') return;
        if(tip.length <= 0) return;
        this.tipsModel.tips.inqueue(tip);
        if(this.panel) {
            return;
        }
        cc.log(`now show lobby tips panel: ${tip}`)
        this.panel = <LobbyTipsPanel>UIManager.instance.showPanel(LobbyTipsPanel, LayerManager.tipsLayerName, false,this.tipsModel.tips);
        this.panel.reset();
        await this.panel.wait();
        UIManager.instance.hidePanel(this.panel);
        this.panel = null;
    }
}
