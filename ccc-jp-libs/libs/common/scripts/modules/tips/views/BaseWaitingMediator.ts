import JPMediator from "../../../utils/JPMediator";
import Task from "../../../utils/Task";
import { TipsInfo } from "../models/TipsInfo";
import BaseWaitingPanel from "./BaseWaitingPanel";
import UIManager from "../../../utils/UIManager";

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
export default class BaseWaitingMediator extends JPMediator {
    @riggerIOC.inject(BaseWaitingPanel)
    protected view: BaseWaitingPanel;

    onExtra([tips, task]: [TipsInfo, Task]) {
        this.view.setContent(tips);
        task && task.onComplete(this, this.onTaskComplete);
    }

    private onTaskComplete(task:Task): void {
        task && task.offComplete(this, this.onTaskComplete);
        UIManager.instance.hidePanel(this.view);
    }

}
