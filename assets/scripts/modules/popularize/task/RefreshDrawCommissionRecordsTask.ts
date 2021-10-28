import BaseRefreshListTask from "../../../../libs/common/scripts/utils/refreshList/task/BaseRefreshListTask";
import { DirectCommissionResp, DrawCommissionRecordResp } from "../../../protocol/protocols/protocols";
import PopularizeServer from "../server/PopularizeServer";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class RefreshDrawCommissionRecordsTask extends BaseRefreshListTask<DrawCommissionRecordResp> {
    @riggerIOC.inject(PopularizeServer)
    private popularizeServer: PopularizeServer;

    constructor() {
        super();
    }

    async onTaskStart() {
        let requestRecordListTask = this.popularizeServer.requestDrawCommissionRecords();
        let result = await requestRecordListTask.wait();
        if (result.isOk) {
            this.setComplete(result.result);
        }
        else {
            this.setError(result.reason);
        }
    }
}
