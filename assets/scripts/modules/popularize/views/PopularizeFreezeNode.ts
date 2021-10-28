import JPView from "../../../../libs/common/scripts/utils/JPView";
import StartPopularizeUpgradeUserSignal from "../signals/StartPopularizeUpgradeUserSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopularizeFreezeNode extends JPView {
    @property(cc.Button)
    upgradeButton: cc.Button = null;

    @riggerIOC.inject(StartPopularizeUpgradeUserSignal)
    private startUpgradeUserSignal: StartPopularizeUpgradeUserSignal;

    constructor() {
        super();
    }
    
    onInit() {
        super.onInit();
    }

    public onShow(): void {
        super.onShow();
        this.addEventListener();
    }

    public onHide(): void {
        super.onHide();
        this.removeEventListener();
    }

    public onDispose(): void {
        super.onDispose();
    }

    private addEventListener(): void {
        this.upgradeButton.node.on("click", this.onTouchUpgrade, this);
    }

    private removeEventListener(): void {
        this.upgradeButton.node.off("click", this.onTouchUpgrade);
    }


    private onTouchUpgrade(event: cc.Event.EventTouch): void {
        this.startUpgradeUserSignal.dispatch();
    }
}
