import ActivityListReqTask from "../tasks/ActivityListReqTask";
import NoticeListReqTask from "../tasks/NoticeListReqTask";
import ActivityReadReqTask from "../tasks/ActivityReadReqTask";
import NoticeReadReqTask from "../tasks/NoticeReadReqTask";
import OnLoginSuccessSignal from "../../../../libs/common/scripts/modules/login/signals/OnLoginSuccessSignal";
import ActivityModel from "../models/ActivityModel";
import { ActivityListResp, NoticeListResp, ActivityPush, NoticePush, MaintenancePromptPush, MaintenancePush, WinningPush, UserTomorrowScorePush, GrandWinningPush } from "../../../protocol/protocols/protocols";
import { ActivityPushSignal, NoticePushSignal, MaintenancePushSignal, WinningPushSignal, UserTomorrowScorePushSignal, GrandWinningPushSignal } from "../../../protocol/signals/signals";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import MaintenancePanel from "../views/MaintenancePanel";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import { timingSafeEqual } from "crypto";
import ActivityWinningInfoTask from "../tasks/ActivityWinningInfoTask";
import ActivityDrawReqTask from "../tasks/ActivityDrawReqTask";
import ActivityDrawModel from "../models/ActivityDrawModel";
import ActivityDrawSignal from "../signals/ActivityDrawSignal";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import ActivityDailyShareLinkTask from "../tasks/ActivityDailyShareLinkTask";
import ActivityShareSuccessTask from "../tasks/ActivityShareSuccessTask";
import GrandWingSignal from "../signals/GrandWingSignal";

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

export default class ActivityServer extends riggerIOC.Server {
    @riggerIOC.inject(OnLoginSuccessSignal)
    private loginSuccessSignal: OnLoginSuccessSignal;

    @riggerIOC.inject(ActivityModel)
    private activityModel: ActivityModel;

    @riggerIOC.inject(ActivityDrawModel)
    private activityDrawModel: ActivityDrawModel;

    @riggerIOC.inject(ActivityPushSignal)
    private activityPushSignal: ActivityPushSignal;

    @riggerIOC.inject(WinningPushSignal)
    private winningPushSignal: WinningPushSignal;

    @riggerIOC.inject(GrandWinningPushSignal)
    private grandWinningPushSignal: GrandWinningPushSignal;

    @riggerIOC.inject(UserTomorrowScorePushSignal)
    private userTomorrowScorePushSignal: UserTomorrowScorePushSignal;

    @riggerIOC.inject(NoticePushSignal)
    private noticePushSignal: NoticePushSignal;

    @riggerIOC.inject(MaintenancePushSignal)
    private maintenancePushSignal: MaintenancePushSignal;

    @riggerIOC.inject(ActivityDrawSignal)
    private activityDrawSignal: ActivityDrawSignal;

    @riggerIOC.inject(GrandWingSignal)
    private grandWingSignal: GrandWingSignal;    

    @riggerIOC.inject(ActivityListReqTask)
    private activityListReqTask: ActivityListReqTask;

    @riggerIOC.inject(NoticeListReqTask)
    private noticeListReqTask: NoticeListReqTask;

    @riggerIOC.inject(ActivityReadReqTask)
    private activityReadReqTask: ActivityReadReqTask;

    @riggerIOC.inject(NoticeReadReqTask)
    private noticeReadReqTask: NoticeReadReqTask;

    @riggerIOC.inject(ActivityWinningInfoTask)
    private activityWinningInfoTask: ActivityWinningInfoTask;

    @riggerIOC.inject(ActivityDrawReqTask)
    private activityDrawReqTask: ActivityDrawReqTask;

    @riggerIOC.inject(ActivityDailyShareLinkTask)
    private activityDailyShareLinkTask: ActivityDailyShareLinkTask;

    @riggerIOC.inject(ActivityShareSuccessTask)
    private activityShareSuccessTask: ActivityShareSuccessTask;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;

    constructor() {
        super();
        this.addProtocolListener();
    }

    dispose() {
        this.removeProtocolListener();
        super.dispose();
    }

    addProtocolListener() {
        this.loginSuccessSignal.on(this, this.onLoginSuccess);
        this.activityPushSignal.on(this, this.onActivityPush);
        this.noticePushSignal.on(this, this.onNoticePush);
        this.maintenancePushSignal.on(this, this.onMaintenancePush);
        this.winningPushSignal.on(this, this.onDrawMsgPush);
        this.grandWinningPushSignal.on(this, this.onGrandWingPush);
        this.userTomorrowScorePushSignal.on(this, this.onTomorrowScorePush);
    }

    removeProtocolListener() {
        this.loginSuccessSignal.off(this, this.onLoginSuccess);
        this.activityPushSignal.off(this, this.onActivityPush);
        this.noticePushSignal.off(this, this.onNoticePush);
        this.maintenancePushSignal.off(this, this.onMaintenancePush);
        this.winningPushSignal.off(this, this.onDrawMsgPush);
        this.grandWinningPushSignal.off(this, this.onGrandWingPush);
        this.userTomorrowScorePushSignal.off(this, this.onTomorrowScorePush);
    }

    /**
     * 登录成功
     */
    private onLoginSuccess() {
        this.initActivityList();
        this.initNoticeList();
        this.activityDrawModel.firstIntPut = true
    }

    private async initActivityList() {
        //初始化活动列表
        let activityListTask = this.getActivityList();
        let activityListRsult: riggerIOC.Result<ActivityListResp> = await activityListTask.wait();
        if(activityListRsult.isOk) {
            this.activityModel.activityList = activityListRsult.result.activityList;
        }
    }

