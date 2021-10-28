import Panel from "../../../../libs/common/scripts/utils/Panel";
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
export default class PopularizeRebateListPanel extends Panel {
    @property(cc.Node)
    public contentNode: cc.Node = null;

    @property(cc.Button)
    public closeBtn: cc.Button = null;

    constructor() {
        super();
    }

    onInit() {
        super.onInit();
    }
            
    onShow() {
        super.onShow();
        this.addEventListener();
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
    }

    onDispose() {
        super.onDispose();
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
    }

    addEventListener() {
        this.closeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onCloseBtnClick, this);
    }

    removeEventListener() {
        this.closeBtn.node.off(cc.Node.EventType.TOUCH_END, this.onCloseBtnClick);
    }

    /**关闭按钮 */
    private onCloseBtnClick() {
        this.closeWindow();
    }

}