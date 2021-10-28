import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import MaintenancePanel from "./MaintenancePanel";
import { MaintenancePushSignal } from "../../../protocol/signals/signals";
import { MaintenancePush } from "../../../protocol/protocols/protocols";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";

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

export default class MaintenanceMediator extends JPMediator {
    @riggerIOC.inject(MaintenancePanel)
    protected view: MaintenancePanel;

    @riggerIOC.inject(MaintenancePushSignal)
    private maintenancePushSignal: MaintenancePushSignal;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    constructor() {
        super();
    }

    onShow() {
        super.onShow();
        this.maintenancePushSignal.on(this, this.onMaintenanceOver);
    }

    onHide() {
        super.onHide();
        this.maintenancePushSignal.off(this, this.onMaintenanceOver);
    }

    private onMaintenanceOver(resp: MaintenancePush) {
        if(this.view.maintenanceId == resp.maintenance.id && resp.maintenance.status != 2) {
            this.pushTipsQueueSignal.dispatch('维护结束,关闭页面,将重启游戏');
            this.view.isMaintenanceOver = true;
        }
    }
}
