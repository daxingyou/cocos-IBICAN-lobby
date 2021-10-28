import SwitchHallSignal from "../../../../libs/common/scripts/signals/SwitchHallSignal";
import JPView from "../../../../libs/common/scripts/utils/JPView";
import RecommonCellView from "./RecommonCellView";
import SubGameEntity, { SubGameId } from "../../subGames/models/SubGameEntity";
import PageViewList from "../../../../libs/common/scripts/utils/AsyncList/PageViewList";
import TryToLaunchSubGameSignal from "../../subGames/signals/TryToLaunchSubGameSignal";
import { SubGameType } from "../../subGames/models/SubGamesModel";

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
export default class PromoteView extends JPView {
    @property(cc.Node)
    public slotAndArcNode: cc.Node = null;

    @property(PageViewList)
    public list: PageViewList = null;

    @property
    public startX: number = 0;

    @property
    public endX: number = 0;

    @riggerIOC.inject(SwitchHallSignal)
    public onSwitchHallSignal: SwitchHallSignal;

    // @riggerIOC.inject(OnSubGameUpdateTaskCreateSignal)
    // protected onCreateUpdateTaskSignal: OnSubGameUpdateTaskCreateSignal;

    /**
     * 点击信号，当子项被点击时派发,参数为被点击的子项:GameListItemView
     */
    // @riggerIOC.inject(OnClickSignal)
    // public onClickSignal: OnClickSignal;

    /**
     * 所有的数据
     */
    protected _data: SubGameEntity[];

    public onInit(): void {
        this.list.onRender(this, this.onRender);
        if (this._data) {
            this.list.reset(this._data.length);
            this.list.run(2, 1);
        }
        cc.log("this.xx==========", this.node.x);
    }

    public onShow(): void {
        this.list.onRender(this, this.onRender);
        let slotGamesBtn = this.slotAndArcNode.getChildByName("slotBtn").getComponent(cc.Button);
        let arcGamesBtn = this.slotAndArcNode.getChildByName("arcBtn").getComponent(cc.Button);
        slotGamesBtn.node.on('click', this.onBtnClickHandle, this);
        arcGamesBtn.node.on('click', this.onBtnClickHandle, this);
        // this.onCreateUpdateTaskSignal.on(this, this.onUpdateStart);   
    }

    public onHide(): void {
        this.list.offRender(this, this.onRender);
        let slotGamesBtn = this.slotAndArcNode.getChildByName("slotBtn").getComponent(cc.Button);
        let arcGamesBtn = this.slotAndArcNode.getChildByName("arcBtn").getComponent(cc.Button);
        slotGamesBtn.node.off('click', this.onBtnClickHandle, this);
        arcGamesBtn.node.off('click', this.onBtnClickHandle, this);
        // this.onCreateUpdateTaskSignal.off(this, this.onUpdateStart);   
    }

    public onDispose(): void {
        // let slotGamesBtn = this.slotAndArcNode.getChildByName( "slotBtn" ).getComponent( cc.Button );
        // let arcGamesBtn = this.slotAndArcNode.getChildByName( "arcBtn" ).getComponent( cc.Button );
        // slotGamesBtn.node.off('click',this.onBtnClickHandle,this );
        // arcGamesBtn.node.off('click',this.onBtnClickHandle,this );
    }

    public setProgress(v: number) {
        // 111 174
        // (this.slotAndArcNode.x - this.startX) / (this.endX - this.startX) == v;
        // let nowX:number = v * (this.endX - this.startX) + this.startX;
        // this.slotAndArcNode.x = Math.max(this.startX, Math.min(nowX, this.endX));
    }


    public updateContent(content: SubGameEntity[] = [], isReset: boolean = true): void {
        cc.log(`update recommon game info, num:${content.length}`);
        this._data = content;
        if (this.isInitialized) {
            if (!isReset) {
                this.list.forceRender();
            } else {
                this.list.reset(content.length);
                this.list.run(2, 1);
            }
        }
    }

    public startUpdate(gameId: SubGameId): void {
        if (!this._data) return;
        let idx: number = this._data.findIndex((s: SubGameEntity, ) => s.gameId == gameId);
        if (idx < 0) return;
        let item: RecommonCellView = this.list.getItem(idx).getComponent<RecommonCellView>(RecommonCellView);
        item.startUpdate();
    }

    protected onUpdateStart(gameId: SubGameId): void {
        this.startUpdate(gameId);
    }

    private onBtnClickHandle(value: cc.Button): void {
        let name = value.node.name;
        this.onSwitchHallSignal.dispatch(this.convertSubGameType(name));
    }

    private convertSubGameType(name: string): SubGameType {
        switch (name) {
            case "slotBtn":
                return SubGameType.SLOT;
            case "arcBtn":
                return SubGameType.ARCADE;
            default:
                return SubGameType.CARD;
        }
    }

    private onRender(node: cc.Node, idx): void {
        let itme: RecommonCellView = node.getComponent<RecommonCellView>(RecommonCellView);
        itme.setData(this._data[idx]);
        itme.offClick(this, this.onItemClick);
        itme.onClick(this, this.onItemClick);
    }

    @riggerIOC.inject(TryToLaunchSubGameSignal)
    private launchSignal: TryToLaunchSubGameSignal

    private onItemClick(gameItem: RecommonCellView): void {
        // this.onClickSignal.dispatch(gameItem);
        this.launchSignal.dispatch(gameItem.info);

    }

}
