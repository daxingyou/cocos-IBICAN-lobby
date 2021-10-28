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
export default class ScrollViewIndicator extends cc.Component {
    @property( cc.ScrollView )
    public scrollView:cc.ScrollView = null;

    @property( cc.SpriteFrame )
    public pageFrame:cc.SpriteFrame = null;

    @property(cc.size)
    public indicatorSize:cc.Size = new cc.Size(10,10);

    @property(cc.size)
    public cellSize:cc.Size = new cc.Size(0,0);

    //此字段的意思为以多少节点为一页，此节点是编辑器里scrollView.content里的节点数量
    @property( cc.Integer )
    public contentNodeCount:number = 1;

    @property( cc.Integer )
    public direction:number = 0;

    @property( cc.Integer )
    public spacing:number = 0;

    //用于计算滚动多少偏移量后才切换下一页状态
    @property(cc.Integer)
    public scrollPos:number = 50;

    @property( cc.Layout )
    private _layout:cc.Layout = null;

    private _indicators: cc.Node[] = [];

    private _maxPage:number;

    public constructor(){
        super();
    }

    onLoad(){
        this.updateLayout();
        this.scrollView.node.on( "scroll-ended",this.onScrollEnd,this )
    }

    onEnable(){

    }

    start(){
        this.changeState();
    }

    update(){
        this.updateView();       
    }

    private onScrollEnd():void{        
        this.changeState();
    }

    private createIndicator(){
        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = this.pageFrame;
        node.parent = this.node;
        node.width = this.indicatorSize.width;
        node.height = this.indicatorSize.height;
        return node;
    }
    

    protected updateLayout():void{
        this._layout = this.getComponent(cc.Layout);
        if (!this._layout) {
            this._layout = this.addComponent(cc.Layout);
        }
        if (this.direction === Direction.HORIZONTAL) {
            this._layout.type = cc.Layout.Type.HORIZONTAL;
            this._layout.spacingX = this.spacing;
        }
        else if (this.direction === Direction.VERTICAL) {
            this._layout.type = cc.Layout.Type.VERTICAL;
            this._layout.spacingY = this.spacing;
        }
        this._layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
    }

    protected changeState():void{
        let indicators = this._indicators;
        if (indicators.length === 0) return;
        let maxScroll:cc.Vec2 = this.scrollView.getMaxScrollOffset();
        let curScroll:cc.Vec2 = this.scrollView.getScrollOffset();
        let idx:number;
        let needValue:number;
        let count = this.contentNodeCount;
        let sp:number = this.scrollPos > 0 ? this.scrollPos : this.cellSize.width * count;
        if( this.direction == Direction.HORIZONTAL ){
            needValue = Math.abs( curScroll.x );
            if( needValue != 0 && maxScroll.x!= 0 && needValue >= maxScroll.x ){
                idx = indicators.length - 1;
            }else{                
                idx = parseInt( ( needValue / sp ).toFixed( 0 ) );
            }            
        }else if( this.direction == Direction.VERTICAL ){
            needValue = Math.abs( curScroll.y );
            if( needValue != 0 && maxScroll.x!= 0 && needValue >= maxScroll.y ){
                idx = indicators.length - 1;
            }else{
                idx = parseInt( ( curScroll.y / sp ).toFixed( 0 ) );
            }            
        }        
        idx = idx == Infinity || isNaN( idx ) ? 0 : Math.abs( idx );  
        cc.log(`idx:${idx}`);
        if (idx >= indicators.length ) return;
        for (let i = 0; i < indicators.length; ++i) {
            let node = indicators[i];
            node.opacity = 255 / 2;
        }
        indicators[idx].opacity = 255;
    }

    protected updateView():void{
        if (!this.scrollView) return;

        let indicators = this._indicators;
        let content:cc.Node = this.scrollView.content;
        let nodeCount:number = content.childrenCount;
        let count = this.contentNodeCount;
        //通过每一页有多少节点来算出需要多少个indicators
        nodeCount = nodeCount % count != 0 ? Math.ceil( nodeCount / count ) : nodeCount / count;
        if (nodeCount === indicators.length) {
            return;
        }
        let i = 0;
        if ( nodeCount > indicators.length) {
            for (i = 0; i < nodeCount; ++i) {
                if (!indicators[i]) {
                    indicators[i] = this.createIndicator();
                }
            }
        }
        else {
            let count = indicators.length - nodeCount;
            for (i = count; i > 0; --i) {
                let node = indicators[i - 1];
                this.node.removeChild(node);
                indicators.splice(i - 1, 1);
            }
        }
        if(this._layout && this._layout.enabledInHierarchy) {
            this._layout.updateLayout();
        }
        this.changeState();
    }
}

enum Direction{
    //水平方向
    HORIZONTAL = 0,

    //垂直方向
    VERTICAL = 1
};