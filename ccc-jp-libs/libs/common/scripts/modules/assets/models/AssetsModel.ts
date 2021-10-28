import AssetsUtils from "../../../utils/AssetsUtils";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class AssetsModel extends riggerIOC.Model {
    public version: string = undefined;

    public packageAssetsMap: {} = {};
    public groupAssetsMap: {} = {};
    public assetsMap: {} = {};

    // dispose() {
    //     let groupMap = this.groupAssetsMap;
    //     this.groupAssetsMap = {};

    //     let pkgMap = this.packageAssetsMap;
    //     this.packageAssetsMap = {};

    //     let assetsMap = this.assetsMap;
    //     this.assetsMap = {};

    //     // 等待一帧
    //     // await new riggerIOC.WaitForTime().forFrame().wait();

    //     // 清理组资源
    //     for (var grp in groupMap) {
    //         AssetsUtils.assetsPackageManager.clearPackageByGroup(grp);
    //     }

    //     // 清除包资源
    //     for (var pkg in pkgMap) {
    //         AssetsUtils.assetsPackageManager.clearPackage(pkg);
    //     }

    //     // 清除其它资源
    //     for (var asset in assetsMap) {
    //         rigger.service.AssetsService.instance.clear(asset);
    //     }

    //     super.dispose();
    // }
}
