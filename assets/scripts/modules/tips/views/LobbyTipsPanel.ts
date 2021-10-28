import BaseTipsPanel from "../../../../libs/common/scripts/modules/tips/views/BaseTipsPanel";
import BaseTipView from "../../../../libs/common/scripts/modules/tips/views/BaseTipView";


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
export enum NoticeState{
    NONE = 0,
    UPING,
    OVER
}
@ccclass
export default class LobbyTipsPanel extends BaseTipsPanel {
    
    private _views:BaseTipView[] = [];

    async animate(tipView: BaseTipView) {
        let view:BaseTipView = <BaseTipView>tipView;
        this._views.push( view );        
        this.doAnimation( view,100,NoticeState.UPING );        
    }

    private doAnimation( view:BaseTipView,targetY:number,flag:number = 0 ):void{
        let len:number = this._views.length;        
        if( len > 1 ){
            for( let i:number = len - 1 ; i > -1 ; i-- ){
                let tempPanel:BaseTipView = this._views[i];
                if( tempPanel && tempPanel != view && tempPanel.data.flag != NoticeState.OVER ){
                    this.move( tempPanel,tempPanel.data.targetY + tempPanel.node.height,tempPanel.data.flag );
                }                        
            }
        }        
        this.move( view,targetY,flag );
    }

    private move( target:BaseTipView,targetY:number,flag:number = 0,time:number = 0.2 ):void{
        target.unscheduleAllCallbacks();
        this.resetData( target );
        let action = cc.moveTo( time,0,targetY ).easing(cc.easeCubicActionOut());        
        let call = cc.callFunc( this.moveComplete,this,[target,flag] );
        if( flag != NoticeState.OVER ){
            action = cc.sequence( action,action,call );    
        }else{
            let fadeTo = cc.fadeTo( time,0 );
            action = cc.sequence( fadeTo,fadeTo,call );
        }
            
        target.node.runAction( action );
        target.data = {};
        target.data.action = action;
        target.data.targetY = targetY;
        target.data.flag = flag;
    }

    private moveComplete( node:cc.Node,datas:any[] ):void{
        if( datas ){
            let self = this;
            let view:BaseTipView = datas[0];
            let flag:number = datas[1];
            if(flag == NoticeState.UPING){   
                view.scheduleOnce( ()=>{
                    this.resetData( view );
                    self.move( view,view.node.y + 100,2 );
                },1 )
            }else if( flag == NoticeState.OVER){
                if( view ){
                    this.resetData( view );
                    view.node.removeFromParent();
                    view.node.y = 0;
                    this.overCallBack( view );
                }
            }
        }
    }

    private overCallBack( view:BaseTipView ):void{        
        if( !view )return;
        this.resetData( view );
        view.node.removeFromParent();        
        view.node.y = 0;   
        view.node.opacity = 255;
        let index:number = this._views.indexOf(view);
        if(index != -1){
            cc.log(`overCallBack`);
            this._views.splice( index,1 );
        }
        if( this._views.length <= 0 ){
            this.done();
        }
        this.recoverTipView( view );
    }

    private resetData( view:BaseTipView ){
        view.data = null;
    }
}
