import TipsModel from "../models/TipsModel";
import BaseTipsPanel from "../views/BaseTipsPanel";
import UIManager from "../../../utils/UIManager";
import LayerManager from "../../../utils/LayerManager";
import { TipsInfo } from "../models/TipsInfo";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 插入提示队列的命令
 */
export default class PushTipsQueueCommand extends riggerIOC.Command {
    @riggerIOC.inject(TipsModel)
    private tipsModel: TipsModel;

    private panel: BaseTipsPanel;

    async execute(tip:TipsInfo) {
        this.tipsModel.tips.inqueue(tip);
        if(this.panel) return;

        this.panel = <BaseTipsPanel>UIManager.instance.showPanel(BaseTipsPanel, LayerManager.tipsLayerName, false, this.tipsModel.tips);
        await this.panel.wait();
        UIManager.instance.hidePanel(this.panel);
        this.panel = null;
    }
}
