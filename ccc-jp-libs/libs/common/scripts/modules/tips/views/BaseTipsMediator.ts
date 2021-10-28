import JPMediator from "../../../utils/JPMediator";
import Queue from "../../../utils/Queue";
import { TipsInfo } from "../models/TipsInfo";
import BaseTipsPanel from "./BaseTipsPanel";
import PushTipsQueueSignal from "../signals/PushTipsQueueSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class BaseTipsMediator extends JPMediator {
    @riggerIOC.inject(BaseTipsPanel)
    protected view: BaseTipsPanel;

    protected tips: Queue<TipsInfo>;
    onExtra(tipsQueue: Queue<TipsInfo>): void {
        this.tips = tipsQueue;
    }

    async onShow() {
        this.addEventListener();
        this.showTips();
    }

    onHide(): void {
        this.removeEventListener();
        this.tips.clear();
        this.tips = null;
        this.view.reset();
    }

    protected async showTips() {
        if (this.tips && !this.tips.isEmpty()) {
            await this.view.showTip(this.tips.outqueue());
            this.showTips();
        }
    }

    @riggerIOC.inject(PushTipsQueueSignal)
    private tipSignal: PushTipsQueueSignal

    private addEventListener(): void {
        this.tipSignal.on(this, this.onPushTip);
    }

    private removeEventListener(): void {
        this.tipSignal.off(this, this.onPushTip);

    }

    private onPushTip(): void {
        if (this.view.isWaitInterval) return;
        this.showTips();
    }
}
