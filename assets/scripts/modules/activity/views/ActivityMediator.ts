import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import ActivityPanel, { page } from "./ActivityPanel";
import ActivityModel from "../models/ActivityModel";
import ActivityUpdateSignal from "../signals/ActivityUpdateSignal";
import { Activity, Notice } from "../../../protocol/protocols/protocols";

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

export default class ActivityMediator extends JPMediator {
    @riggerIOC.inject(ActivityPanel)
    protected view: ActivityPanel;

    @riggerIOC.inject(ActivityModel)
    private activityModel: ActivityModel;

    @riggerIOC.inject(ActivityUpdateSignal)
    private activityUpdateSignal: ActivityUpdateSignal;

    constructor() {
        super();
    }

    onInit() {
        super.onInit();
    }

    onShow() {
        super.onShow();
        this.addProtocolListener();
        this.onActivityUpdate();
    }

    onHide() {
        super.onHide();
        this.removeProtocolListener();
    }

    onDispose() {
        super.onDispose();
    }

    addProtocolListener() {
        this.activityUpdateSignal.on(this, this.onActivityUpdate);
    }

    removeProtocolListener() {
        this.activityUpdateSignal.off(this, this.onActivityUpdate);
    }

    /**
     * 活动、公告更新
     */
    private onActivityUpdate() {
        let list: Activity[] | Notice[] = [];
        if(this.view.currentPage == page.activity) list = this.activityModel.onLineActivitys();
        else if(this.view.currentPage == page.notice) list = this.activityModel.onLineNotices();
        this.view.updateSecondTitleList(list); //初始化二级标签
    }
}
