import JPView from "../../../../libs/common/scripts/utils/JPView";
import ShowPopularizeRebateListPanelSignal from "../signals/ShowPopularizeRebateListPanelSignal";
// import AsyncRefreshList from "../../../../libs/common/scripts/utils/refreshList/AsyncRefreshList";
// import BaseRefreshListTask from "../../../../libs/common/scripts/utils/refreshList/task/BaseRefreshListTask";
// import TestRefreshTask from "../../../../libs/common/scripts/utils/refreshList/task/testRefreshTask";

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
export default class PopularizeTutorialView extends JPView {

    @riggerIOC.inject(ShowPopularizeRebateListPanelSignal)
    private showPopularizeRebateListPanelSignal: ShowPopularizeRebateListPanelSignal;
    
    @property(cc.Button)
    private showRebateListButton: cc.Button = null;

    constructor() {
        super();
    }
    
    
    onInit() {
        super.onInit();
    }

    
    onShow() {
        super.onShow();
        this.addEventListener();
    }

  

    private addEventListener(): void {
        this.showRebateListButton.node.on("click", this.onTouchRebate, this)
    }

    private removeEventListener(): void {
        this.showRebateListButton.node.off("click", this.onTouchRebate)
    }

    private onTouchRebate(event: cc.Event.EventTouch) {
        this.showPopularizeRebateListPanelSignal.dispatch();
    }

    public onHide(): void {
        super.onHide();
        this.removeEventListener();
    }

    public onDispose(): void {
        super.onDispose();
    }

    
}
