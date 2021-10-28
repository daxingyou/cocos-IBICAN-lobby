import Panel from "../../../../libs/common/scripts/utils/Panel";
import AsyncList from "../../../../libs/common/scripts/utils/AsyncList/AsyncList";
import ActivityContentView from "./ActivityContentView";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import { Activity, Notice, ErrResp } from "../../../protocol/protocols/protocols";
import SecondTitleListItemView from "./SecondTitleListItemView";
import RedDotUtils from "../../../utils/redDot/RedDotUtils";
import RedDotNodeName from "../../../utils/redDot/RedDotNodeName";
import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import ActivityServer from "../servers/ActivityServer";
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

@ccclass
export default class ActivityConectUI  {
    
    //每日分享活动界面
    public static readonly ACTIVITYDAILYSHARE_PANEL = "ui/activity/activityDailyShare";

    //每日转转赚活动界面
    public static readonly ACTIVITYDAILYDRAW_PANEL = "ui/activity/activityDailyDraw";
}
