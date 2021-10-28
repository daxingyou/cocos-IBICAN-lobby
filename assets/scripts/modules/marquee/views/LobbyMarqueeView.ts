import JPView from "../../../../libs/common/scripts/utils/JPView";
import LobbyMarqueePlayEndOnceSignal from "../signals/LobbyMarqueePlayEndOnceSignal";
import LobbySceneNames from "../../scene/LobbySceneNames";
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

const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyMarqueeView extends JPView {

    @property(cc.RichText)
    private marqueeLabel: cc.RichText = null;

    @property
    public animationTime: number = 8000;

    @riggerIOC.inject(LobbyMarqueePlayEndOnceSignal)
    private playEndOnceSignal: LobbyMarqueePlayEndOnceSignal;

    constructor() {
        super();
    }

    start() {
        cc.log('marqueeView Start');
        super.start();
    }

    protected get workWait(): riggerIOC.BaseWaitable {
        if (!this.mWorkWait) this.mWorkWait = new riggerIOC.BaseWaitable();
        return this.mWorkWait;
    }
    private mWorkWait: riggerIOC.BaseWaitable;

    /**
     * 等待面板工作完成
     */
    public wait() {
        return this.workWait.wait();
    }

    public prepare():void{
        this.reset();
    }
    
    public reset(){
        this.workWait.reset();
    }

    /**
     * 使面板进入完成状态 
     * 面板工作完成后调用此接口
     * @param reason 
     */
    public done(reason?: any): void {
        this.workWait.done(reason);
    }

    public onHide(): void {
        super.onHide();
        this.workWait.done();
    }

    public resetMarquee(marqueeDesc: string = "") {
        this.marqueeLabel.string = marqueeDesc;
        this.marqueeLabel.node.x = this.node.width * (1 - this.node.anchorX) + this.marqueeLabel.node.width * this.marqueeLabel.node.anchorX;
    }

    public isWorkWaitting(): boolean {
        return this.workWait.isWaitting();
    }

    public async playMarquee() {
        this.marqueeLabel.node.stopAllActions();
        let length: number = this.marqueeLabel.node.width;
        this.marqueeLabel.node.x = this.node.width * (1 - this.node.anchorX) + this.marqueeLabel.node.width * this.marqueeLabel.node.anchorX;
        let action = cc.moveTo(this.animationTime / 1000, - length, 0);
        let call = cc.callFunc(() => {
            this.marqueeLabel.string = ""
            this.marqueeLabel.node.stopAllActions();
            this.workWait.done(true);
            if(cc.director.getScene().name == LobbySceneNames.MainScene) {
                this.playEndOnceSignal.dispatch();
            }
        }, this);
        action = cc.sequence(action, call);
        this.marqueeLabel.node.runAction(action);
    }

    onDispose() {
        this.marqueeLabel.node.stopAllActions();
    }
    
}
