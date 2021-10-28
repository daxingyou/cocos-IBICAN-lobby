// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class NativeFileUtils {

    public static readonly ZIP_UTILS_FULL_NAME = "com/jp/utils/ZipUtils";

    /**
     * 将指定路径加入到搜索路径头部
     * 如果指定路径已经存在于探索路径中，则先删除，再添加至头部
     * @param path 
     */
    public static unshiftSearchPath(path: string): void {
        if (cc.sys.isNative) {
            let old: string[] = jsb.fileUtils.getSearchPaths();
            // 去掉已经有的
            old = old.filter(function (item) {
                return item != path;
            });
            old.unshift(path);
            jsb.fileUtils.setSearchPaths(old);
        }
    }

    /**
     * 移除指定搜索路径
     * @param path 
     */
    public static removeSearchPath(path: string): string[] {
        if (cc.sys.isNative) {
            let old: string[] = jsb.fileUtils.getSearchPaths();
            // 去掉已经有的
            old = old.filter(function (item) {
                return item != path;
            });
            jsb.fileUtils.setSearchPaths(old);

            return old;
        }
    }

    /**
     * 获取所在平台的可写目录 
     */
    public static getWritablePath(): string {
        // 需要判断平台
        if (cc.sys.isNative) return jsb.fileUtils.getWritablePath();
        return null;
    }

    /**
     * 本地是否存在本地文件
     * 如果非本地环境，返回false
     * @param path 
     */
    public static isFileExist(path: string): boolean {
        if (!cc.sys.isNative) return false;
        return jsb.fileUtils.isFileExist(path);
    }

    /**
     * 目录是否正常
     * @param dirPath 
     */
    public static isDirectoryExist(dirPath: string): boolean{
        if (!cc.sys.isNative) return false;
        return jsb.fileUtils.isDirectoryExist(dirPath);        
    }

    /**
     * 
     * @param dirPath 
     */
    public static createDirectory(dirPath: string): boolean{
        if (!cc.sys.isNative) return false;
        return jsb.fileUtils.createDirectory(dirPath);        
    }

    /**
     * 获取指定文件的字符串内容
     * @param path 
     */
    public static getStringFromFile(path: string): string {
        return jsb.fileUtils.getStringFromFile(path);
    }

    /**
     * 将指定文字内容写入指定文件
     * @param str 
     * @param filePath 
     */
    public static writeStringToFile(str: string, filePath: string): boolean {
        if (!cc.sys.isNative) {
            cc.warn("writeStringToFile is only valid in native")
            return;
        }
        return jsb.fileUtils.writeStringToFile(str, filePath);
    }

    /**
     * 将指定纹理内容写入指定文件
     * @param str 
     * @param filePath 
     */
    public static saveImageData(data: Uint8Array, imgWidth: number, imgHeight: number, filePath: string): void {
        if (!cc.sys.isNative) {
            cc.warn("writeStringToFile is only valid in native")
            return;
        }
        console.log("saveImageData ", filePath)
        jsb.saveImageData(data, imgWidth, imgHeight, filePath);
    }

    /**
     * 解压文件
     * @param filePath 需要被解压的文件
     * @param destDir 被解压到的目标路径
     * @returns {boolean} 如果解压成功则返回true,否则返回false
     */
    public static unZip(filePath: string, destDir: string): boolean {
        // 不是本地包直接返回false
        if (!cc.sys.isNative) {
            return false;
        }

        // TODO 需要判断平台
        switch (cc.sys.os) {
            case cc.sys.OS_ANDROID:
                jsb.reflection.callStaticMethod(NativeFileUtils.ZIP_UTILS_FULL_NAME, "unZip", "(Ljava/lang/String;Ljava/lang/String;)V", filePath, destDir);
                return true;
            case cc.sys.OS_IOS:
                jsb.reflection.callStaticMethod("NativeUtils", "unzipFileFromPath:toDest:", filePath, destDir);
                return true;
            default:
                return false;
        }
    }

    /**
     * 移除指定目录
     * @param dir 
     */
    public static removeDirectory(dir: string): void {
        if(!cc.sys.isNative){
            cc.warn("removeDirectory is only valid in native");
            return;            
        }
        jsb.fileUtils.removeDirectory(dir);
    }


}
