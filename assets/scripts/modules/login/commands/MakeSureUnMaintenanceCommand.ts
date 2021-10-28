
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

/**
 * 确保大厅处于未维护状态
 * 维护中则显示维护界面,禁止登录
 */
@ccclass
export default class MakeSureUnMaintenanceCommand extends riggerIOC.WaitableCommand {
    // @riggerIOC.inject(AssetsServer)
    // private assetsServer: AssetsServer;

    // @riggerIOC.inject(LoginServer)
    // private loginServer: LobbyLoginServer;

    // constructor() {
    //     super();
    // }

    async execute() {
    //      // 获取本地版本
    //      let localVersionTask: GetLocalMainVersionTask = this.assetsServer.getLocalMainVersion();
    //      if (!localVersionTask) return this.done(false);
    //      let version: string = await localVersionTask.wait();
    //      if (!version) return this.done(false);
    //      // cc.log(`local version:${version}`);
 
    //      // 向服务器请求版本对应的公告
    //      let noticeTask: GetUpdateNoticeTask = this.loginServer.requestUpdateNotice(version);
    //      let notice: MaintenanceNoticeInfo = await noticeTask.wait();
    //      cc.log(`notice:`);
    //      cc.log(notice);
    //      // 显示维护界面
    //      if (notice && notice.status == 2) {
    //          cc.log(`show MaintenancePanel`);
    //         UIManager.instance.showPanel(MaintenancePanel, LayerManager.tipsLayerName, true, [notice.maintenanceTitle, notice.maintenanceContent, notice.status]);
    //         cc.log(`noticeID:${notice.id}, version:${notice.version}, status:${notice.status}`);
    //         this.done(true);
    //     }
    //      this.done(false);
    }

    onCancel(){
        
    }
}
