import IAsyncListLayout from "./IAsyncListLayout";
import AsyncList from "./AsyncList";
import CustomPageView from "../CustomPageView/CustomPageView";
import UIUtils from "../UIUtils";

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
export default class PageViewList extends AsyncList {
    @property( CustomPageView )
    public pageView:CustomPageView = null;

    @property( cc.Boolean )
    public autoScroll:boolean = true;

    private _renderAll:boolean;
    private _autoing:boolean;
    public constructor( value:cc.Prefab ){
        super();
    }

    update(){
        this.autoScroll && this.pageView.isScrolling() ? this.removeAuto() : this.checkAutoPlay();
    }

    onDisable(){
        this.removeAuto();
    }

    public reset(itemNum: number, layout: IAsyncListLayout = null): AsyncList {
        if (layout) this.setLayout(layout);

        // 是否有正在进行的任务
        if (this.task) {
            this.task.cancel("cancel");
        }

        // 回收所有ITEM
        this.mItems.forEach((value, _idx) => {
            value.active = false;
            this.pageView.removePage( value );
            this.pool.push(value);
        });

        this.mItems = [];
        this.itemNum = itemNum;
        this._renderAll = false;
        return this;
    }

    /**
     * 创建指定数目的子项,并设置位置等
     * @param num 
     */
    private _pages:cc.Node[] = [];
    protected createItems(num: number): void {
        let nowNum: number = this.mItems.length;
        let tempNum: number = 0;
        while (tempNum < num) {
            let inst: cc.Node = this.pool.pop();
            if (!inst) {
                inst = <cc.Node>UIUtils.instantiate(this.template)
                if (!inst) throw new Error("can not instantiate prefab, please check!, prefab:" + this.template);
            }
            this.mItems.push(inst);
            ++tempNum;

            inst.name = inst.name + nowNum;
            // 回调
            this.renderHandlers.execute(inst, nowNum++);            
            this.pageView.addPage( inst );
            // 设置位置
            this.layout && this.layout.layout(inst, nowNum - 1);

            inst.active = true;
        }
        if( nowNum >= this.itemNum ){
            this._renderAll = true;
            this.pageView.updatePages();
            // this.pageView.scrollToPage(0,0);
            this.checkAutoPlay();
        }
            
    }

    private checkAutoPlay():void{
        if( this.autoScroll && this.itemNum > 1 && this._renderAll && !this._autoing ){
            this._autoing = true;
            this.schedule( this.autoPlay,5,cc.macro.REPEAT_FOREVER );
        }
    }
    private removeAuto():void{
        if( this._autoing ){
            this._autoing = false;    
            this.unschedule( this.autoPlay );
        }
    }
    
    private autoPlay(){
        let curPage:number = this.pageView.getCurrentPageIndex();
        curPage++;
        if( this.itemNum <= curPage ){
            curPage = 0;
        }
        this.pageView.scrollToPage( curPage,1 );
    }
}
