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
export default class ActivityPanel extends Panel {
    @property(cc.Button)
    public returnBtn: cc.Button = null;

    @property(cc.Sprite)
    public title: cc.Sprite = null;

    @property(cc.ScrollView)
    public scrollView: cc.ScrollView = null;

    @property(AsyncList)
    public secondTitleList: AsyncList = null;

    @property(ActivityContentView)
    public content: ActivityContentView = null;

    @property([cc.SpriteFrame])
    public titleSpriteFrame: cc.SpriteFrame[] = [];

    @riggerIOC.inject(ActivityServer)
    private activityServer: ActivityServer = null;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal = null;

    constructor() {
        super();
    }

    onInit() {
        super.onInit();
        this.secondTitleList.onRender(this, this.onRender);
    }

    onShow() {
        super.onShow();
        this.addEventListener();
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
    }

    
    // 当前展示界面
    public currentPage: page = page.activity;
    onExtra(page: page) {
        this.currentPage = page;
        this.title.spriteFrame = this.titleSpriteFrame[page - 1];
    }

    onDispose() {
        super.onDispose();
        this.secondTitleList.offRender(this, this.onRender);
        this.data = null;
    }

    closeWindow() {
        this.needCache = false
        UIManager.instance.hidePanel(this);
    }

    addEventListener() {
        this.returnBtn.node.on('click', this.onReturnBtnClick, this);
    }

    removeEventListener() {
        this.returnBtn.node.off('click', this.onReturnBtnClick, this);
    }

    private onReturnBtnClick() {
        this.closeWindow();
    }

    /**全部数据 */
    protected data: Activity[] | Notice[];

    /**
     * 更新活动|公告列表
     * @param activityList 
     * @param noticeList 
     */
    updateSecondTitleList(list: Activity[] | Notice[]) {
        this.data = list;
        this.secondTitleList.reset(list.length);
        this.secondTitleList.run(2, 1);
        if(list.length <= 0) this.content.clear();
    }

    /**
     * 标题列表render函数
     * @param node 
     * @param idx 
     */
    private onRender(node: cc.Node, idx: number) {
        let item: SecondTitleListItemView = node.getComponent(SecondTitleListItemView) as SecondTitleListItemView;
        item.data = this.data[idx];
        item.index = idx;
        item.init(this.data[idx].title, this.data[idx].id);
        item.hideRedDot();
        item.node.off('click', this.onTitleItemClick, this);
        item.node.on('click', this.onTitleItemClick, this);

        //未读消息
        if(!this.data[idx].hasRead) {
            item.showRedDot();
            let parentName: string;
            let selfName: string;
            if(this.currentPage == page.activity) {
                parentName = RedDotNodeName.TOP_NODE_ACTIVITY;
                selfName = `activity${this.data[idx].id}`;
            }
            else {
                parentName = RedDotNodeName.TOP_NODE_NOTICE;
                selfName = `notice${this.data[idx].id}`;
            }
            item.redDotRegistrName = selfName;
            RedDotUtils.registrRedDot(selfName, parentName, 1);
        }
        if(!this.needCache){
            if(idx == 0) {
                item.node.emit('click', item.node.getComponent(cc.Toggle));
            }
        }
        
        if(idx == this.secondTitleList.items.length - 1) {
            this.updateTitleToggle();
        }
    }

    /**
     * 标题列表点击事件
     * @param e 
     */
    private async onTitleItemClick(e: cc.Toggle) {
        let item: SecondTitleListItemView = e.node.getComponent(SecondTitleListItemView);
        this.content.show(item.data); //展示内容
        this.updateTitleToggle();
        if(item.hasRead) return;

        //消除未读
        let task: ProtocolTask;
        if(this.currentPage == page.activity) {
            task = this.activityServer.readActivity(item.id);
        }
        else {
            task = this.activityServer.readNotice(item.id);
        }

        let result = await task.wait();
        if(result.isOk) {
            this.data[item.index].hasRead = true;
            item.hideRedDot();
            RedDotUtils.updateRedDot(item.redDotRegistrName, 0); //更新红点数量
            RedDotUtils.unRegistrRedDot(item.redDotRegistrName); //注销未读红点绑定
        }
        else {
            let reason: ErrResp = result.reason;
            this.pushTipsQueueSignal.dispatch(`${reason.errMsg}`)
            cc.log(`readNotice failed. reason: ${reason.errMsg}`);
        }
    }

    /**
     * 更新标题Toggle状态
     */
    private updateTitleToggle() {
        let length = this.secondTitleList.items.length;
        for(let i = 0; i < length; i++) {
            let item = this.secondTitleList.items[i] as cc.Node;
            item.emit('toggle', item.getComponent(cc.Toggle));
        }
    }
}

export enum page {
    activity = 1,
    notice
}