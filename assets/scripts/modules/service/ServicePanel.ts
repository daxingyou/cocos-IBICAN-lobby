import Panel from "../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../libs/common/scripts/utils/UIManager";
import LobbySoundChannels from "../sound/LobbySoundChannels";
import JPAudio from "../../../libs/common/scripts/utils/JPAudio";
import UIUtils from "../../../libs/common/scripts/utils/UIUtils";

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
export default class ServicePanel extends Panel {

    @property(cc.Button)
    closeBtn:cc.Button = null;

    @riggerIOC.inject(LobbySoundChannels.PANEL_POP_UP)
    private popupChannel: JPAudio;

    @property(cc.ToggleContainer)
    private controlBtnToggleContainer: cc.ToggleContainer;

    @property([cc.Prefab])
    public content: cc.Prefab[] = [];

    @property(cc.Node)
    public currentView: cc.Node = null;

    private readonly toggleGroup: any = { usaQuestion: 0};
    readonly contentType: any = { UsaQues: 0 };
    
    public currentIndex: number = null;

    onShow():void{
        super.onShow();
        this.initToggle();
        this.addEventListener();
        // this.closeBtn.node.on( cc.Node.EventType.TOUCH_END, this.onClose, this);
    }

    onHide():void{
        this.popupChannel.stop();
        this.removeEventListener();
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onClose, this);
        this.controlBtnToggleContainer.node.children.forEach((toggle, idx) => {
            toggle.on('toggle', this.onToggleChanged, this);
        });
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onClose);
        this.controlBtnToggleContainer.node.children.forEach((toggle, idx) => {
            toggle.off('toggle', this.onToggleChanged, this);
        });
    }

    initToggle() {
        this.controlBtnToggleContainer.toggleItems[this.contentType.UsaQues].check();
        this.changeView(this.contentType.UsaQues);
    }

    private onToggleChanged(toggle: cc.Toggle) {
        let name = toggle.node.name;
        if (!name) return;
        this.changeView(this.toggleGroup[name]);
    }

    private changeView(index: number = 0) {
        if (this.currentIndex == index) return;
        this.currentIndex = index;

        let child = UIUtils.instantiate(this.content[this.currentIndex]);
        this.currentView.addChild(child)
    }

    private onClose():void{
        UIManager.instance.hidePanel( this );
    }
}
