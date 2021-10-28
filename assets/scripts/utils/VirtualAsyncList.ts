import AsyncRefreshList from "../../libs/common/scripts/utils/refreshList/AsyncRefreshList";
import AsyncList from "../../libs/common/scripts/utils/AsyncList/AsyncList";
import UIUtils from "../../libs/common/scripts/utils/UIUtils";


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
export default class VirtualAsyncList extends AsyncRefreshList{
    private pageNum: number = 0
    private eveHight: number = 0
    private content: cc.Node = null
    private spacing: number = 0;   //item 间隙
    private updateTimer: number = 0
    private updateInterval: number = 0.2
    private bufferZone: number = 0; //出了scrollView多远,开启位置调整
    private lastContentPosY: number = 0
    private itemIds: number[] = []

    public initPage(pageNum: number,spacing: number){
        this.pageNum = pageNum
        this.spacing = spacing
        let node =  <cc.Node>UIUtils.instantiate(this.template)
        this.eveHight = node.height
    }


    public reset(itemNum: number): AsyncList {
        this.itemNum = itemNum
        this.content = this.scrollView.content
        this.content.height = this.itemNum * (this.eveHight + this.spacing) + this.spacing; // 得到总含量高（个数*（Size.H+设置的间宽）
        this.bufferZone = this.scrollView.getComponentInChildren(cc.Mask).node.height / 2
        if(this.mItems.length >= this.pageNum) return;
        for (let i = 0; i < this.pageNum; ++i) { // 衍生产品，我们只需要做一次，节点。
            let item = <cc.Node>UIUtils.instantiate(this.template);
            this.content.addChild(item); //添加至规定节点下。
            item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1)); 
            this.mRenderHandlers && this.mRenderHandlers.execute(item, i);
            // item.getComponent().setIndex(i+1, i);            
            this.mItems.push(item);//添加至数组里。
            this.itemIds.push(i)
        }
        return this;
    }

    getPositionInView(item:cc.Node) { 
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    }
   
    // 循环对子物体进行调整。
    update(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // 我们不需要计算每一帧的数学
        this.updateTimer = 0;
        let items = this.mItems;
        let buffer = this.bufferZone;
        let isDown = this.scrollView.content.y < this.lastContentPosY; // 滚动方向
        let offset = (this.eveHight + this.spacing) * items.length;
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                // 如果离开缓冲区，而不是到达内容的顶部
                if (viewPos.y < -buffer && items[i].y + offset < 0) {
                    items[i].y = (items[i].y + offset );
                    let itemId = this.itemIds[i] - this.itemIds.length
                    this.itemIds[i] = itemId
                    this.mRenderHandlers && this.mRenderHandlers.execute(items[i], itemId);
                }
            } else {
                // 如果离开缓冲区，而不是到达内容的底部
                if (viewPos.y > buffer && items[i].y - offset > -this.content.height) {
                    items[i].y = (items[i].y - offset );       
                    let itemId = this.itemIds[i] + this.itemIds.length
                    this.itemIds[i] = itemId
                    this.mRenderHandlers && this.mRenderHandlers.execute(items[i], itemId);
                }
            }
        }
        // 更新 lastContentPosY
        this.lastContentPosY = this.scrollView.content.y;        
        // this.lblTotalItems.textKey = "Total Items: " + this.totalCount;
    }
}
