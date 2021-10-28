import JPView from "../../../../libs/common/scripts/utils/JPView";
import { RechargeOrder } from "../../../protocol/protocols/protocols";
import OrderListItemView from "./OrderListItemView";
import AsyncRefreshList from "../../../../libs/common/scripts/utils/refreshList/AsyncRefreshList";

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
export default class OrderListView extends JPView {
    @property(cc.ScrollView)
    public scrollView: cc.ScrollView = null;

    @property(AsyncRefreshList)
    public orderList: AsyncRefreshList = null;

    constructor() {
        super();
    }

    onShow() {
        this.orderList.onRender(this, this.onRender);
    }

    onHide() {
        this.orderList.offRender(this, this.onRender);
    }

    /**全部订单数据 */
    private data: RechargeOrder[];

    /**更新列表 */
    public updateList(list: RechargeOrder[]) {
        this.data = list;
        if(list.length <= 8) {
            (this.orderList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.NONE;
            this.orderList.node.width = 759;
            this.orderList.node.height = 513;
        }
        else {
            (this.orderList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.CONTAINER;
        }
        this.orderList.reset(list.length);
        this.orderList.run(2, 1);
    }

    private onRender(node: cc.Node, idx: number) {
        let item: OrderListItemView = node.getComponent(OrderListItemView) as OrderListItemView;
        let order: RechargeOrder = this.data[idx];
        item.updateView(order.id, order.createTime, order.rechargeAmount / 100 + '', order.status);
    }
}
