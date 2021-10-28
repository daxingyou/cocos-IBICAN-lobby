import NativeFileUtils from "../../../../libs/native/NativeFileUtils";
import SubGameEntity, { SubGameId } from "../models/SubGameEntity";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export class SubGameProject {
    constructor(proj: any, classes: { [className: string]: Function }) {
        this.project = proj;
        this.registeringClasses = classes;
    }
    project: any = null;

    /**
     * 需要注册的类
     */
    registeringClasses: { [className: string]: Function } = {};
}

export default class SubGameUtils {
    private static subGameSettingsMap: { [subGameId: string]: any } = {};
    private static subGameProjectsMap: { [subGameId: string]: SubGameProject } = {};
    private static lobbyId: string = "-1";

    /**
     * 大厅本身的注册类名，不在此表中的类定义，子游戏退出后将会被移除定义,以避免和其它子游戏冲突
     */
    public static get lobbyRegisteredClassNames(): { [name: string]: boolean } {
        if (!SubGameUtils.mLobbyRegisteredClassNames) {
            SubGameUtils.mLobbyRegisteredClassNames = {};
        }

        return SubGameUtils.mLobbyRegisteredClassNames;
    }
    private static mLobbyRegisteredClassNames: { [name: string]: boolean };

    /**
     * 初始化大厅已注册类名
     */
    public static initLobbyRegisteredClassNames(): void {
        //初始化大厅所有注册的类名
        SubGameUtils.clearLobbyRegisteredClassNames();
        let initClassNames: { [name: string]: boolean }
            = SubGameUtils.lobbyRegisteredClassNames;
        let now = <any>cc.js._registeredClassNames;
        for (var k in now) {
            initClassNames[k] = true;
        }

    }

    /**
     * 反注册掉所有非大厅注册的类
     */
    static unregisterNonLobbyClasses(): void {
        let init = SubGameUtils.lobbyRegisteredClassNames;
        let now = <any>cc.js._registeredClassNames;
        let needRemoved: Function[] = [];
        for (var k in now) {
            if (!init[k]) {
                needRemoved.push(cc.js.getClassByName(k));
            }
        }

        cc.js.unregisterClass(...needRemoved);
    }

    /**
     * 清除大厅已经注册的类名
     */
    private static clearLobbyRegisteredClassNames() {
        SubGameUtils.mLobbyRegisteredClassNames = {};
    }

    /**
     * 获取子游戏META数据
     * @param subGameId 
     */
    public static getSubGameMeta(subGameId: string | number) {
        let filePath: string = `${SubGameUtils.getSubGamesDir()}${subGameId}/meta.json`;
        if (!NativeFileUtils.isFileExist(filePath)) return null;
        let content: string = NativeFileUtils.getStringFromFile(filePath);
        return JSON.parse(content);
    }

    /**
     * 生成指定子游戏的路径
     * @param subGameId 
     */
    public static makeSubGamePath(subGameId: SubGameId): string {
        if (cc.sys.isNative)
            return `${NativeFileUtils.getWritablePath()}subGames/${subGameId}/`

        return `/subGames/${subGameId}/`;
    }

    public static makeSubGameZipName(subGameId: SubGameId): string {
        if (!cc.sys.isNative) return null;
        return `${subGameId}.zip`;
    }

    public static getSubGamesDir(): string {
        return `${NativeFileUtils.getWritablePath()}subGames/`;
    }

    /**
     * 获取大厅的资源配置
     */
    public static getLobbySettings(): CCCAssetsSettings {
        let ret: CCCAssetsSettings = SubGameUtils.subGameSettingsMap[SubGameUtils.lobbyId];
        if (ret) return ret;

        let settingsFilePath: string = `src/settings.js`;
        let win: any = window;
        ret = win.require(settingsFilePath);
        if (ret) {
            // 对settings 进行处理
            SubGameUtils.treatSettings(ret);
            SubGameUtils.subGameSettingsMap[SubGameUtils.lobbyId] = ret;
            win._CCSettings = undefined;
        }

        return ret;
    }

