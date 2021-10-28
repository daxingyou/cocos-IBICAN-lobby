import WaitablePanel from "../../../../libs/common/scripts/utils/WaitablePanel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";

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
export default class DisconnectPanel extends WaitablePanel {
    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property(cc.Button)
    public reconnectBtn: cc.Button = null;

    @property(cc.Label)
    public content: cc.Label = null;

    
    constructor() {
        super();
    }

    onShow() {
    }

    onHide() {
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
    }
}
