import Task from "../../../../libs/common/scripts/utils/Task";
import XMLHttpRequestTask from "../../../../libs/common/scripts/utils/XMLHttpRequestTask";
import MaintenanceNoticeInfo from "./MaintenanceNoticeInfo";
import Constants from "../../../../libs/common/scripts/Constants";
import LobbyConstants from "../../../LobbyConstants";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class GetMaintanceNoticeTask extends Task<MaintenanceNoticeInfo> {
    protected httpTask: XMLHttpRequestTask;

    start(): GetMaintanceNoticeTask {
        return super.start() as GetMaintanceNoticeTask;
    }

    @riggerIOC.inject(Constants)
    private constants: LobbyConstants;
    
    async onTaskStart() {
        // if (this.isWaitting()) return;

        // http://10.0.0.45:8080/passport/user/mobileLogin
        if (!this.httpTask) this.httpTask = new XMLHttpRequestTask("POST");
        this.httpTask.url = `${this.constants.jpApiUrl}lobby-manager/maintenance/getCurrent`;
        this.httpTask.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        this.httpTask.timeout = 3000;
        this.httpTask.start();

        let resp = await this.httpTask.wait();
        if (resp.isOk) {
            let ret: MaintenanceNoticeInfo | string = this.parse(resp.result);
            if(ret instanceof MaintenanceNoticeInfo) {
                this.setComplete(ret);
            }
            else {
                this.setError(ret);
            }
        }
        else {
            this.setError(resp.reason);
        }
    }

    onTaskCancel() {

    }

    private parse(resp: string): MaintenanceNoticeInfo | string {
        cc.log(`resp:${resp}`);
        let obj = JSON.parse(resp);
        if(obj.code == 0 && obj.data) {
            let noticeInfo: MaintenanceNoticeInfo = new MaintenanceNoticeInfo();
            noticeInfo.beginTime = obj.data.beginTime;
            noticeInfo.maintenanceTitle = obj.data.maintenanceTitle;
            noticeInfo.maintenanceContent = obj.data.maintenanceContent;
            noticeInfo.updateContent = obj.data.updateContent;
            noticeInfo.createTime = obj.data.createTime;
            noticeInfo.endTime = obj.data.endTime;
            noticeInfo.id = obj.data.id;
            noticeInfo.isDeleted = obj.data.isDeleted;
            noticeInfo.status = obj.data.status;
            noticeInfo.updateTime = obj.data.updateTime;
            noticeInfo.version = obj.data.version;
            noticeInfo.versionNumber = obj.data.versionNumber;
            return noticeInfo;
        }
        else {
            return obj.msg;
        }
    }
}
