import JPView from "../../../../libs/common/scripts/utils/JPView";
import AsyncRefreshList from "../../../../libs/common/scripts/utils/refreshList/AsyncRefreshList";
import PopularizeRecodeItem from "./PopularizeRecodeItem.ts";
import { DirectCommissionItem } from "../../../protocol/protocols/protocols";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import LobbyListEmptyTipsView from "../../../common/views/LobbyListEmptyTipsView";
import UIUtils from "../../../../libs/common/scripts/utils/UIUtils";
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
export default class PopularizeRecordsView extends JPView {

    @property(AsyncRefreshList)
    public recordList: AsyncRefreshList = null;

    @riggerIOC.inject(PushTipsQueueSignal)
    public pushTipsQueueSignal: PushTipsQueueSignal;

    @property(cc.Node)
    private listEmptyTipsParentNode: cc.Node = null

    @property(cc.Prefab)
    private lobbyListEmptyTipsPrefab: cc.Prefab = null;

    private listEmptyTips: LobbyListEmptyTipsView = null;
    
    private data: DirectCommissionItem[] = null;

    constructor() {
        super();
    }


    onInit() {
        super.onInit();
    }


    onDispose() {
        super.onDispose();
    }

    onShow() {
        super.onShow();
        this.recordList.onRender(this, this.onRender);
        let node : cc.Node = UIUtils.instantiate(this.lobbyListEmptyTipsPrefab);
        if (node) {
            this.listEmptyTipsParentNode.addChild(node);
        }
        this.listEmptyTipsParentNode.active = false
        if (node && node instanceof cc.Node) {
            this.listEmptyTips = node.getComponent(LobbyListEmptyTipsView);
            this.listEmptyTips.setDesc("您暂时还没有任何推广记录，快去邀请好友一起玩吧~");
        };
    }

    onHide() {
        super.onHide();
        this.recordList.offRender(this, this.onRender);
    }

    /**更新列表 */
    public updateList(list: DirectCommissionItem[]) {
        this.data = list;
        if (list.length === 0) {
            this.listEmptyTipsParentNode.active = true;
        }else{
            this.listEmptyTipsParentNode.active = false;
        }
        if(list.length <= 8) {
            (this.recordList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.NONE;
            this.recordList.node.width = 765;
            this.recordList.node.height = 520;
        }
        else {
            (this.recordList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.CONTAINER;
        }
        this.recordList.reset(list.length);
        this.recordList.run(2, 1);
    }

    private onRender(node: cc.Node, idx: number) {
        let item: PopularizeRecodeItem = node.getComponent(PopularizeRecodeItem) as PopularizeRecodeItem;
        let record: DirectCommissionItem = this.data[idx];
        item.updateItem(record);
    }
}
