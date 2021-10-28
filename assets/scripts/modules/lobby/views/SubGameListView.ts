import JPView from "../../../../libs/common/scripts/utils/JPView";
import AsyncList from "../../../../libs/common/scripts/utils/AsyncList/AsyncList";
import GameListItemView from "./GameListItemView";
import SubGameEntity, { SubGameId } from "../../subGames/models/SubGameEntity";
import SubGamesModel, { SubGameType } from "../../subGames/models/SubGamesModel";
// import GameListLayoutView from "./GameListLayoutView";
import OnSubGameUpdateTaskCreateSignal from "../../subGames/signals/OnSubGameUpdateTaskCreateSignal";
import OnSubGameListUpdateSignal from "../../subGames/signals/OnSubGameListUpdateSignal";
import TryToLaunchSubGameSignal from "../../subGames/signals/TryToLaunchSubGameSignal";

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
export default class SubGameListView extends JPView {
    @property(AsyncList)
    public content: AsyncList = null;

    @property(cc.ScrollView)
    public scrollView: cc.ScrollView = null;

    @riggerIOC.inject(SubGamesModel)
    private subGameModel: SubGamesModel;

    // @riggerIOC.inject(SwitchHallSignal)
    // private onSwitchHallSignal: SwitchHallSignal;

    @riggerIOC.inject(OnSubGameUpdateTaskCreateSignal)
    protected onCreateUpdateTaskSignal: OnSubGameUpdateTaskCreateSignal;

    @riggerIOC.inject(OnSubGameListUpdateSignal)
    private onSubGameListUpdateSignal: OnSubGameListUpdateSignal;

    public type: string;

    protected anchorIndex: number = -1;

    /**
     * 所有的数据
     */
    protected data: SubGameEntity[];
    protected isComplete: boolean = false;

    public updateContent(content: SubGameEntity[] = [], isReset: boolean = true, anchorIndex: number = -1): void {
        this.isComplete = false;
        this.data = content;
        this.anchorIndex = anchorIndex;
        if (this.isInitialized) {
            // cc.log(`update sub game info, num:${content.length}`);
            this.updateList(isReset);
        }

        this.contentLayout();
    }

    /**
     * 锚定至指定子游戏
     * @param id 
     */
    public anchorSubGame(id: SubGameId): void{
        // 根据游戏ID计算其索引
        if(!this.data) return;
        let idx = this.data.findIndex((v) => v.gameId == id);
        this.anchorIndex = idx;
        this.scrollToAnchor();
    }

    public startUpdate(gameId: SubGameId): void {
        // this.content.startUpdate( gameId );
        if (!this.data) return;
        let idx: number = this.data.findIndex((s: SubGameEntity, ) => s.gameId == gameId);
        if (idx < 0) return;
        let item: GameListItemView = this.content.getItem(idx).getComponent<GameListItemView>(GameListItemView);
        item.startUpdate();
    }

    public onInit(): void {
        this.content.onRender(this, this.onRender);
        this.content.onRenderAll(this, this.onRenderAll);
        let eventHandler: cc.Component.EventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "SubGameListView";
        eventHandler.handler = "onScroll";
        this.scrollView.scrollEvents.push(eventHandler);
        if (this.data) {
            this.updateList();
        }
    }

    public onShow(): void {
        this.scrollView.node.stopAllActions();
        let t: number = 0.4;
        this.scrollView.scrollToLeft(0);
        this.scrollView.node.x = 2000;
        let s = cc.moveTo(t, 0, 0).easing(cc.easeCubicActionOut());
        this.scrollView.node.runAction(s);
        this.contentLayout();
        this.onCreateUpdateTaskSignal.on(this, this.onUpdateStart);
        this.onSubGameListUpdateSignal.on(this, this.updateSubGameList);
    }

    public onHide(): void {
        this.scrollView.node.stopAllActions();
        this.onCreateUpdateTaskSignal.off(this, this.onUpdateStart);
        this.onSubGameListUpdateSignal.off(this, this.updateSubGameList);
    }

    public onDispose(): void {
        this.content.offRender(this, this.onRender);
        this.content.offRenderAll(this, this.onRenderAll);
        this.data = null;
    }

    protected contentLayout() {
        if (!this.data) return;
        let contentLayout = this.content.getComponent(cc.Layout);
        if (this.data.length <= 10) {
            // this.content.node.anchorY = 0.5;
            contentLayout.resizeMode = cc.Layout.ResizeMode.NONE;
            this.content.node.width = 1300;
            this.content.node.height = 450;
            contentLayout.startAxis = cc.Layout.AxisDirection.HORIZONTAL;
        }
        else {
            // this.content.node.anchorY = 0.5;
            contentLayout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
            contentLayout.startAxis = cc.Layout.AxisDirection.VERTICAL;
        }
        contentLayout.updateLayout();
    }

    protected get listener(): { [event: number]: riggerIOC.ListenerManager } {
        if (!this.mListener) this.mListener = {};
        return this.mListener;
    }
    private mListener: { [event: number]: riggerIOC.ListenerManager }

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

    protected onUpdateStart(gameId: SubGameId): void {
        this.startUpdate(gameId);
    }

    private updateSubGameList(): void {
        if (this.type != undefined) {
            let renders: SubGameEntity[] = this.subGameModel.getSubGamesByType(this.type as SubGameType);
            this.updateContent(renders, false);
        }
    }

    private onScroll(scrollView: cc.ScrollView, eventType, cdata): void {
        // cc.log(`scroll view:${cc.ScrollView.EventType.SCROLLING}`);
        // cc.log(`event type:${eventType}, cdata:${cdata}`);
        // cc.log(`pos:${scrollView.content.position}`);
        // cc.log(`offset:${scrollView.getScrollOffset()}`)
        
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

    private onRenderAll(list: AsyncList): void {
        this.isComplete = true;
        this.scrollToAnchor();
    }

    private scrollToAnchor():void{
        if(!this.isComplete) return;
        if(this.anchorIndex < 0) return;
        let idx:number = Math.floor(this.anchorIndex / 2);
        this.anchorIndex = -1;
        // TODO 不知道为什么要等两帧才能正确
        let self = this;
        setTimeout(() => {
            setTimeout(() => {
                self.scrollView && self.scrollView.scrollToOffset(new cc.Vec2(241 * idx + 20 * idx, 0), 1);
            }, 0);
        }, 0);
    }

    @riggerIOC.inject(TryToLaunchSubGameSignal)
    private launchSignal: TryToLaunchSubGameSignal

    private onItemClick(gameItem: GameListItemView): void {
        cc.log("subGameListView onItemClick......");
        // this.onClickSignal.dispatch(gameItem)
        this.launchSignal.dispatch(gameItem.info);
    }

    private updateList(isReset: boolean = true): void {
        if (!isReset) {
            this.content.forceRender();
        } else {
            this.content.reset(this.data.length);
            this.content.run(2, 1);
        }
        // this.content.renderDatas = this.data;
    }

    // private onBtnClickHandle(value: cc.Button): void {
    //     let name = value.node.name;
    //     this.onSwitchHallSignal.dispatch(name);
    // }
}