    /**
     * 准备子游戏,包括资源配置，代码，及启动场景的预加载
     * @param settings 
     */
    public static prepare(settings: CCCAssetsSettings): void {
        cc.log(`treat jsList`);
        let jsList = settings.jsList;
        let option = {
            id: 'GameCanvas',
            scenes: settings.scenes,
            debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
            showFPS: !false && settings.debug,
            frameRate: 60,
            jsList: jsList,
            groupList: settings.groupList,
            collisionMatrix: settings.collisionMatrix,
        };

        cc.log(`assetLibrary init`)
        // init assets
        cc.AssetLibrary.init({
            libraryPath: 'res/import',
            rawAssetsBase: 'res/raw-',
            rawAssets: settings.rawAssets,
            packedAssets: settings.packedAssets,
            md5AssetsMap: settings.md5AssetsMap,
            subpackages: settings.subpackages
        });

        console.log(`run game`);
        cc.game.run(option, () => SubGameUtils.onStart(settings));
    }

    /**
     * 获取指定子游戏的settings数据
     * 如果已经获取过（缓存在内存中），直接返回，否则先加载，再做处理
     * @param subGameId 
     */
    public static getSubGameSettings(subGame: SubGameEntity): CCCAssetsSettings {
        let ret: CCCAssetsSettings = SubGameUtils.subGameSettingsMap[subGame.gameId];
        if (ret) return ret;

        let settingFileName: string = subGame.settings;
        if (!settingFileName) {
            // 加载
            let meta = SubGameUtils.getSubGameMeta(subGame.gameId);
            if (meta) {
                subGame.index = meta.index;
                settingFileName = subGame.settings = (meta.settings || meta.settingsFileName);
            }
        }

        let settingsFilePath: string = `${SubGameUtils.makeSubGamePath(subGame.gameId)}src/${settingFileName}`;
        let win: any = window;
        win.require(settingsFilePath);
        ret = win._CCSettings
        if (ret) {
            // 对settings 进行处理
            SubGameUtils.treatSettings(ret);
            SubGameUtils.subGameSettingsMap[subGame.gameId] = ret;
            win._CCSettings = undefined;
        }

        return ret;
    }

    /**
     * 准备（如果没有则加载）游戏包的project文件
     * 同时会对需要的类进行注册
     * @param subGameId 
     */
    public static prepareProject(subGame: SubGameEntity): SubGameProject {
        let ret: SubGameProject = SubGameUtils.subGameProjectsMap[subGame.gameId];
        if (ret) {
            // 注册类
            let classes = ret.registeringClasses;
            for (var name in classes) {
                let id = classes[name].prototype['__cid__'];
                // cc.log(`now set className, name:${name}, id:${id}, has?:${classes[name].prototype.hasOwnProperty('__cid__')}`);
                cc.js.setClassName(name, classes[name]);
                // 仅以名字注册，并不会同时以原来的id注册类
                // 此方法不是一个公共方法，只能以这种方式调用
                cc.js._setClassId(id, classes[name]);
                // cc.log(`after set class, id:${id}, class:${cc.js._registeredClassIds[id]}`)
            }

            return ret;
        }

        let path: string = SubGameUtils.makeSubGameEntryPath(subGame);

        let w: any = window;
        let proj = w.require(path);
        if (proj) {
            // SubGameUtils.subGameProjectsMap[subGame.gameId] = ret;
            // 获取子游戏的类定义
            let newClasses: { [className: string]: Function }
                = SubGameUtils.getAccRegisteredClass();
            SubGameUtils.subGameProjectsMap[subGame.gameId]
                = new SubGameProject(proj, newClasses);
        }

        return ret;
    }

    /**
     * 获取新增的注册类
     */
    private static getAccRegisteredClass(): { [className: string]: Function } {
        let lobbys = SubGameUtils.lobbyRegisteredClassNames;
        let now = <any>cc.js._registeredClassNames;
        let ret: { [className: string]: Function } = {};
        for (var k in now) {
            if (!lobbys[k]) {
                ret[k] = cc.js.getClassByName(k);
            }
        }

        return ret;
    }

    public static makeSubGameEntryPath(subGame: SubGameEntity): string {
        let subPath: string = SubGameUtils.makeSubGamePath(subGame.gameId);
        if (subGame.index) {
            return `${subPath}src/${subGame.index}`;
        }
        else {
            // 加载
            let meta = SubGameUtils.getSubGameMeta(subGame.gameId);
            if (meta) {
                subGame.index = meta.index;
                subGame.settings = (meta.settings || meta.settingsFileName);
            }

            return `${subPath}src/${subGame.index}`;
        }
    }

