import { Activity, Notice } from "../../../protocol/protocols/protocols";
import RedDotUtils from "../../../utils/redDot/RedDotUtils";
import RedDotNodeName from "../../../utils/redDot/RedDotNodeName";
import ActivityUpdateSignal from "../signals/ActivityUpdateSignal";

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

export default class ActivityModel extends riggerIOC.Model {
    @riggerIOC.inject(ActivityUpdateSignal)
    private activityUpdateSignal: ActivityUpdateSignal;

    constructor() {
        super();
    }

    dispose() {
        this._activityList = [];
        this._noticeList = [];
        this.activityUpdateSignal = null;
    }

    get activityList(): Activity[] {
        return this._activityList;
    }
    set activityList(v: Activity[]) {
        v = v.sort(this.compare);
        this._activityList = v;
        this.activityUpdateSignal.dispatch();
    }
    /**活动信息列表 */
    private _activityList: Activity[] = []; 


    get noticeList(): Notice[] {
        return this._noticeList;
    }
    set noticeList(v: Notice[]) {
        v = v.sort(this.compare);
        this._noticeList = v;
        this.activityUpdateSignal.dispatch();
    }
    /**公告信息列表 */
    private _noticeList: Notice[] = [];

    /**
     * 根据id返回活动
     * @param id 
     */
    public getActivityById(id: number): Activity {
        for(let i = 0; i < this._activityList.length; i++) {
            if(this._activityList[i].id == id) {
                return this._activityList[i];
            }
        }
    }

    /**
     * 根据id返回公告
     * @param id 
     */
    public getNoticeById(id: number): Notice {
        for(let i = 0; i < this._noticeList.length; i++) {
            if(this._noticeList[i].id == id) {
                return this._noticeList[i];
            }
        }
    }
 
    /**
     * 返回且已上线的未读活动列表
     */
    public unreadActivity(): Activity[] {
        let unreadList: Activity[] = [];
        if(!this._activityList || this._activityList.length <= 0) return unreadList;
        this._activityList.forEach(function(item) {
            if(!item.hasRead && item.status == 2) {
                unreadList.push(item);
            }
        });
        return unreadList;
    }

    /**
     * 返回已上线的未读公告列表
     */
    public unreadNotice(): Notice[] {
        let unreadList: Notice[] = [];
        if(!this._noticeList || this._noticeList.length <= 0) return unreadList;
        this._noticeList.forEach(function(item) {
            if(!item.hasRead && item.status == 2) {
                unreadList.push(item);
            }
        });
        return unreadList;
    }

    /**
     * 已上线的活动列表
     */
    public onLineActivitys(): Activity[] {
        let list: Activity[] = [];
        for(let i = 0; i < this._activityList.length; i++) {
            if(this._activityList[i].status == 2) {
                list.push(this._activityList[i]);
            }
        }
        return list;
    }

    /**
     * 已上线的公告列表
     */
    public onLineNotices(): Notice[] {
        let list: Notice[] = [];
        for(let i = 0; i < this._noticeList.length; i++) {
            if(this._noticeList[i].status == 2) {
                list.push(this._noticeList[i]);
            }
        }
        return list;
    }

    /**
     * 排序 从小到大
     * @param A 
     * @param B 
     */
    private compare(A: Activity | Notice, B: Activity | Notice) {
        return A.sortNum - B.sortNum;
    }
}

export enum ActiveType {
    External = 1,     //外部链接   
    Internal = 2,   //app内部跳转UI
}

export enum ShareChanel {
    Wechat = 1,     //微信   
    WechatFriend = 2,   //微信好友
    QQFrined = 3,   //QQ
    QQSquare = 4,   //QQ好友
}