    private async initNoticeList() {
        //初始化公告列表
        let noticeListTask = this.getNoticeList();
        let noticeListResult: riggerIOC.Result<NoticeListResp> = await noticeListTask.wait();
        if(noticeListResult.isOk) {
            this.activityModel.noticeList = noticeListResult.result.noticeList;
        }
    }

    /**
     * 请求获取活动列表
     */
    public getActivityList(): ActivityListReqTask {
        if(this.activityListReqTask.isWaitting()) return this.activityListReqTask;
        this.activityListReqTask.prepare();
        this.activityListReqTask.start();
        return this.activityListReqTask;
    }

    /**
     * 请求获取公告列表
     */
    public getNoticeList(): NoticeListReqTask {
        if(this.noticeListReqTask.isWaitting()) return this.noticeListReqTask;
        this.noticeListReqTask.prepare();
        this.noticeListReqTask.start();
        return this.noticeListReqTask;
    }

    /**
     * 请求获取每日转转赚获奖记录
     */
    public getWinningRecord(): ActivityWinningInfoTask {
        if(this.activityWinningInfoTask.isWaitting()) return this.activityWinningInfoTask;
        this.activityWinningInfoTask.prepare();
        this.activityWinningInfoTask.start();
        return this.activityWinningInfoTask;
    }

    /**
     * 请求转转赚抽奖
     */
    public getDailyDrawReq(poolId: number): ActivityDrawReqTask {
        if(this.activityDrawReqTask.isWaitting()) return this.activityDrawReqTask;
        this.activityDrawReqTask.prepare();
        this.activityDrawReqTask.start(poolId);
        return this.activityDrawReqTask;
    }

    /**
     * 请求获取每日分享链接
     */
    public getDailyShareLink(): ActivityDailyShareLinkTask {
        if(this.activityDailyShareLinkTask.isWaitting()) return this.activityDailyShareLinkTask;
        this.activityDailyShareLinkTask.prepare();
        this.activityDailyShareLinkTask.start();
        return this.activityDailyShareLinkTask;
    }

    /**
     * 分享成功
     */
    public shareSuccessReq([url,channel]:[string,number]): ActivityShareSuccessTask {
        if(this.activityShareSuccessTask.isWaitting()) return this.activityShareSuccessTask;
        this.activityShareSuccessTask.prepare();
        this.activityShareSuccessTask.start([url,channel]);
        return this.activityShareSuccessTask;
    }

    /**
     * 中奖记录推送
     */
    public onDrawMsgPush(resp: WinningPush){
        if(resp.winning.userId != this.lobbyUserModel.self.userId){
            this.activityDrawModel.latestWinningList = this.activityDrawModel.latestWinningList.concat(resp.winning)
            this.activityDrawSignal.dispatch()
        }
    }

    /**
     * 大奖记录推送
     */
    public onGrandWingPush(resp: GrandWinningPush){
        this.activityDrawModel.grandWinningList = [resp.winning].concat(this.activityDrawModel.grandWinningList)
        this.grandWingSignal.dispatch()
    }

    /**
     * 明日积分推送
     */
    public onTomorrowScorePush(resp: UserTomorrowScorePush){
        this.activityDrawModel.tomorrowScore = resp.tomorrowScore
    }   

    /**
     * 读活动
     * @param id 活动id 
     */
    public readActivity(id: number): ActivityReadReqTask {
        if(this.activityReadReqTask.isWaitting()) return this.activityReadReqTask;
        this.activityReadReqTask.prepare();
        this.activityReadReqTask.start(id);
        return this.activityReadReqTask;
    }

    /**
     * 读公告
     * @param id 公告d 
     */
    public readNotice(id: number): NoticeReadReqTask {
        if(this.noticeReadReqTask.isWaitting()) return this.noticeReadReqTask;
        this.noticeReadReqTask.prepare();
        this.noticeReadReqTask.start(id);
        return this.noticeReadReqTask;
    }

    /**
     * 活动推送
     * @param resp 
     */
    private onActivityPush(resp: ActivityPush) {
        cc.log(resp.activity);
        for(let i = 0; i < this.activityModel.activityList.length; i++) {
            if(resp.activity.id == this.activityModel.activityList[i].id) {
                this.activityModel.activityList.splice(i, 1);
                if(resp.activity.status == 3) {
                    //活动下线
                    this.activityModel.activityList = this.activityModel.activityList;
                    return;
                }
                else {
                    //排序更改
                    this.activityModel.activityList = this.activityModel.activityList.concat([resp.activity]);
                    return;
                }
            }
        }
        this.activityModel.activityList = this.activityModel.activityList.concat(resp.activity);
    }

    /**
     * 公告推送
     * @param resp 
     */
    private onNoticePush(resp: NoticePush) {
        cc.log(resp.notice);
        for(let i = 0; i < this.activityModel.noticeList.length; i++) {
            if(resp.notice.id == this.activityModel.noticeList[i].id) {
                this.activityModel.noticeList.splice(i, 1);
                if(resp.notice.status == 3) {
                    //公告下线
                    this.activityModel.noticeList = this.activityModel.noticeList;
                    return;
                }
                else {
                    //排序更改
                    this.activityModel.noticeList = this.activityModel.noticeList.concat([resp.notice]);
                    return;
                }
            }
        }
        this.activityModel.noticeList = this.activityModel.noticeList.concat(resp.notice);
    }

    /**
     * 维护公告(维护中)
     * @param resp 
     */
    private onMaintenancePush(resp: MaintenancePush) {
        cc.log(`maintenancePush`);
        cc.log(resp.maintenance);
        if(resp.maintenance.status == 2) {
            UIManager.instance.showPanel(MaintenancePanel, LayerManager.uiLayerName, true, [resp.maintenance.maintenanceTitle, resp.maintenance.maintenanceContent, resp.maintenance.id]);
        }
    }
}