    /**
     * 将传入的settings与大厅的settings合并
     * 合并操作不会修改原来的settings
     * @param settings 
     */
    public static mergeLobbySettings(settings: CCCAssetsSettings): CCCAssetsSettings {
        let lobbySettings: CCCAssetsSettings = SubGameUtils.getLobbySettings();
        // jsList
        let mergedJsList: string[] = lobbySettings.jsList.concat(settings.jsList);
        // 场景
        let mergedScenes: { url: string, uuid: number | string }[]
            = lobbySettings.scenes.concat(settings.scenes);
        // debug
        let mergedDebug: boolean = settings.debug || lobbySettings.debug;
        let mergedGroupList: string[] = lobbySettings.groupList.concat(settings.groupList);
        let mergedCollisionMatrix: {}[] = lobbySettings.collisionMatrix.concat(settings.collisionMatrix);

        // 合并rawAssets [暂时未考虑重复id的合并问题]
        let mergedRawAssets = {};
        // 先把大厅的复制过来
        let lobbyRawAsseets = lobbySettings.rawAssets;
        for (let mount in lobbyRawAsseets) {
            if (!mergedRawAssets[mount]) mergedRawAssets[mount] = {};
            let lobbyRawAsseetsEnt = lobbyRawAsseets[mount];
            let mergedRawAssetsEnt = mergedRawAssets[mount];
            for (let id in lobbyRawAsseetsEnt) {
                mergedRawAssetsEnt[id] = lobbyRawAsseetsEnt[id];
            }
        }

        // 合并子游戏的RawAssets
        let subRawAssets = settings.rawAssets;
        for (let subMount in subRawAssets) {
            if (!mergedRawAssets[subMount]) mergedRawAssets[subMount] = {};
            let subRawAsseetsEnt = subRawAssets[subMount];
            let mergedRawAssetsEnt = mergedRawAssets[subMount];
            for (let id in subRawAsseetsEnt) {
                mergedRawAssetsEnt[id] = subRawAsseetsEnt[id];
            }
        }

        // 合并packedAssets
        let mergedPackedAssets = {};
        let lobbyPackedAssets = lobbySettings.packedAssets;
        let subPackedAssets = settings.packedAssets;

        // 先复制大厅的
        for (let pkgId in lobbyPackedAssets) {
            mergedPackedAssets[pkgId] = lobbyPackedAssets[pkgId];
        }
        // 子游戏中的
        for (let subPkgId in subPackedAssets) {
            // 可能需要检查重复的情况
            mergedPackedAssets[subPkgId] = subPackedAssets[subPkgId];
        }

        // md5AssetsMap
        let mergedMd5: {} = {};
        let lobbyMd5 = lobbySettings.md5AssetsMap;
        let subMd5 = settings.md5AssetsMap;
        // 合并大厅的
        for (let k in lobbyMd5) {
            mergedMd5[k] = lobbyMd5[k];
        }
        // 合并子游戏的
        for (let k in subMd5) {
            mergedMd5[k] = subMd5[k];
        }

        // subpackages
        // {"subId":[uuids]}
        let mergedSubPackages = {};
        let lobbySubPackages = lobbySettings.subpackages;
        let subSubPackages = settings.subpackages;
        // 合并大厅的
        for (let subId in lobbySubPackages) {
            mergedSubPackages[subId] = lobbySubPackages[subId];
        }
        // 子游戏
        for (let subId in subSubPackages) {
            mergedSubPackages[subId] = subSubPackages[subId];
        }

        // assetTypes
        let lobbyAssetTypes = lobbySettings.assetTypes || [];
        let subAssetTypes = settings.assetTypes || [];

        // uuids
        let lobbyUUIDS = lobbySettings.uuids || [];
        let subUUIDS = settings.uuids || [];

        let mergedSettings: CCCAssetsSettings = {
            platform: lobbySettings.platform,
            groupList: mergedGroupList,
            collisionMatrix: mergedCollisionMatrix,
            debug: mergedDebug,
            uuids: lobbyUUIDS.concat(subUUIDS),
            rawAssets: mergedRawAssets,
            assetTypes: lobbyAssetTypes.concat(subAssetTypes),
            packedAssets: mergedPackedAssets,
            jsList: mergedJsList,
            subpackages: mergedSubPackages,
            md5AssetsMap: mergedMd5,
            scenes: mergedScenes,
            launchScene: settings.launchScene,
        }

        return mergedSettings

    }


