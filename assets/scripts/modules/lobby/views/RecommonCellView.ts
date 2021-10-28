import JPView from "../../../../libs/common/scripts/utils/JPView";
import SubGameEntity from "../../subGames/models/SubGameEntity";
import JPSprite from "../../../../libs/common/scripts/utils/JPSprite";
import Task from "../../../../libs/common/scripts/utils/Task";
import GameListItemView from "./GameListItemView";

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
export default class RecommonCellView extends GameListItemView {
   
    protected updateData(): void {
        if (!this._inited) return;
        if (!this.info) return;
        if( this.info.recommendPicture != undefined && this.info.recommendPicture != ""){
            this.resetFlags();
            this.icon.node.on( 'loadComplete',this.onLoadIconComplete,this );
            this.icon.url = this.info.recommendPicture;
        }
    }
}
