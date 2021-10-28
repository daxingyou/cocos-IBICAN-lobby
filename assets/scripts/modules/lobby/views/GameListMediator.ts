import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import GameListView from "./GameListView";
import SubGamesModel, { SubGameType } from "../../subGames/models/SubGamesModel";
import SubGameEntity, { SubGameId, GameState } from "../../subGames/models/SubGameEntity";
import OnSubGameUpdateTaskCreateSignal from "../../subGames/signals/OnSubGameUpdateTaskCreateSignal";
import OnSubGameListUpdateSignal from "../../subGames/signals/OnSubGameListUpdateSignal";
import TryToLaunchSubGameSignal from "../../subGames/signals/TryToLaunchSubGameSignal";
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


export default class GameListMediator extends JPMediator {
    @riggerIOC.inject(SubGamesModel)
    protected subGameModel: SubGamesModel;

    @riggerIOC.inject(GameListView)
    protected gameListView: GameListView;

    @riggerIOC.inject(OnSubGameUpdateTaskCreateSignal)
    protected onCreateUpdateTaskSignal: OnSubGameUpdateTaskCreateSignal;

    @riggerIOC.inject(OnSubGameListUpdateSignal)
    private onSubGameListUpdateSignal: OnSubGameListUpdateSignal;

    onShow(): void {
        cc.log("game list mediator on show");
        this.onCreateUpdateTaskSignal.on(this, this.onUpdateStart);
        this.onSubGameListUpdateSignal.on(this, this.updateSubGameList);
        this.gameListView.onClickSignal.on(this, this.onClickSubGame);
        this.updateSubGameList();
    }

    onHide(): void {
        this.onSubGameListUpdateSignal.off(this, this.updateSubGameList);
        this.onCreateUpdateTaskSignal.off(this, this.onUpdateStart);
        this.gameListView.onClickSignal.off(this, this.onClickSubGame);

    }

    protected updateSubGameList(isReset: boolean = true): void {
        let chess: SubGameEntity[] = this.subGameModel.getSubGamesByType(SubGameType.CARD);
        let hunting: SubGameEntity[] = this.subGameModel.getSubGamesByType(SubGameType.HUNTING);
        this.gameListView.updateContent(chess.concat(hunting), isReset);
    }

    protected onUpdateStart(gameId: SubGameId): void {
        this.gameListView.startUpdate(gameId);
    }

    @riggerIOC.inject(TryToLaunchSubGameSignal)
    private tryToLaunchSubGameSignal: TryToLaunchSubGameSignal;

    protected onClickSubGame(subGame: GameListItemView){
        this.tryToLaunchSubGameSignal.dispatch(subGame.info)
    }

}