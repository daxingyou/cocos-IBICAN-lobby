

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NativeUtils {
    public static readonly UTILS_FULL_NAME = "com/jp/utils/Utils";

    /**
     * 获取设备id
     */
    public static getDeviceId(): string {
        // if (!cc.sys.isNative) return null;
        let id: string;
        // TODO 需要判断平台
        switch (cc.sys.os) {
            case cc.sys.OS_ANDROID:
                id = jsb.reflection.callStaticMethod(NativeUtils.UTILS_FULL_NAME, "getDeviceId", "()Ljava/lang/String;");
                break;
            case cc.sys.OS_IOS:
                // mark
                id = jsb.reflection.callStaticMethod('NativeUtils', "getDeviceId");
                break;
            default:
                break;
        }

        if(!id) {
            id = cc.sys.localStorage.getItem('deviceId');
            if(!id) {
                id = `${Math.random() * 1000}`;
                cc.sys.localStorage.setItem('deviceId', `${id}`);
            }            
        }
        return id;
    }

    /**
     * 复制到剪切板
     * @param str 
     */
    public static copy(str: string): boolean {
        if (!cc.sys.isNative) return null;

        // TODO 需要判断平台
        switch (cc.sys.os) {
            case cc.sys.OS_ANDROID:
                let success = jsb.reflection.callStaticMethod(NativeUtils.UTILS_FULL_NAME, "copy", "(Ljava/lang/String;)Z", str);
                return success;
            case cc.sys.OS_IOS:
                // mark
                let isSuccess = jsb.reflection.callStaticMethod('NativeUtils', "appendToClipBoard:", str);
                return isSuccess;
            default:
                break;
        }
    }

    /**
     * 设置设备旋转方向
     * @param orientation 1:横屏, 2:竖屏, 3:根据用户朝向
     */
    public static setOrientation(orientation: number) {
        if (!cc.sys.isNative) return null;

        // TODO 需要判断平台
        switch (cc.sys.os) {
            case cc.sys.OS_ANDROID:
                jsb.reflection.callStaticMethod(NativeUtils.UTILS_FULL_NAME, "setOrientation", "(I)V", orientation);
                break;
            case cc.sys.OS_IOS:
                jsb.reflection.callStaticMethod('NativeUtils', "setOrientation:", orientation);
                break;
            default:
                break;
        }
    }

    /**
     * 保存到相册
     * @param str 
     */
    public static saveImageToAlbum(filePath: string): boolean {
        if (!cc.sys.isNative) return null;

        // TODO 需要判断平台
        switch (cc.sys.os) {
            case cc.sys.OS_ANDROID:
                cc.log(`save image to album in android`);
                let success = jsb.reflection.callStaticMethod(NativeUtils.UTILS_FULL_NAME, "saveImageToAlbum", "(Ljava/lang/String;)Z", filePath);
                return success;
            case cc.sys.OS_IOS:
                // mark
                let ios_res = jsb.reflection.callStaticMethod('NativeUtils', "saveImageToAlbum:", filePath);
                return ios_res;
            default:
                break;
        }
    }

    /**
     * 跳转App 
     * @param appId 1-Weichat 2-QQ 3-Alipay
     */
    public static jumpApp(appId: number): boolean {
        if (!cc.sys.isNative) return null;
        if([1,2,3].indexOf(appId) == -1) return null;
        // TODO 需要判断平台
        switch (cc.sys.os) {
            case cc.sys.OS_ANDROID:
                let result = jsb.reflection.callStaticMethod(NativeUtils.UTILS_FULL_NAME, "jumpApp", "(I)Z", appId);
                return result;
            case cc.sys.OS_IOS:
                // mark
               return jsb.reflection.callStaticMethod('NativeUtils', "jumpApp:", appId);
            default:
                break;
        }
    }

    /**
     * 是否安装微信
     */
    public static isInstallWx(): boolean {
        if (!cc.sys.isNative) return null;
        // TODO 需要判断平台
        switch (cc.sys.os) {
            case cc.sys.OS_ANDROID:
                let result = jsb.reflection.callStaticMethod(NativeUtils.UTILS_FULL_NAME, "isInstallWx", "()Z");
                return result;
            case cc.sys.OS_IOS:
                // mark
                return jsb.reflection.callStaticMethod('NativeUtils', "isInstallWx");
            default:
                break;
        }
    }

    /**
     * 分享图片到微信
     * @param imgBase64Data base64
     * @param type 0-对话 1-朋友圈 2-收藏
     */
    public static shareImgToWX(imgBase64Data: string, type: number) {
        if (!cc.sys.isNative) return null;
        // TODO 需要判断平台
        switch (cc.sys.os) {
            case cc.sys.OS_ANDROID:
                let result = jsb.reflection.callStaticMethod(NativeUtils.UTILS_FULL_NAME, "shareImgToWX", "(Ljava/lang/String;I)V", imgBase64Data, type);
                return result;
            case cc.sys.OS_IOS:
                // mark
                break;
            default:
                break;
        }
    }

    /**
     * 分享网页到微信
     * @param url 链接
     * @param title 标题
     * @param description 描述
     * @param imgBase64Data 缩略图base64编码字符串
     * @param type 0-对话 1-朋友圈 2-收藏
     */
    public static shareWebpageToWX(url: string, title: string, description: string, imgBase64Data: string, type: number) {
        if (!cc.sys.isNative) return null;
        // TODO 需要判断平台
        switch (cc.sys.os) {
            case cc.sys.OS_ANDROID:
                let result = jsb.reflection.callStaticMethod(NativeUtils.UTILS_FULL_NAME, "shareWebpageToWX", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V", url, title, description, imgBase64Data, type);
                return result;
            case cc.sys.OS_IOS:
                jsb.reflection.callStaticMethod('NativeUtils',"shareWebpageToWX:title:description:imgBase64Data:type:", url, title, description, imgBase64Data, type);
                // mark
                break;
            default:
                break;
        }
    }

    /**
     * 获取分享标识
     */
    public static getShareCode(): ShareCode {
        let referrerId: number = 0
        let referrerChannel: string = null
        let gameId: number = 0
        // let shareCode: string = null;
        // TODO 需要判断平台
        switch (cc.sys.os) {
            case cc.sys.OS_ANDROID:
                referrerId = jsb.reflection.callStaticMethod(NativeUtils.UTILS_FULL_NAME, "getReferrerId", "()I");
                referrerChannel = jsb.reflection.callStaticMethod(NativeUtils.UTILS_FULL_NAME, "getReferrerChannel", "()Ljava/lang/String;");
                gameId = jsb.reflection.callStaticMethod(NativeUtils.UTILS_FULL_NAME, "getGameId", "()I");
                break 
            case cc.sys.OS_IOS:
                referrerId =  jsb.reflection.callStaticMethod("NativeUtils", "getReferrerId");
                referrerChannel = jsb.reflection.callStaticMethod("NativeUtils", "getReferrerChannel");
                gameId = jsb.reflection.callStaticMethod("NativeUtils", "getGameId");
                break;
            default:
                break;
        }

        let shareCode = new ShareCode()
        shareCode.referrerId = referrerId ? referrerId : 0;
        shareCode.referrerChannel = referrerChannel ? referrerChannel : "";
        shareCode.gameId = gameId ? gameId : 0;
        
        return shareCode;
    }

}

export class ShareCode{
    constructor(){}
    public referrerId: number = 0;
    public referrerChannel: string = null;
    public gameId: number = 0;
}
