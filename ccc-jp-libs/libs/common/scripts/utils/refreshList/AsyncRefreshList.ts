import RefreshListUpdateDescView from "./views/RefreshListUpdateDescView";
import RefreshListDescConst from "./const/RefreshListDescConst";
import AsyncList from "../AsyncList/AsyncList";
import Task from "../Task";
import BaseRefreshListTask from "./task/BaseRefreshListTask";
import UIUtils from "../UIUtils";

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
export default class AsyncRefreshList extends AsyncList {

    @property(cc.Prefab)
    updateDescViewPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    endDescViewPrefab: cc.Prefab = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    updateDescViewNode: cc.Node = null;
    endDescViewNode: cc.Node = null;

    protected bounceType: number = null;
    protected boarderPos: any = null;
    public refreshListDescConst: RefreshListDescConst;
    public refreshListTask: BaseRefreshListTask<any>;
    private _taskArgs: any = null;
    private _isTaskRun: boolean = false;

    updateDescView: RefreshListUpdateDescView = null;

    private onScroll(event: any, eventType: any) {
        if (eventType === cc.ScrollView.EventType.SCROLLING) {
            if (!this.boarderPos) {
                this.boarderPos = this.getBorderPosition();
            }
            if (this._isTaskRun) return;
            this.checkScroll();
        }

        if (eventType === cc.ScrollView.EventType.TOUCH_UP) {
            this.endScroll();
        }
        if (eventType === cc.ScrollView.EventType.SCROLL_ENDED) {
            this.bounceType = null;
            this.boarderPos = null;
        }
    }

    private checkScroll() {
        this.bounceType = this.getBorderDirection();
        if (this.bounceType === cc.ScrollView.EventType.BOUNCE_TOP ||
            this.bounceType === cc.ScrollView.EventType.BOUNCE_LEFT) {
            if (!this.updateDescViewNode.active) {
                this.showUpdateDescView();
            } else {
                this.updateStateOfDescView();
            }
        } else if (this.bounceType === cc.ScrollView.EventType.BOUNCE_BOTTOM ||
            this.bounceType === cc.ScrollView.EventType.BOUNCE_RIGHT) {
            if (!this.endDescViewNode.active) {
                this.showEndDesc();
            } else {
                this.updateEndDescSize();
            }
        }
    }

    private endScroll() {
        if (this._isTaskRun) return;

        if (this.bounceType && this.bounceType > 0 &&
            (this.bounceType === cc.ScrollView.EventType.BOUNCE_TOP ||
                this.bounceType === cc.ScrollView.EventType.BOUNCE_LEFT)) {
            if (this.checkDistance()) {
                this._isTaskRun = true;
                this.sentUpdateSignal();
                this.executeUpdate();
            }
        }
    }


    protected getBorderDirection() {
        let direction: number = 0;
        if (!this.boarderPos) return direction;
        if (this.scrollView.vertical && this.boarderPos.startPos.y > this.node.y) {
            direction = cc.ScrollView.EventType.BOUNCE_TOP;
        } else if (this.scrollView.horizontal && this.boarderPos.startPos.x < this.node.x) {
            direction = cc.ScrollView.EventType.BOUNCE_LEFT;
        } else if (this.scrollView.vertical && this.boarderPos.endPos.y < this.node.y) {
            direction = cc.ScrollView.EventType.BOUNCE_BOTTOM;
        } else if (this.scrollView.horizontal && this.boarderPos.endPos.x > this.node.x) {
            direction = cc.ScrollView.EventType.BOUNCE_RIGHT;
        }
        return direction === 0 ? this.bounceType || direction : direction;
    }

    protected getBorderPosition(): any {
        let startPosition = new cc.Vec2(0, 0);
        let endPosition = new cc.Vec2(0, 0);
        if (this.scrollView.vertical) {
            startPosition.y = this.node.parent.height * (1 - this.node.parent.anchorY) - this.node.height * (1 - this.node.anchorY);
            endPosition.y = this.node.height * this.node.anchorY - this.node.parent.height * this.node.parent.anchorY;
        } else {
            startPosition.x = -this.scrollView.node.height * this.scrollView.node.anchorY;
            endPosition.x = this.scrollView.node.width - this.node.width;
        }
        return { startPos: startPosition, endPos: endPosition }
    }

