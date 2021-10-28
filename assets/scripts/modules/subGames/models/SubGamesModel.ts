import { Game } from "../../../protocol/protocols/protocols";
import SubGameEntity, { SubGameId } from "./SubGameEntity";
import OnSubGameListUpdateSignal from "../signals/OnSubGameListUpdateSignal";
import LocalSubGameEntity from "./LocalSubGameEntity";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
/**
 * 子游戏类型定义
 */
export enum SubGameType {
    CARD = "card",
    HUNTING = "hunting",
    SLOT = "slot",
    ARCADE = "arcade"
}

/**
 * 管理大厅所有子游戏的数据
 */
export default class SubGamesModel extends riggerIOC.Model {
    @riggerIOC.inject(OnSubGameListUpdateSignal)
    private onSubGameListUpdateSignal: OnSubGameListUpdateSignal;

    public runningSubGameId: SubGameId = null;

    public exitingSubGameId: SubGameId = null;

    protected mRecommendGames: SubGameEntity[] = [];

    public getSubGamesByType(t: SubGameType): SubGameEntity[] {
        let subGames: SubGameEntity[] = this.subGameTypes[t];
        subGames = subGames ? subGames : [];

        return subGames;

    }

    /**
     * 所有的子游戏列表
     */
    public get subGames(): SubGameEntity[] {
        if (!this.mSubGames) return null;
        return Object.values(this.mSubGames);
    }
    protected mSubGames: { [gameId: string]: SubGameEntity } = null;

    /**
     * 子游戏类型表
     */

    public get subGameTypes(): { [gameType: string]: SubGameEntity[] } {
        if (!this.mSubGameTypes) this.mSubGameTypes = {};
        return this.mSubGameTypes;
    }
    protected mSubGameTypes: { [gameType: string]: SubGameEntity[] };

    dispose(): void {
        this.mSubGames = null;
        super.dispose();
    }

    reset(): void {
        this.mSubGameTypes = {};
        this.mRecommendGames = [];
        this.exitingSubGameId = null;
        this.makeUninitlized();
    }

    /**
     * 是否初始化过子游戏信息了
     */
    public get isInitlized(): boolean {
        return this.mSubGames !== null;
    }

    public makeUninitlized(): void {
        this.mSubGames = null;
    }

    public getSubGame(subGameId: SubGameId): SubGameEntity {
        return this.mSubGames[subGameId];
    }

    /**
     * 获取推荐热门游戏
     */
    public get recommendSubGameS(): SubGameEntity[] {
        return this.mRecommendGames;
    }

    public updateSubGames(infos: (LocalSubGameEntity | SubGameEntity | Game)[]): void {
        cc.log(`updateSubGames:${infos}`);
        if (!infos) return;
        if (!this.mSubGames) this.mSubGames = {};

        // 重置原来的信息
        let oldGames = this.mSubGames;
        this.mSubGames = {};
        this.resetRecommendGame();
        this.resetSubGameType();

        // 更新
        for (let i: number = 0; i < infos.length; ++i) {
            // cc.log(`download url:${infos[i].downloadUrl}`)

            let temp: SubGameEntity | Game | LocalSubGameEntity = infos[i];

            // 查找原来有没有
            let old: SubGameEntity = oldGames[temp.gameId];
            if (old) {
                old.updateData(temp);
            }
            else {
                old = new SubGameEntity(temp);
            }

            this.addSubGame(old);
        }

        this.onSubGameListUpdateSignal.dispatch();
    }

    public updateSubGamesByLocal(locals: LocalSubGameEntity[]) {
        cc.log(`updateSubGamesByLocal:${locals}`);
        if (!locals) return;
        if (!this.mSubGames) this.mSubGames = {};

        for (let i: number = 0; i < locals.length; ++i) {
            let temp: LocalSubGameEntity = locals[i];
            this.addSubGame(SubGameEntity.fromLocal(temp));
        }

        this.onSubGameListUpdateSignal.dispatch();
    }

    public addSubGame(info: SubGameEntity | Game | LocalSubGameEntity): void {
        if (!info) return;
        let subGame: SubGameEntity;
        if (info instanceof SubGameEntity) {
            subGame = this.mSubGames[info.gameId] = info;
        }
        else {
            subGame = this.mSubGames[info.gameId] = new SubGameEntity(info);
        }

        // 增加类型
        this.addSubGameType(subGame);
        this.addRecommendGame(subGame);
    }

    protected addSubGameType(subGame: SubGameEntity): void {
        if (subGame.isRecommend) return;
        let old: SubGameEntity[] = this.subGameTypes[subGame.gameType];
        if (!old) {
            old = this.subGameTypes[subGame.gameType] = [];
        }
        old.push(subGame);
    }

    protected resetSubGameType(): void {
        this.mSubGameTypes = {};
    }

    protected resetRecommendGame(): void {
        this.mRecommendGames = [];
    }

    protected addRecommendGame(value: SubGameEntity): void {
        if (value.isRecommend && value.recommendPicture)
            this.mRecommendGames.push(value);
    }

    protected getRecommenGame(gameId: SubGameId): SubGameEntity {
        let len: number = this.mRecommendGames.length;
        for (let i: number = 0; i < len; i++) {
            let data: SubGameEntity = this.mRecommendGames[i];
            if (data.gameId == gameId) {
                return data;
            }
        }
        return null;
    }

    protected updateRecomendGame(value: SubGameEntity): void {
        let data: SubGameEntity = this.getRecommenGame(value.gameId);
        if (data && (!value.isRecommend || value.recommendPicture == "" || value.recommendPicture == undefined)) {
            let index: number = this.mRecommendGames.indexOf(data);
            if (index != -1) {
                this.mRecommendGames.splice(index, 1);
            }
        } else {
            if (!data && (value.isRecommend && value.recommendPicture)) {
                this.addRecommendGame(value);
            }
        }
    }
}
