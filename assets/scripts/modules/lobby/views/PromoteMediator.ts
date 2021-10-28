import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import SubGamesModel from "../../subGames/models/SubGamesModel";
import PromoteView from "./PromoteView";
import OnSubGameListUpdateSignal from "../../subGames/signals/OnSubGameListUpdateSignal";
import OnSubGameUpdateTaskCreateSignal from "../../subGames/signals/OnSubGameUpdateTaskCreateSignal";
import { SubGameId } from "../../subGames/models/SubGameEntity";


// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class PromoteMediator extends JPMediator {
    @riggerIOC.inject(PromoteView)
    protected promoteView: PromoteView;

    @riggerIOC.inject(SubGamesModel)
    protected subGameModel: SubGamesModel;

    @riggerIOC.inject(OnSubGameListUpdateSignal)
    private onSubGameListUpdateSignal: OnSubGameListUpdateSignal;

    @riggerIOC.inject(OnSubGameUpdateTaskCreateSignal)
    protected onCreateUpdateTaskSignal: OnSubGameUpdateTaskCreateSignal;

    onShow(): void {
        this.onSubGameListUpdateSignal.on( this,this.updateSubGameList );
        this.onCreateUpdateTaskSignal.on(this, this.onUpdateStart);
        this.updateSubGameList();
    }

    onHide(): void {
        super.onHide();
        this.onCreateUpdateTaskSignal.off(this, this.onUpdateStart);
        this.onSubGameListUpdateSignal.off( this,this.updateSubGameList );
    }

    protected updateSubGameList( isReset:boolean = true ):void{
        let recommons = this.subGameModel.recommendSubGameS;
        this.promoteView.updateContent( recommons,isReset );
    }

    protected onUpdateStart(gameId: SubGameId): void {
        this.promoteView.startUpdate(gameId);
    }
}