import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import UIUtils from "../../../../libs/common/scripts/utils/UIUtils";

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
export default class PersonalCenterPanel extends Panel {
    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property(cc.Toggle)
    public personalInfoToggle: cc.Toggle = null;

    @property(cc.Toggle)
    public accountDetailsToggle: cc.Toggle = null;

    @property(cc.Node)
    public contentNode: cc.Node = null;

    @property([cc.Prefab])
    public contentPrefabs: cc.Prefab[] = [];

    constructor() {
        super();
    }

    private personalInfoView: cc.Node;
    private accountDetailsView: cc.Node;
    private currentView: cc.Node;
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
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.personalInfoToggle.node.on('toggle', this.onToggleChanged, this);
        this.accountDetailsToggle.node.on('toggle', this.onToggleChanged, this);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick, this);
        this.personalInfoToggle.node.off('toggle', this.onToggleChanged, this);
        this.accountDetailsToggle.node.off('toggle', this.onToggleChanged, this);
    }

    private onCloseBtnClick() {
        this.personalInfoToggle.check();
        this.closeWindow();
    }

    private onToggleChanged(toggle: cc.Toggle) {
        switch(toggle.node.name) {
            case 'MyInfo':
                this.changeView(0);
                break;
            case 'accountDetails':
                this.changeView(1);
                break;
            default:
                break;
        }
    }

    private currentIndex: number;
    private changeView(idx: number) {
        if (this.currentIndex == idx) return;
        this.currentIndex = idx;
        if (this.currentView) {
            this.currentView.destroy()
            this.currentView = null;
        };
        this.currentView = UIUtils.instantiate(this.contentPrefabs[this.currentIndex]);
        if (this.currentView) this.node.addChild(this.currentView);
    }
}
