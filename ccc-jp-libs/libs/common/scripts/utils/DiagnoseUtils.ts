import SceneUtils from "./SceneUtils";
import Constants from "../Constants";
import AssetsUtils from "./AssetsUtils";
import Application from "../Application";
/**
 * 资源快照，用于调试
 */
class ResourcesSnapshot {
    /**
     * 未能成功统计的资源
     */
    unStatistic: string[];

    /**
     * 还在使用中的资源
     */
    inUse: string[];

    /**
     * 不再使用的资源
     */
    unUsed: string[]

    /**
     * 未释放的资源
     */
    unReleased: string[];

    /**
     * 部分uuid到路径的映射表，只有resources目录下的资源才有此信息
     */
    uuidToPath: {};

}

export class SubGameChecker {
    @riggerIOC.inject(Constants)
    protected constants: Constants;

    constructor() {
    }

    /**
     * 检查一些基础项
     */
    checkBase(): [string, string[]] {
        let ret: string = "";
        let params: string[] = [];
        
        let [tempStr, tempParams] = this.checkLibVersion();        
        ret += tempStr;
        params = params.concat(tempParams);
        
        [tempStr, tempParams] = this.checkConstants();
        ret += tempStr;
        params = params.concat(tempParams);

        [tempStr, tempParams] = this.checkScenes();
        ret += tempStr;
        params = params.concat(tempParams);
        
        [tempStr, tempParams] = this.checkRes();
        ret += tempStr;
        params = params.concat(tempParams);

        return [ret, params];
    }

    /**
     * 检查应用，通过一个riggerIOC.ApplicationContextAnalyser来进行
     */
    checkApplication(): riggerIOC.ApplicationContextAnalyser {
        let id: string | number = this.constants.situationId;
        let app: riggerIOC.ApplicationContext = MainLogicService.getEntranceById(id);
        return app.analyser;
    }

    getApplication(): riggerIOC.ApplicationContext {
        let id: string | number = this.constants.situationId;
        let app: riggerIOC.ApplicationContext = MainLogicService.getEntranceById(id);
        return app;
    }

    /**
     * 检查重启相关，此接口通过和 checkApplication配合使用
     */
    checkRestart(): ProjStarter {
        return (new ProjStarter()).prepare();
    }

    // cocos creator 2.2.0有24个内置资源无法释放
    static readonly ALLOW_UNRELEASE_RES_NUM = 23; //临时 改到23,因为引擎有BUG
    // static readonly ALLOW_UNRELEASE_RES_NUM = 10;
    checkRes(): [string, string[]] {
        let snapShot: ResourcesSnapshot = this.makeResourceSnapshot();
        let ret: string = "";
        let params: string[] = [];

        // 未统计的数据
        let unStatistic = snapShot.unStatistic;
        let unStatisticInfo: string = this.makeAssetKeysOutputString(unStatistic);
        // 2.1.2引擎BUG导致有9个内置资源无法统计
        let [tempStr, tempParams] = this.makeCheckResult("未统计资源", unStatisticInfo, unStatistic.length <= 9)
        ret += tempStr;
        params = params.concat(tempParams);

        // 还未释放的资源
        let unReleased = snapShot.unReleased;
        let unReleasedInfo: string = this.makeAssetKeysOutputString(unReleased);
        // 有10个资源是默认资源是无法释放的（测试舞台使用)
        [tempStr, tempParams] = this.makeCheckResult("未释放资源", unReleasedInfo, unReleased.length <= SubGameChecker.ALLOW_UNRELEASE_RES_NUM);
        ret += tempStr;
        params = params.concat(tempParams);

        return [this.makeCheckBlock("资源检查", ret), params];
    }

    public makeResourceSnapshot(): ResourcesSnapshot {
        let pathToUUID = cc.loader["_assetTables"].assets._pathToUuid;
        let uuidToPath: {} = cc.js.createMap();
        // uuid -> path
        let ret = new ResourcesSnapshot();

        // uuidToPath
        let uuid;
        for (var path in pathToUUID) {
            uuid = cc.loader["_getResUuid"](path);
            uuidToPath[uuid] = path;
        }
        ret.uuidToPath = uuidToPath;

        // 未统计资源
        let unStatistic: string[] = AssetsUtils.getUnStatisticAssetKeys();
        ret.unStatistic = unStatistic;

        // 使用中资源
        let stillInUse: string[] = AssetsUtils.getInUseAssetKeys();
        ret.inUse = stillInUse;

        // 没被使用了的资源
        let unUsed: string[] = AssetsUtils.getUnusedAssetKeys();
        ret.unUsed = unUsed;

        // 还没被释放的资源
        let unReleased = AssetsUtils.getUnReleasedAssetKeys();
        ret.unReleased = unReleased;

        return ret;
    }

