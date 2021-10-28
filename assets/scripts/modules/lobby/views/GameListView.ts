import JPView from "../../../../libs/common/scripts/utils/JPView";
import AsyncList from "../../../../libs/common/scripts/utils/AsyncList/AsyncList";
import GameListItemView from "../../lobby/views/GameListItemView";
import OnClickSignal from "../../../../libs/common/scripts/signals/OnClickSignal";
import SubGameEntity, { SubGameId } from "../../subGames/models/SubGameEntity";
import SubGamesModel from "../../subGames/models/SubGamesModel";

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
export default class GameListView extends JPView {
    @property(AsyncList)
    public content: AsyncList = null;

    @property(cc.Button)
    public slotGamesBtn: cc.Button = null;

    @property(cc.Button)
    public arcGamesBtn: cc.Button = null;

    @property(cc.ScrollView)
    public scrollView: cc.ScrollView = null;

    /**
     * 点击信号，当子项被点击时派发,参数为被点击的子项:GameListItemView
     */
    @riggerIOC.inject(OnClickSignal)
    public onClickSignal: OnClickSignal;

    @riggerIOC.inject(SubGamesModel)
    public subGameModel: SubGamesModel;

    // @riggerIOC.inject(SwitchHallSignal)
    // public onSwitchHallSignal: SwitchHallSignal;

    /**
     * 所有的数据
     */
    protected data: SubGameEntity[];

    protected anchorGameId: SubGameId = -1;
    protected isComplete: boolean = false;

    /**
    * 锚定至指定子游戏
    * @param id 
    */
    public anchorSubGame(id: SubGameId): void {
        this.anchorGameId = id;
        this.doAnchorSubGame();
    }

    private doAnchorSubGame(): void {
        this.scrollToAnchor();
    }

    public updateContent(content: SubGameEntity[] = [], isReset: boolean = true): void {
        cc.log(`update sub game info, num:${content.length}`);
        this.data = content;
        if (!isReset) {
            this.content.forceRender();
        } else {
            this.content.reset(content.length);
            this.content.run(2, 1);
        }
    }

    public startUpdate(gameId: SubGameId): void {
        // this.content.startUpdate(gameId);
        if (!this.data) return;
        let idx: number = this.data.findIndex((s: SubGameEntity, ) => s.gameId == gameId);
        if (idx < 0) return;
        let item: GameListItemView = this.content.getItem(idx).getComponent<GameListItemView>(GameListItemView);
        item.startUpdate();
    }

    public onInit(): void {
        // this.content.onRender(this, this.onRender);
        let eventHandler: cc.Component.EventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "GameListView";
        eventHandler.handler = "onScroll";
        this.scrollView.scrollEvents.push(eventHandler);
    }

    public onShow(): void {
        let t: number = 0.4;
        // cc.log(`game list view on show`)
        // cc.log("this.content.x:=======", this.content.node.x);
        this.content.onRenderAll(this, this.onRenderAll);
        this.node.position = new cc.Vec2(2000, this.node.y);
        let s = cc.moveTo(t, 150, this.node.y).easing(cc.easeCubicActionOut());
        this.node.runAction(s);
        this.content.onRender(this, this.onRender);
        // this.slotGamesBtn.node.on(cc.Node.EventType.TOUCH_END,this.onBtnClickHandle,this );
        // this.arcGamesBtn.node.on(cc.Node.EventType.TOUCH_END,this.onBtnClickHandle,this );
    }

    public onHide() {
        this.content.offRenderAll(this, this.onRenderAll);
        this.content.offRender(this, this.onRender);
        this.data = null;
        // this.slotGamesBtn.node.off(cc.Node.EventType.TOUCH_END,this.onBtnClickHandle,this );
        // this.arcGamesBtn.node.off(cc.Node.EventType.TOUCH_END,this.onBtnClickHandle,this );
    }

    public onDispose(): void {
        // this.content.offRender(this, this.onRender);
        // this.data = null;
        // this.slotGamesBtn.node.off(cc.Node.EventType.TOUCH_END,this.onBtnClickHandle,this );
        // this.arcGamesBtn.node.off(cc.Node.EventType.TOUCH_END,this.onBtnClickHandle,this );
    }

    protected get listener(): { [event: number]: riggerIOC.ListenerManager } {
        if (!this.mListener) this.mListener = {};
        return this.mListener;
    }
    protected mListener: { [event: number]: riggerIOC.ListenerManager }

    public onScrollViewEvent(event: cc.ScrollView.EventType, caller: any, callback: Function, args?: any) {
        let old: riggerIOC.ListenerManager = this.listener[event];
        if (!old) old = this.listener[event] = new riggerIOC.ListenerManager();
        old.on(caller, callback, args, false);
    }

    public offScrollViewEvent(event: cc.ScrollView.EventType, caller: any, callback: Function) {
        let old: riggerIOC.ListenerManager = this.listener[event];
        if (!old) return;
        old.off(caller, callback);
    }

    protected onScroll(scrollView: cc.ScrollView, eventType, cdata): void {
        // cc.log(`scroll view:${cc.ScrollView.EventType.SCROLLING}`);
        // cc.log(`event type:${eventType}, cdata:${cdata}`);
        // cc.log(`pos:${scrollView.content.position}`);
        let lm: riggerIOC.ListenerManager = this.listener[eventType];
        if (!lm) return;
        lm.execute(scrollView, cdata);
    }

    private onRender(node: cc.Node, idx): void {
        let itme: GameListItemView = node.getComponent<GameListItemView>(GameListItemView);
        itme.setData(this.data[idx]);

        itme.offClick(this, this.onItemClick);
        itme.onClick(this, this.onItemClick);
    }

    private onItemClick(gameItem: GameListItemView): void {
        this.onClickSignal.dispatch(gameItem);
    }

    private scrollToAnchor(): void {
        if (this.anchorGameId < 0) return;        
        if (!this.isComplete) return;
        // 根据游戏ID计算其索引
        if (!this.data) return;
        let anchorIndex = this.data.findIndex((v) => v.gameId == this.anchorGameId);
        if (anchorIndex < 0) return;
        let idx: number = Math.floor(anchorIndex / 2);
        this.anchorGameId = -1;
        // TODO 不知道为什么要等两帧才能正确
        let self = this;
        setTimeout(() => {
            setTimeout(() => {
                self.scrollView && self.scrollView.scrollToOffset(new cc.Vec2(241 * idx + 25 * idx, 0), 1);
            }, 0);
        }, 0);
    }

    private onRenderAll(list: AsyncList): void {
        this.isComplete = true;
        this.scrollToAnchor();
    }

    // private onBtnClickHandle(value:any):void{
    //     let node:cc.Node = value.currentTarget as cc.Node;        
    //     let com:cc.Component = node.getComponent( cc.Button );
    //     let name = com.node.name;
    //     cc.log( "name:",name );
    //     this.onSwitchHallSignal.dispatch(name);
    // }
}
