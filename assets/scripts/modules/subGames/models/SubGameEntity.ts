import { Game } from "../../../protocol/protocols/protocols";
import OnSubGameUpdateTaskCreateSignal from "../signals/OnSubGameUpdateTaskCreateSignal";
import SubGameUpdateTask from "../servers/SubGameUpdateTask";
import LocalSubGameEntity from "./LocalSubGameEntity";
import { SubGameType } from "./SubGamesModel";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export enum GameState {
    //状态 1.开服 2.关服 3.维护
    OPEN = 1,
    CLOSE,
    MAINTAIN
}

export type SubGameId = string | number;
export enum LaunchType {
    WebView = 1,
    Native = 2
}
export default class SubGameEntity {
    /**
     * 更新任务
     */
    public updateTask: SubGameUpdateTask;

    /**
     * 游戏ID
     */
    public gameId: SubGameId;

    /**
     * 游戏名称
     */
    public gameName: string;

    /**
     * 游戏类型
     */
    public gameType: SubGameType;

    /**
     * 游戏的启动类型
     */
    public launchType: LaunchType = LaunchType.WebView;

    /**
     * 图标地址
     */
    public iconUrl: string = "";
    public isHot: boolean = false;
    public isNew: boolean = false;
    /**是否推荐*/
    public isRecommend: boolean = false;
    public recommendPicture: string;
    public status: number = 0;  // 状态 1.开服 2.关服 3.维护
    public downloadUrl: string;  // 下载(更新)地址

    public latestVersion: string = null;  // 游戏的最新版本号
    public version: string = null; // 游戏的当前版本号
    public orientation: string = "";
    public index?: string;
    public settings?: string;

    public static fromLocal(local: LocalSubGameEntity): SubGameEntity {
        let entity: SubGameEntity = new SubGameEntity(local);
        entity.version = local.version;
        return entity;
    }

    constructor(game?: Game | LocalSubGameEntity) {
        if (game) {
            this.updateData(game);
        }
    }

    dispose(): void {
        this.updateTask && this.updateTask.dispose();
        this.updateTask = null;
    }

    /**
     * 是否最新
     */
    public get isLatest(): boolean {
        return this.latestVersion == this.version;
    }

    /**
     * 是否有本地版本，即是否曾经下载过
     */
    public get hasAnyLocalVersion(): boolean {
        return this.version != null;
    }

    /**
     * 是否正在进行下载
     */
    public get isUpdating(): boolean {
        return this.updateTask && this.updateTask.isWaitting();
    }

    @riggerIOC.inject(OnSubGameUpdateTaskCreateSignal)
    private onCreateUpdateSignal: OnSubGameUpdateTaskCreateSignal;

    /**
     * 更新版本，如果有版本可以更新(或正在更新)则返回true,否则false
     */
    public updateVersion(): boolean {
        if (!cc.sys.isNative) {
            cc.warn(`can not download sub-games in non-native situation`);
            return false;
        }

        if (this.isLatest) return false;
        if (this.isUpdating) return true;
        if (!this.updateTask) {
            this.updateTask = new SubGameUpdateTask(this);
        }
        else
        {
            this.updateTask.reset();
        }
        
        this.onCreateUpdateSignal.dispatch(this.gameId);

        this.updateTask.start();

        return true;
    }

    public updateVersionComplete(version: string): void {
        this.version = version;
    }

    updateData(game: Game | SubGameEntity | LocalSubGameEntity): void {
        this.gameId = game.gameId;
        this.gameName = game.gameName;
        this.gameType = game.gameType as SubGameType;
        this.isHot = game.isHot;
        this.isNew = game.isNew;
        this.status = game.status;
        this.isRecommend = game.isRecommend;
        this.downloadUrl = game.downloadUrl;
        this.recommendPicture = game.recommendPicture;
        if (game instanceof Game) {
            this.iconUrl = game.imageUrl;
            this.latestVersion = game.version;
            // this.index = game.index;
            // this.settings = game.settings;
            this.launchType = game.settings ? LaunchType.Native : LaunchType.WebView;
        }
        else {
            if (game instanceof LocalSubGameEntity) {
                this.version = game.version;
            }
            this.iconUrl = game.iconUrl;
            this.latestVersion = game.latestVersion;
        }
    }
}
