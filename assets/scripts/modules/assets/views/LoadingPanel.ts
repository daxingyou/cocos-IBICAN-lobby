import BaseLoadingPanel from "../../../../libs/common/scripts/modules/assets/views/BaseLoadingPanel";
import ConversionFunction from "../../../../libs/common/scripts/utils/mathUtils/ConversionFunction";
import NativeUtils from "../../../../libs/native/NativeUtils";

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
export default class LoadingPanel extends BaseLoadingPanel {

    @property(cc.Label)
    protected progressLabel: cc.Label = null;

    @property(cc.ProgressBar)
    protected progressBar: cc.ProgressBar = null;

    onShow():void{
        super.onShow();
        NativeUtils.setOrientation(1);
        cc.log(`show loading panel, task:`)
    }

    onHide()
    {
        super.onHide();
        cc.log(`hide loadingpanel`)
    }

    setProgress(p: number): void {
        // cc.log(`set progress in loading panel:${p}`);

        // if(p == this.progressBar.progress) return;
        
        this.progressBar.progress = p;
        this.progressLabel.string = `${ConversionFunction.intToFloat(p * 10000, 2)}%`;

        this.completeSignal.dispatch();
    }
}
