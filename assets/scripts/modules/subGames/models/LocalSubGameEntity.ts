import SubGameEntity, { SubGameId } from "./SubGameEntity";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class LocalSubGameEntity {
    constructor(entity: SubGameEntity){
        this.gameId = entity.gameId;
        this.gameName = entity.gameName;
        this.gameType = entity.gameType;
        this.iconUrl = entity.iconUrl;
        this.isHot = entity.isHot;
        this.isNew = entity.isNew;
        this.recommendPicture = entity.recommendPicture;
        this.isRecommend = entity.isRecommend;
        this.status = entity.status;
        this.downloadUrl = entity.downloadUrl;
        this.latestVersion = entity.latestVersion;
        this.version = entity.version;        
    }

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
    public gameType: string;

    /**
     * 图标地址
     */
    public iconUrl: string = "";
    public isHot: boolean = false;
    public isNew: boolean = false;
    public recommendPicture:string;
    /**
     * 是否推荐
     */
    public isRecommend:boolean = false;
    public status: number = 0;  // 状态 1.开服 2.关服 3.维护
    public downloadUrl: string;  // 下载(更新)地址
    
    public latestVersion: string = null;  // 游戏的最新版本号
    public version: string = null; // 游戏的当前版本号
}
