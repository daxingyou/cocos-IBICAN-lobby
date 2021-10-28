import Task from "../../../utils/Task";
import { TipsInfo } from "../models/TipsInfo";
import UIManager from "../../../utils/UIManager";
import BaseWaitingPanel from "../views/BaseWaitingPanel";
import LayerManager from "../../../utils/LayerManager";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class PushWaitingQueueCommand extends riggerIOC.Command {


    execute([tips, task]: [TipsInfo, Task]): void {
        BaseWaitingPanel.show(tips, task);
    }
}
