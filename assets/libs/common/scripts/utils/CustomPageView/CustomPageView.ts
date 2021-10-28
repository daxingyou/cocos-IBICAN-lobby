
import CustomPageViewIndicator from "./CustomPageViewIndicator";
import JPSprite from "../JPSprite";

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
export default class CustomPageView extends cc.Component {

    @property( cc.PageView )
    pageView:cc.PageView = null;

    @property(cc.Prefab)
    temple:cc.Prefab = null;

    @property(CustomPageViewIndicator)
    indicator:CustomPageViewIndicator = null

    private flag:boolean;

    start():void{  
        this.indicator.setPageView( this.pageView );
        //this.updatePages();
    }

    onEnable():void{
        this.pageView.node.on( "scroll-to-left",this.scrolltoleft,this );
        this.pageView.node.on( "scroll-to-right",this.scrolltoright,this );
        this.pageView.node.on( "scroll-ended",this.onScrollEnd,this );
    }

    onDisable():void{
        this.pageView.node.off( "scroll-to-left",this.scrolltoleft,this );
        this.pageView.node.off( "scroll-to-right",this.scrolltoright,this );
        this.pageView.node.off( "scroll-ended",this.onScrollEnd,this );
    }

    private scrolltoleft(e:any ):void{
        cc.log("scroll-to-left");        
        let pages:cc.Node[] = this.pageView.getPages();
        let curIndex:number = this.pageView.getCurrentPageIndex();
        if( curIndex != 1 && pages.length < 3 ){
            this.handle();
        }
    }

    private scrolltoright( e:any ):void{
        cc.log("scrolltoright");
        let curIndex:number = this.pageView.getCurrentPageIndex();
        let pages:cc.Node[] = this.pageView.getPages();
        if( curIndex != 0 && pages.length < 3 ){
            this.handle();
        }
    }

    public addPage( value:cc.Node,isUpdate:boolean = false ):void{
        this.pageView.addPage( value );
        isUpdate ? this.updatePages() : null;
    }
    public removePage( value:cc.Node,isUpdate:boolean = false ):void{
        this.pageView.removePage( value );
        isUpdate ? this.updatePages() : null;
    }

    public scrollToPage( index:number,timeInSecond:number ):void{
        this.pageView.scrollToPage( index,timeInSecond );
    }

    public getCurrentPageIndex():number{
        return this.pageView.getCurrentPageIndex();
    }

    public isScrolling():boolean{
        return this.pageView.isScrolling();
    }

    private onScrollEnd():void{
        this.handle();
    }

    public updatePages( ):void{
        let pages:cc.Node[] = this.pageView.getPages();
        for( let i:number = 0 ; i < pages.length ; i++){
            let node:cc.Node = pages[i];
            node.x = i * node.width;
           // Object.defineProperty( node,"tempIndex",{writable:true} );
            node["tempIndex"] = i + 1;
        }
        this.handle();
    }

    private handle( isScroll:boolean = true ):void{
        let pages:cc.Node[] = this.pageView.getPages();
        let curIndex:number = this.pageView.getCurrentPageIndex();
        let maxIndex:number = pages.length;
        if( maxIndex <= 1 )return;
        let curNode:cc.Node = pages[curIndex];    
        let self = this;    
        let targetIndex:number = curIndex === 0 ? maxIndex - 1 : ( curIndex === maxIndex - 1 ? 0 : -1 );
        if( targetIndex != -1 ){
            let inserIndex:number = curIndex;
            let targetNode:cc.Node = pages[targetIndex];
            targetNode.x = targetIndex > inserIndex ? curNode.x - curNode.width : curNode.x + curNode.width;
            pages.splice( targetIndex,1 );
            this.insertAt( pages,inserIndex,targetNode);
            let goIndex:number = pages.indexOf( curNode );
            isScroll ? self.scrollToPage( goIndex,0 ) : null;
            self.scrollToPage( goIndex,0 )
            self.indicator.refresh();           
        }
        self.indicator.changedState();
    }

    private insertAt(array:any[], index:number, obj:any):void {
        var last:number = array.length;
        if (index < 0) {
            array[last] = obj;
            return;
        }
        for (var j:number = last; j > index; --j) {
            array[j] = array[j - 1];
        }
        array[index] = obj;
    }
}
