import TouchFullScreen from "./TouchFullScreen";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class TouchFullScreenUtils {

    static readonly onFirefox: boolean = TouchFullScreenUtils.isOnAssignBrowser("firefox");
    static readonly onHuaWei: boolean = TouchFullScreenUtils.isOnAssignBrowser("huawei");
    static readonly onUcbrowser: boolean = TouchFullScreenUtils.isOnAssignBrowser("ucbrowser") || TouchFullScreenUtils.isOnAssignBrowser("ucweb");
    static readonly onQHBrowser: boolean = TouchFullScreenUtils.isOnAssignBrowser("qhbrowser") || TouchFullScreenUtils.isOnAssignBrowser("qihoobrowser") || TouchFullScreenUtils.isOnAssignBrowser("mqbhd");
    static readonly onOpera: boolean = TouchFullScreenUtils.isOnAssignBrowser("opera");
    static readonly isAppleWebkit: boolean = TouchFullScreenUtils.isOnAssignBrowser("applewebkit");
    static readonly isAdrChrome: boolean = TouchFullScreenUtils.isOnAssignBrowser("chrome");
    static readonly onQQ: boolean = TouchFullScreenUtils.isOnAssignBrowser("qq");
    static readonly isCompanyBrowser: boolean = TouchFullScreenUtils.isOnAssignBrowser("browser_type/android_app");
    static readonly onSamSung: boolean = TouchFullScreenUtils.isOnAssignBrowser("samsungbrowser");
    static readonly isJPApp: boolean = TouchFullScreenUtils.isOnAssignBrowser("jp_runtime/embedded");
    static readonly onXiaoMi: boolean = TouchFullScreenUtils.isOnAssignBrowser("miuibrowser");
    static readonly onIosChrome: boolean = TouchFullScreenUtils.isOnAssignBrowser("crios");
    static readonly isBaidu: boolean = TouchFullScreenUtils.isOnAssignBrowser("baidu");
    static readonly isOppo: boolean = TouchFullScreenUtils.isOnAssignBrowser("oppobrowser");

    static isSafari() {
        let t = TouchFullScreenUtils;
        return TouchFullScreenUtils.isOnAssignBrowser('safari') && !t.onFirefox && !t.onHuaWei && !t.onUcbrowser && !t.onQHBrowser && !t.onOpera && !t.isAdrChrome
                && !t.onQQ && !t.isCompanyBrowser && !t.onSamSung && !t.isJPApp && !t.onXiaoMi && !t.onIosChrome && !t.isBaidu && !t.isOppo;
    }

    static getScreenMode(): ScreenMode {
        if(TouchFullScreen.instance.getScreenMode() != ScreenMode.none) {
            return window.innerWidth >= window.innerHeight ? ScreenMode.LandScreen : ScreenMode.portraitScreen;
        }
        return cc.view.getFrameSize().width >= cc.view.getFrameSize().height ? ScreenMode.LandScreen : ScreenMode.portraitScreen;
    }

    /**不支持的浏览器标识 */
    static notSupportedBrowser: string[] = ['qbwebview', 'qhbrowser', 'qqbrowser', 'qihoobrowser', 'baidu', 'miuibrowser', 'samsungbrowser',
                                            'jp_runtime/embedded', 'browser_type/android_app', 'mqbhd', 'oppobrowser', 'firefox', 'huawei', 'vivobrowser', 'micromessenger'];

    static isSupported(): boolean {
        let userAgent: string = navigator.userAgent.toLocaleLowerCase();
        cc.log(`userAgent: ${userAgent}`);

        for(let i = 0; i < TouchFullScreenUtils.notSupportedBrowser.length; i++) {
            if(this.isOnAssignBrowser(TouchFullScreenUtils.notSupportedBrowser[i])) return;
        }
        if(!cc.sys.isMobile) return false;
        if(window.navigator['standalone']) return false;
        return true;
    }

    /**
     * 是否在指定的浏览器环境
     * @param keyword userAgent标识关键字 eg.chrom(谷歌)、jp_runtime/embedded(jpApp)
     */
    static isOnAssignBrowser(keyword: string): boolean {
        let userAgent: string = navigator.userAgent.toLocaleLowerCase();
        let onAssignBrowser: boolean = userAgent.indexOf(keyword) != -1;
        return onAssignBrowser;
    }
}

export enum ScreenMode {
   LandScreen = 0,
   portraitScreen,
   none
}
