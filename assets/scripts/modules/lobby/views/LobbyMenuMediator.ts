import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import LobbyMenuView from "./LobbyMenuView";
import RedDotNodeName from "../../../utils/redDot/RedDotNodeName";
import RedDotUtils from "../../../utils/redDot/RedDotUtils";
import ActivityUpdateSignal from "../../activity/signals/ActivityUpdateSignal";
import ActivityModel from "../../activity/models/ActivityModel";
import LobbyMailUpdateRedPointSignal from "../../mail/signals/LobbyMailUpdateRedPointSignal";
import LobbyMailModel from "../../mail/model/LobbyMailModel";

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
export default class LobbyMenuMediator extends JPMediator {
    @riggerIOC.inject(LobbyMenuView)
    protected view: LobbyMenuView;

    @riggerIOC.inject(ActivityModel)
    private activityModel: ActivityModel;

    @riggerIOC.inject(LobbyMailModel)
    private mailModel: LobbyMailModel;

    @riggerIOC.inject(ActivityUpdateSignal)
    private activityUpdateSignal: ActivityUpdateSignal;

    @riggerIOC.inject(LobbyMailUpdateRedPointSignal)
    private udpateRedPointSignal: LobbyMailUpdateRedPointSignal;

    constructor() {
        super();
    }

    onInit() {
        super.onInit();
    }

    onShow() {
        super.onShow();
        this.addProtocolListener();
        this.view.setActivityRedDot(false);
        this.view.setNoticeRedDot(false);
        this.onActivityUpdate();
        this.onMailRedDotUpdate();
    }

    onHide() {
        super.onHide();
        this.removeProtocolListener();
    }

    addProtocolListener() {
        RedDotUtils.redDotUpdateSignal.on(this, this.onRedDotUpdate);
        this.activityUpdateSignal.on(this, this.onActivityUpdate);
        this.udpateRedPointSignal.on(this, this.onMailRedDotUpdate);
    }

    removeProtocolListener() {
        RedDotUtils.redDotUpdateSignal.off(this, this.onRedDotUpdate);
        this.activityUpdateSignal.off(this, this.onActivityUpdate);
        this.udpateRedPointSignal.off(this, this.onMailRedDotUpdate);
    }

    /**
     * 红点更新
     * @param name 
     */
    private onRedDotUpdate(name: string) {
        let redDotNum = RedDotUtils.getRedDotNumByNode(name);
        let visible = redDotNum > 0 ? true : false;
        switch (name) {
            case RedDotNodeName.TOP_NODE_ACTIVITY:
                this.view.setActivityRedDot(visible);
                break;
            case RedDotNodeName.TOP_NODE_NOTICE:
                this.view.setNoticeRedDot(visible);
                break;
            case RedDotNodeName.TOP_NODE_MAIL:
                this.view.setMailRedDot(visible);
                break;
            default:
                break;
        }
    }

    /**
     * 活动、公告更新
     */
    private onActivityUpdate() {
        let activityRedDotNum = this.activityModel.unreadActivity().length;
        let noticeRedDotNum = this.activityModel.unreadNotice().length;
        RedDotUtils.updateRedDot(RedDotNodeName.TOP_NODE_ACTIVITY, activityRedDotNum);
        RedDotUtils.updateRedDot(RedDotNodeName.TOP_NODE_NOTICE, noticeRedDotNum);
    }

    private onMailRedDotUpdate() {
        this.mailModel.checkRedPoint()
    }
}
