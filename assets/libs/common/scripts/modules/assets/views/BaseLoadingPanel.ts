import Panel from "../../../utils/Panel";
import CompleteSignal from "../../../signals/CompleteSignal";

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
 * 加载界面
 */
const { ccclass } = cc._decorator;

@ccclass
export default class BaseLoadingPanel extends Panel {
    /**
     * 处理完成的信号,一般表示进度动画播放完成(某一段)
     */
    public completeSignal: CompleteSignal;

    constructor() {
        super();
        this.completeSignal = new CompleteSignal();
    }

    /**
     * 设置当前要显示的进度
     * @param p 
     */
    setProgress(p: number): void {
        throw new Error("not implemented:BaseLoadingPanel.setProgress")
    }
}