    // public makeResourceSnapshot(): ResourcesSnapshot {
    //     let cache = cc.loader["_cache"];
    //     let pathToUUID = cc.loader["_resources"]._pathToUuid;
    //     let uuidToPath:{} = {};
    //     // uuid -> path
    //     let info = { url: null, raw: false };
    //     let uuid, isInSettings, released = {}, unreleased = {};
    //     for (var path in pathToUUID) {
    //         uuid = cc.loader["_getResUuid"](path);
    //         isInSettings = cc["AssetLibrary"]._uuidInSettings(uuid);
    //         if (!isInSettings) {
    //             cc.log(`res:${path} is not in settings`);
    //         }
    //         info.url = null;
    //         cc["AssetLibrary"]._getAssetInfoInRuntime(uuid, info);
    //         if (cache[info.url]) {
    //             unreleased[path] = true;
    //         }
    //         else {
    //             released[path] = true;
    //         }
    //     }

    //     let ret = new ResourcesSnapshot();
    //     ret.released = released;
    //     ret.unReleased = unreleased;

    //     return ret;
    // }

    /**
     * 检查各种场景
     * @param subGameId 
     */
    public checkScenes(): [string, string[]] {
        let inLobbyScene: string = SceneUtils.getInLobbyScene(this.constants.situationId);
        let [tempStr, tempParams]
            = this.makeCheckResult("in-lobby-scene", inLobbyScene, !!inLobbyScene);
        return [this.makeCheckBlock("CHECK-SCENES", tempStr), tempParams];
    }

    public checkLibVersion(): [string, string[]]{
        let node = cc.find("application");
        let version = node.getComponent(Application).version;
        let [retStr, retParams] = this.makeCheckResult("lib-version", version, false);

        return [this.makeCheckBlock("CHECK-LIB-VERSION", retStr), retParams];
    }

    public checkConstants(): [string, string[]] {
        let report: string = "";
        let params: string[] = [];
        // id
        let [tempStr, tempParams] = this.makeCheckResult("situation-id",
            this.constants.situationId.toString(), (!!this.constants.situationId));
        params = params.concat(tempParams);
        report += tempStr;

        // channel-name
        [tempStr, tempParams] = this.makeCheckResult("channel-name", this.constants.defaultChannelName,
        (!!this.constants.defaultChannelName));
        report += tempStr;
        params = params.concat(tempParams);

        return [this.makeCheckBlock("CHECK-CONSTANTS", report), params];
    }

    private makeCheckBlock(title: string, ret: string): string {
        let starting: string = `===== ${title} =====\r\n`;
        let ending = starting;
        return starting + ret + ending;
    }

    private makeCheckResult(title: string, value: string, isOk: boolean = false): [string, string[]] {
        let style:string = `font-weight:bold;background-color:yellow`;
        let defaultStyle: string = "color:black;font-weight:no;background-color:cyan";
        return [`${title}:${value} ====> %c${isOk ? "ok" : "failed"}%c\r\n`, [isOk ? `color:green;${style}` : `color:red;${style}`, defaultStyle]];
    }

    private makeAssetKeysOutputString(keys: string[]): string {
        if (!keys) return "无";
        if (keys.length <= 0) return "无";
        let ret: string = "";
        for (var i: number = 0; i < keys.length; ++i) {
            ret += `${AssetsUtils.convertAssetKey(keys[i])}, `;
        }

        return `${ret} ====> 总共:${keys.length},允许:${SubGameChecker.ALLOW_UNRELEASE_RES_NUM}\r\n`;
    }


}

export class ProjStarter {
    @riggerIOC.inject(Constants)
    private constants: Constants;

    readonly testScene: string = "testReScene";
    private isSceneLoaded: boolean = false;
    private isReadyToStart: boolean = false;
    prepare(): ProjStarter {
        // this.restart = restart;
        this.isSceneLoaded = false;
        this.isReadyToStart = false;
        cc.log(`now prepare to restart`);
        cc.log(`now prepare scene: ${this.testScene}`);
        cc.director.preloadScene(this.testScene, null, this.onPrepareReSceneComplete.bind(this));

        return this;
    }

    /**
     * 启动
     */
    async start() {
        if (!this.isSceneLoaded) {
            cc.log(`>>> is loading scene:${this.testScene}, please wait`);
            return;
        }

        if (!this.isReadyToStart) {
            cc.log(`>>> is not ready to start, may be exiting last app, please wait`);
            return;
        }

        cc.log(`now try to launch sub game:${this.constants.situationId}`);
        riggerIOC.ApplicationContext.freeAppId(this.constants.situationId);
        let app = MainLogicService.instance.launch(this.constants.situationId);
        await app.launch();
        cc.log(`>>>> sub app start completely <<<<`);
    }

    private async onPrepareReSceneComplete(error) {
        if (error) {
            cc.log(`error when preload re-scene`);
        }
        else {
            this.isSceneLoaded = true;
            cc.director.loadScene(this.testScene);
            let id: string | number = this.constants.situationId;
            let app = MainLogicService.getEntranceById(id);
            MainLogicService.instance.exit(id);
            await app.dispose();
            this.isReadyToStart = true;
        }
    }
}

export default class DiagnoseUtils {
    static initChecker(): SubGameChecker {
        return new SubGameChecker();
    }
}