import JPView from "../../../utils/JPView";

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
export default class BaseWaitingContentView extends JPView {
    @property(cc.Label)
    public contentLabel: cc.Label = null;

    @property(cc.Sprite)
    circle:cc.Sprite = null

    private _action:cc.ActionInterval;
    setContent(cont:string){
        this.contentLabel.string = cont;
    }

    onShow(){
        let action = cc.repeatForever(cc.rotateBy(1.0, 360));
        this.circle.node.runAction( action );
        
    }

    onHide(){
        if( this._action){
            this.circle.node.stopAction( this._action );
        }
    }
}
