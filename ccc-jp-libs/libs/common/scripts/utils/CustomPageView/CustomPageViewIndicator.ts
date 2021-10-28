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
export default class CustomPageViewIndicator extends cc.Component {

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
    public pageView:cc.PageView;

    public constructor(){
        super();
    }

    onLoad(){
        this.updateLayout();        
    }

    onEnable(){

    }

    start(){

    }

    /**
     * !#en Set Page View
     * !#zh 设置页面视图
     * @method setPageView
     * @param {PageView} target
     */
    public setPageView( target:cc.PageView ):void{
        this.pageView = target;
        //this.pageView.node.on( "scroll-ended",this.onScrollBegan,this );
        this.refresh();
    }

    private onScrollBegan():void{
        this.changedState();
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

    public changedState():void{
        let indicators = this._indicators;
        if (indicators.length === 0) return;
        let idx = this.pageView.getCurrentPageIndex();        
        for (let i = 0; i < indicators.length; ++i) {
            let node = indicators[i];
            let page:cc.Node = this.pageView.getPages()[idx];
            if( node['tempIndex'] == page["tempIndex"]){
                indicators[i].opacity = 255;
            }else{
                node.opacity = 255 / 2;
            }
        }
        
    }

    public refresh():void{
        if (!this.pageView) { return; }
        let indicators = this._indicators;
        let pages = this.pageView.getPages();
        if (pages.length === indicators.length) {
            return;
        }
        let i = 0;
        if (pages.length > indicators.length) {
            for (i = 0; i < pages.length; ++i) {
                if (!indicators[i]) {
                    indicators[i] = this.createIndicator();
                    indicators[i]["tempIndex"] = i + 1;
                }
            }
        }
        else {
            let count = indicators.length - pages.length;
            for (i = count; i > 0; --i) {
                let node = indicators[i - 1];
                this.node.removeChild(node);
                indicators.splice(i - 1, 1);
            }
        }
        if(this._layout && this._layout.enabledInHierarchy) {
            this._layout.updateLayout();
        }
        this.changedState();
    }
}

enum Direction{
    //水平方向
    HORIZONTAL = 0,

    //垂直方向
    VERTICAL = 1
};