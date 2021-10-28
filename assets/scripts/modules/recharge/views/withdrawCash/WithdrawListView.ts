import JPView from "../../../../../libs/common/scripts/utils/JPView";
import AsyncList from "../../../../../libs/common/scripts/utils/AsyncList/AsyncList";
import { WithdrawOrder } from "../../../../protocol/protocols/protocols";
import WithdrawListItemView from "./WithdrawListItemView";
import AsyncRefreshList from "../../../../../libs/common/scripts/utils/refreshList/AsyncRefreshList";

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
export default class WithdrawListView extends JPView {
    @property(cc.ScrollView)
    private scrollView: cc.ScrollView = null;

    @property(AsyncRefreshList)
    public withdrawList: AsyncRefreshList = null; 

    constructor() {
        super();
    }

    onInit() {
        this.withdrawList.onRender(this, this.onRender);
    }

    onShow() {
    }

    onHide() {
    }

    onDispose() {
        this.withdrawList.offRender(this, this.onRender);
    }

    private data: WithdrawOrder[] = [];
    updateList(list: WithdrawOrder[]) {
        this.data = list;
        if(list.length <= 8) {
            (this.withdrawList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.NONE;
            this.withdrawList.node.width = 759;
            this.withdrawList.node.height = 513;
        }
        else {
            (this.withdrawList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.CONTAINER;
        }
        this.withdrawList.reset(list.length);
        this.withdrawList.run(2, 1);
    }

    private onRender(node: cc.Node, idx: number) {
        let item: WithdrawListItemView = node.getComponent(WithdrawListItemView);
        item.initItem(this.data[idx].id, this.data[idx].createTime, this.data[idx].amount, this.data[idx].status);
    }
}
