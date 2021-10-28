import Panel from "../../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../../libs/common/scripts/utils/UIManager";
import JPAudio from "../../../../../libs/common/scripts/utils/JPAudio";
import LobbySoundChannels from "../../../sound/LobbySoundChannels";
import UIUtils from "../../../../../libs/common/scripts/utils/UIUtils";

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
export default class WithdrawCashPanel extends Panel {

    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property(cc.ToggleContainer)
    private controlBtnToggleContainer: cc.ToggleContainer;

    @property(cc.ToggleContainer)
    private controlBtnBgToggleContainer: cc.ToggleContainer;

    @property([cc.Prefab])
    public content: cc.Prefab[] = [];

    @riggerIOC.inject(LobbySoundChannels.PANEL_POP_UP)
    private popupChannel: JPAudio;

    onInit() {
        super.onInit();
        this.changeView(0);
    }

    public currentView: cc.Node;
    public currentIndex: number;
    private changeView(index: number = 0) {
        if (this.currentIndex == index) return;
        this.currentIndex = index;
        if (this.currentView) this.currentView.destroy();
        this.currentView = UIUtils.instantiate(this.content[this.currentIndex]);

        if (this.currentView) this.node.addChild(this.currentView);
    }

    onShow() {
        super.onShow();
        this.addEventListener();
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
        this.popupChannel.stop();
    }

    onDispose() {
        super.onDispose();
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.controlBtnToggleContainer.node.children.forEach((toggle, idx) => {
            toggle.on('toggle', this.onToggleChanged, this);
        });
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick, this);
        this.controlBtnToggleContainer.node.children.forEach((toggle, idx) => {
            toggle.off('toggle', this.onToggleChanged, this);
        });
    }

    private onToggleChanged(toggle: cc.Toggle) {
        let name = toggle.node.name;
        if (!name) return;
        switch (name) {
            case 'bankToggle':
                this.controlBtnBgToggleContainer.toggleItems[0].check();
                this.changeView(0);
                break;
            case 'alipayToggle':
                this.controlBtnBgToggleContainer.toggleItems[1].check();
                this.changeView(1);
                break;
            case 'detailsToggle':
                this.controlBtnBgToggleContainer.toggleItems[2].check();
                this.changeView(2);
                break;
            case 'runningwaterToggle':
                this.controlBtnBgToggleContainer.toggleItems[3].check();
                this.changeView(3);
                break;
            default:
                break;
        }
    }

    /**关闭按钮 */
    private onCloseBtnClick() {
        this.closeWindow();
    }
    // update (dt) {}
}