    /**
     * 一份settings只应该被处理一次
     * @param settings 
     */
    protected static treatSettings(settings: CCCAssetsSettings): void {
        if (!settings.debug) {
            cc.log(`>>>treat settings!<<<`);

            let uuids: (string | number)[] = settings.uuids;
            let rawAssets: {} = settings.rawAssets;
            let assetTypes: {} = settings.assetTypes;
            let realRawAssets = settings.rawAssets = {};

            for (let mount in rawAssets) {
                let entries: any = rawAssets[mount];
                let realEntries = realRawAssets[mount] = {};
                for (let id in entries) {
                    let entry = entries[id];
                    let type = entry[1];
                    // retrieve minified raw asset
                    if (typeof type === 'number') {
                        entry[1] = assetTypes[type];
                    }
                    // retrieve uuid
                    realEntries[uuids[id] || id] = entry;
                }
            }
            let scenes = settings.scenes;
            for (let i = 0; i < scenes.length; ++i) {
                let scene = scenes[i];
                if (typeof scene.uuid === 'number') {
                    scene.uuid = uuids[scene.uuid];
                }
            }

            let packedAssets = settings.packedAssets;
            for (let packId in packedAssets) {
                let packedIds = packedAssets[packId];
                for (let j = 0; j < packedIds.length; ++j) {
                    if (typeof packedIds[j] === 'number') {
                        packedIds[j] = uuids[packedIds[j]];
                    }
                }
            }

            let subpackages = settings.subpackages;
            for (let subId in subpackages) {
                let uuidArray = subpackages[subId].uuids;
                if (uuidArray) {
                    for (let k = 0, l = uuidArray.length; k < l; k++) {
                        if (typeof uuidArray[k] === 'number') {
                            uuidArray[k] = uuids[uuidArray[k]];
                        }
                    }
                }
            }

        }

        // 处理 jsList
        let jsList = settings.jsList;
        let bundledScript = settings.debug ? 'src/project.dev.js' : 'src/project.js';
        if (jsList) {
            jsList = jsList.map(function (x) {
                return 'src/' + x;
            });
            jsList.push(bundledScript);
        }
        else {
            jsList = [bundledScript];
        }
        settings.jsList = jsList;
    }

    private static onStart(settings) {
        console.log(`on start <<<`)
        // let settings = this.settings;
        // TODO 此处还要做处理
        cc.loader.downloader._subpackages = settings.subpackages;

        cc.view.enableRetina(true);
        cc.view.resizeWithBrowserSize(true);

        if (cc.sys.isMobile) {
            if (settings.orientation === 'landscape') {
                cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            }
            else if (settings.orientation === 'portrait') {
                cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
            }
            cc.view.enableAutoFullScreen([
                cc.sys.BROWSER_TYPE_BAIDU,
                cc.sys.BROWSER_TYPE_WECHAT,
                cc.sys.BROWSER_TYPE_MOBILE_QQ,
                cc.sys.BROWSER_TYPE_MIUI,
            ].indexOf(cc.sys.browserType) < 0);
        }

        // Limit downloading max concurrent task to 2,
        // more tasks simultaneously may cause performance draw back on some android system / browsers.
        // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.
        if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
            cc.macro.DOWNLOAD_MAX_CONCURRENT = 2;
        }

        // 获取子游戏的启动场景
        // let launchScene = settings.launchScene;
        // console.log(`now prepare sub game scene:${launchScene}`);
        // 预加载场景
        // cc.director.preloadScene(launchScene,
        //     progression,
        //     complete);

        // progression = complete = settings = null;
    }
}

export interface CCCAssetsSettings {
    platform: string;
    groupList: string[];
    collisionMatrix: {}[];
    debug?: boolean;
    uuids: (string | number)[];
    rawAssets: {};
    assetTypes: string[];
    packedAssets: {};
    jsList: string[];
    subpackages: {};
    md5AssetsMap: {};
    orientation: string;
    launchScene: string;
    scenes: { url: string, uuid: number | string }[];
}
