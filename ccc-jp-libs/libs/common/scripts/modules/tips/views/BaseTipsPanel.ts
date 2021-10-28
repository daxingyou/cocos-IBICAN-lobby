import { TipsInfo } from "../models/TipsInfo";
import BaseTipView from "./BaseTipView";
import WaitablePanel from "../../../utils/WaitablePanel";
import UIUtils from "../../../utils/UIUtils";

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
export default class BaseTipsPanel extends WaitablePanel {

    @property(cc.Prefab)
    public template: cc.Prefab = null;

    @property(cc.Vec2)
    public startPos: cc.Vec2 = new cc.Vec2(0, 0);

    @property(cc.Vec2)
    public endPos: cc.Vec2 = new cc.Vec2(0, 0);

    @property
    public animationTime: number = 1500;

    public onceShow: boolean = true;
    /**
     * 提示视图的缓存池
     */
    protected get pool(): BaseTipView[] {
        if (!this.mPool) this.mPool = [];
        this.node.position
        return this.mPool;
    }
    private mPool: BaseTipView[];

    // 每条提示的间隔时间
    @property
    public interval: number = 200;

    public get isWaitInterval(): boolean {
        return this.intervalWait.isWaitting();
    }
    protected get intervalWait(): riggerIOC.WaitForTime {
        if (!this.mIntervalWait) this.mIntervalWait = new riggerIOC.WaitForTime();
        return this.mIntervalWait;
    }
    private mIntervalWait: riggerIOC.WaitForTime;

    public async showTip(tip: TipsInfo): Promise<any> {
        // if(!this.onceShow) return; 
        // if (this.intervalWait.isWaitting()) return this.intervalWait.wait();

        if (this.intervalWait.isWaitting()) return this.intervalWait.cancel();
        this.intervalWait.reset();
        // 显示提示
        let tipView: BaseTipView = this.getTipView();
        this.node.addChild(tipView.node);
        tipView.node.opacity = 0;
        await tipView.waitInit();
        tipView.show(tip);
        // 做动画
        // this.animate(tipView);
        this.animateA(tipView)

        return this.intervalWait.forMSeconds(this.interval).wait();
    }

    public get aniNum(): number {
        return this.mAniNum;
    }
    public set aniNum(n: number) {
        this.mAniNum = n;
        if (this.mAniNum <= 0) {
            this.done();
        }
    }
    private mAniNum: number = 0;

    /**
     * 动画效果1
     */
    async animate(tipView: BaseTipView) {
        tipView.node.opacity = 255;
        tipView.node.position = this.startPos;

        cc.tween(tipView.node).to(this.animationTime / 1000, { x: this.endPos.x, y: this.endPos.y }).start();
        ++this.aniNum;
        await riggerIOC.waitForSeconds(this.animationTime);
        this.recoverTipView(tipView);
        --this.aniNum;
    }

     /**
     * 动画效果2
     */
    async animateA(tipView: BaseTipView){
        if(!this.onceShow) return; 
        tipView.node.opacity = 255;
        // tipView.node.position = this.startPos;
        this.onceShow = false
        ++this.aniNum;
        await riggerIOC.waitForSeconds(1000);
        this.recoverTipView(tipView);
        this.onceShow = true
        --this.aniNum;
    }

    protected recoverTipView(tipView: BaseTipView) {
        if (tipView.node.parent) {
            tipView.node.parent.removeChild(tipView.node)
        }

        this.pool.push(tipView);
    }

    private getTipView(): BaseTipView {
        if (this.pool.length > 0) {
            return this.pool.pop();
        }
        else {
            // 需要初始化一个
            if (!this.template) {
                throw new Error("need a tip view template");
            }

            let node: cc.Node = UIUtils.instantiate(this.template);
            if (!node) {
                throw new Error("make sure the tip tempate is valid");
            }

            let tipView: BaseTipView = node.getComponent<BaseTipView>(BaseTipView);
            if (!tipView) {
                throw new Error("pleae make sure a `BaseTipView` component or it's child has been attached");
            }

            return tipView;
        }
    }


}