    protected checkDistance(): boolean {
        let distance = this.getDistance();
        let maxDistance = 0;
        if (this.scrollView.vertical) {
            let isDown = this.bounceType === cc.ScrollView.EventType.BOUNCE_TOP
            maxDistance = isDown ? this.updateDescViewNode.height : this.endDescViewNode.height;
        } else {
            let isToRight = this.bounceType === cc.ScrollView.EventType.BOUNCE_LEFT
            maxDistance = isToRight ? this.updateDescViewNode.width : this.endDescViewNode.width;
        }
        return maxDistance > 0 && maxDistance <= distance
    }

    private getDistance(): number {
        let curPos = this.node;
        let distance = 0;
        if (this.scrollView.vertical) {
            let isDown = this.bounceType === cc.ScrollView.EventType.BOUNCE_TOP
            distance = isDown ? this.boarderPos.startPos.y - curPos.y : curPos.y - this.boarderPos.endPos.y;
        } else {
            let isToRight = this.bounceType === cc.ScrollView.EventType.BOUNCE_LEFT
            distance = isToRight ? curPos.x - this.boarderPos.startPos.x : this.boarderPos.startPos.x - curPos.x;
        }
        return distance
    }

    protected updateStateOfDescView() {
        let isEnoughDistance = this.checkDistance();
        let state = isEnoughDistance ? this.refreshListDescConst.updateStateTypes.TO_UPDATE : this.refreshListDescConst.updateStateTypes.CAN_UPDATE;
        this.updateDescView.changeState(state);
        let distance: number = this.getDistance();
        if (this.scrollView.vertical) {
            this.updateDescViewNode.getComponent(cc.Widget).isAlignTop = true;
            this.updateDescViewNode.getComponent(cc.Widget).top = !isEnoughDistance ? distance - this.updateDescViewNode.height : 0;
            this.updateDescViewNode.getComponent(cc.Widget).updateAlignment();
        } else {
            this.updateDescViewNode.getComponent(cc.Widget).isAlignLeft = true;
            this.updateDescViewNode.getComponent(cc.Widget).left = !isEnoughDistance ? distance - this.updateDescViewNode.width : 0;
            this.updateDescViewNode.getComponent(cc.Widget).updateAlignment();
        }
    }

    async executeUpdate() {
        let layout: cc.Layout = this.node.getComponent(cc.Layout) as cc.Layout;
        let oldValue: number = 0;
        if (this.scrollView.vertical) {
            oldValue = layout.paddingTop;
            layout.paddingTop = oldValue + this.updateDescViewNode.height + this.node.height / this.itemNum;
            this.updateDescViewNode.getComponent(cc.Widget).top = 0;
        } else {
            oldValue = layout.paddingLeft;
            layout.paddingTop = oldValue + this.updateDescViewNode.width + this.node.width / this.itemNum;
            this.updateDescViewNode.getComponent(cc.Widget).left = 0;
        }
        this.updateDescViewNode.getComponent(cc.Widget).updateAlignment();
        if (this.refreshListTask) {
            // if (this.refreshListTask.isWaitting()) {
            //     this.refreshListTask.cancel(false);
            // }
            // this.refreshListTask.reset();
            await this.refreshListTask.refresh(this._taskArgs).wait();
        }

        // this.refreshListTask.done();
        this.updateDescView.changeState(this.refreshListDescConst.updateStateTypes.UPDATE_SUC);

        await riggerIOC.waitForSeconds(300);

        this._isTaskRun = false;

        if (this.scrollView.vertical) {
            layout.paddingTop = oldValue;
        } else {
            layout.paddingTop = oldValue;
        }
        this.updateDescViewNode.active = false;
    }

