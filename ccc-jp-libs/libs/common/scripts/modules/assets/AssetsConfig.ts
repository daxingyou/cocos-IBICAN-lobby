// import UIUtils from "../../utils/UIUtils";
import BackBlockingPanel from "../../utils/BackBlockingPanel";
import BaseTipsPanel from "../tips/views/BaseTipsPanel";
import BaseWaitingPanel from "../tips/views/BaseWaitingPanel";
import AssetsUtils from "../../utils/AssetsUtils";


// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
// cc.log(`now asssets config`)
// if(!assetsPackageManager) var assetsPackageManager = new rigger.service.AssetsPackageManager();
// for(var k in assetsPackageManager){
//     cc.log(k);
// }
// UIUtils.assetsPackageManager = assetsPackageManager;
export default class AssetsConfig {

    /**
     * 资源包管理器
     */
    // public static readonly assetsPackageManager: rigger.service.AssetsPackageManager
    //     = new rigger.service.AssetsPackageManager();

    /**
     * 资源组定义
     */
    // 必需的初始资源组, 游戏启动后最先加载的游戏资源，如加载界面等
    public static readonly GROUP_INIT = "_GROUP_INIT";
    // 预加载资源组
    public static readonly GROUP_PRELOADING = "_GROUP_PRELOADING";

    /**
     * 资源包定义
     */
    public static readonly PKG_COMMON: string = "common";
    public static readonly PKG_LOADING: string = "loading";
    public static readonly PKG_LOGIN: string = "login";
    public static readonly PKG_TIPS: string = "tips";

    /**
     * 面板定义
     */

    // 背板定义
    @AssetsUtils.panel(AssetsConfig.GROUP_INIT, AssetsConfig.PKG_LOADING, BackBlockingPanel)
    public static readonly BACK_BLOCKING_PANEL = "ui/backBlockingPanel";

    @AssetsUtils.panel(AssetsConfig.GROUP_PRELOADING, AssetsConfig.PKG_TIPS, BaseTipsPanel)
    public static readonly TIPS_PANEL = "ui/tips/tipsPanel";

    @AssetsUtils.panel(AssetsConfig.GROUP_PRELOADING, AssetsConfig.PKG_TIPS, BaseWaitingPanel)
    public static readonly WAITING_PANEL = "ui/tips/waitingPanel";


    // 资源包定义
    // 资源包定义
    @AssetsUtils.assetsPackageManager.group(AssetsConfig.GROUP_INIT, AssetsConfig.PKG_LOADING)
    public static getLoadingAssets() {
        return [];
    }

    @AssetsUtils.assetsPackageManager.group(AssetsConfig.GROUP_PRELOADING, AssetsConfig.PKG_COMMON)
    public static getPreLoadingAssets() {
        return [];
    }
}
