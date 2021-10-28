

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
export default class ArrowPage extends cc.Component {

    @property( cc.Sprite )
    public normal:cc.Sprite = null;

    @property( cc.Sprite )
    public disabled:cc.Sprite = null;

    @property( cc.Integer )
    public type:number = -1;

    private _totlePage:number = 1;
    private _curPage:number = 1;
    private _isActive:boolean;
    private _isVisible:boolean = true;
    public constructor(){
        super();
    }

    onInit(){

    }    

    onEnable(){
        
        // this.node.on( 'click',this.onClick,this );
    }

    onDisable(){
        // this.node.off( 'click',this.onClick,this );
    }

    onDestroy(){
        // this.node.off( 'click',this.onClick,this );
    }

    public set totlePage(value:number){
        if( value != this._totlePage || !this._isVisible ){
            this._totlePage = value == 0 ? 1 : value;
            this.updateView();
        }
    }

    public get totlePage():number{
        return this._totlePage;
    }

    public get curPage():number{
        return this._curPage;
    }
    public set curPage( value:number ){
        if( this._curPage != value || !this._isVisible){
            this._curPage = value == 0 ? 1 : value;
            this.updateView();
        }
    }

    public set visible(value:boolean){
        this.normal.node.active = value;
        this.disabled.node.active = value;   
        this._isVisible = value;        
    }

    public reset():void{
        this._curPage = 1;
        this._totlePage = 1;
    }

    private updateView():void{
        if( this._curPage === 1 && this._totlePage === 1 ){
            this.visible = false;
            return;
        }
        if( !this._isVisible )
            this.visible = true;
        let active:boolean = ( this.type == ArrowType.ADD && this._curPage >= this._totlePage ) || ( this.type == ArrowType.SUB && this._curPage <= 1 );        
        this.normal.node.active = !active;
        this.disabled.node.active = active;
        this._isActive = !active;
    }

    private onClick( value:cc.Sprite ):void{        
        if( !this._isActive)return;
        this.type == ArrowType.ADD ? this._curPage++ : ( this.type == ArrowType.SUB ? this._curPage-- : null );
        if( this._curPage > this._totlePage )
            this._curPage = this._totlePage;
        else if( this._curPage < 1 )
            this._curPage = 1;
        this.updateView();
    }    
}
export enum ArrowType{
    ADD = 1,
    SUB
}