    public setUpdateTask(task: BaseRefreshListTask<any>, args?: any) {
        this.refreshListTask = task;
        this._taskArgs = args;
    }

    private onScrollEvnet() {
        let eventHandler: cc.Component.EventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "AsyncRefreshList";
        eventHandler.handler = "onScroll";
        this.scrollView.scrollEvents.push(eventHandler);
        this.scrollView.node.on(cc.Node.EventType.TOUCH_CANCEL, this.endScroll, this);
        this.scrollView.node.on(cc.Node.EventType.TOUCH_END, this.endScroll, this);
    }

    private sentUpdateSignal(): void {
        this.updateDescView.changeState(this.refreshListDescConst.updateStateTypes.UPATING);
    }

    private showUpdateDescView(): void {
        if (this.updateDescViewNode.active) return;
        if (this.scrollView.vertical) {
            this.updateDescViewNode.getComponent(cc.Widget).isAlignTop = true;
            this.updateDescViewNode.getComponent(cc.Widget).top = - this.updateDescViewNode.height;
        } else {
            this.updateDescViewNode.getComponent(cc.Widget).isAlignLeft = true;
            this.updateDescViewNode.getComponent(cc.Widget).left = -this.updateDescViewNode.width;
        }
        this.updateDescViewNode.getComponent(cc.Widget).updateAlignment();
        this.updateDescView.changeState(this.refreshListDescConst.updateStateTypes.CAN_UPDATE)
        this.updateDescViewNode.active = true;
    }


    private showEndDesc(): void {
        if (this.endDescViewNode.active) return;
        if (this.scrollView.vertical) {
            this.endDescViewNode.getComponent(cc.Widget).isAlignBottom = true;
            this.endDescViewNode.getComponent(cc.Widget).bottom = - this.endDescViewNode.height;
        } else {
            this.endDescViewNode.getComponent(cc.Widget).isAlignRight = true;
            this.endDescViewNode.getComponent(cc.Widget).right = - this.endDescViewNode.width;
        }
        this.updateDescViewNode.getComponent(cc.Widget).updateAlignment();
        this.endDescViewNode.active = true;
    }

    private updateEndDescSize(): void {
        let isEnoughDistance = this.checkDistance();
        let distance: number = this.getDistance();
        if (this.items.length < 1) return;
        if (this.scrollView.vertical) {
            this.endDescViewNode.getComponent(cc.Widget).isAlignBottom = true;
            this.endDescViewNode.getComponent(cc.Widget).bottom = !isEnoughDistance ? distance - this.endDescViewNode.height : 0;
        } else {
            this.endDescViewNode.getComponent(cc.Widget).isAlignRight = true;
            this.endDescViewNode.getComponent(cc.Widget).right = !isEnoughDistance ? distance - this.endDescViewNode.width : 0;
        }
        this.endDescViewNode.getComponent(cc.Widget).updateAlignment();
    }

    start() {
        this.updateDescViewNode = UIUtils.instantiate(this.updateDescViewPrefab);
        if (this.updateDescViewNode) {
            this.node.parent.addChild(this.updateDescViewNode);
        }
        this.endDescViewNode = UIUtils.instantiate(this.endDescViewPrefab);
        if (this.endDescViewNode) {
            this.node.parent.addChild(this.endDescViewNode);
        }
        if (this.template && this.template instanceof cc.Node) this.template.active = false;
        if (this.endDescViewNode && this.endDescViewNode instanceof cc.Node) this.endDescViewNode.active = false;
        if (this.updateDescViewNode && this.updateDescViewNode instanceof cc.Node) {
            this.updateDescViewNode.active = false
            this.updateDescView = this.updateDescViewNode.getComponent(RefreshListUpdateDescView);
        };
        this.refreshListDescConst = new RefreshListDescConst();
        this.onScrollEvnet();
    }


    public onDisable() {
        this.scrollView.node.off(cc.Node.EventType.TOUCH_CANCEL, this.endScroll);
        this.scrollView.node.off(cc.Node.EventType.TOUCH_END, this.endScroll);
    }
}
