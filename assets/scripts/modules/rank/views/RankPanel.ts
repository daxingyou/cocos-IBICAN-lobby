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

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankPanel extends Panel {

    @property(cc.Button)
    public closeBtn: cc.Button = null;


    @property([cc.Prefab])
    public content: cc.Prefab[] = [];

    @property(cc.Button)
    public earnGoldBtn: cc.Button = null;

    @property(cc.Button)
    public drawCommissionBtn: cc.Button = null;
   
    @property(cc.Sprite)
    public ButtonTexts: cc.Sprite[] = [];

    @property(cc.SpriteFrame)
    private buttonBgNormal: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private buttonBgSelect: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private buttonNormalTexts: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    private buttonSelcetTexts: cc.SpriteFrame[] = [];

    public currentView: cc.Node;
    public currentIndex: number = null;
    readonly contentType: any = { EarnGold: 0, DrawCommission: 1};

    constructor() {
        super();
    }
  
    onInit() {
        super.onInit();
        this.changeView(this.contentType.EarnGold);
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
        this.earnGoldBtn.node.on('click', this.onTouchEarnGold, this);
        this.drawCommissionBtn.node.on('click', this.onTouchDrawCommission, this);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick);
        this.earnGoldBtn.node.off('click', this.onTouchEarnGold);
        this.drawCommissionBtn.node.off('click', this.onTouchDrawCommission);
    }

    private changeView(index: number = 0) {
        if (this.currentIndex == index) return;
        let button: cc.Button = this._getButtonByIndex(this.currentIndex);
        if (button) {
            button.target.getComponent(cc.Sprite).spriteFrame = this.buttonBgNormal;
            this.ButtonTexts[this.currentIndex].spriteFrame = this.buttonNormalTexts[this.currentIndex];
        }

        this.currentIndex = index;
        if (this.currentView) this.currentView.destroy();
        this.currentView = null;
        this.currentView = UIUtils.instantiate(this.content[this.currentIndex]);
        if (this.currentView) {
            this.node.addChild(this.currentView);
        }

        button = this._getButtonByIndex(index);
        if (button) {
            button.target.getComponent(cc.Sprite).spriteFrame = this.buttonBgSelect;
            this.ButtonTexts[index].spriteFrame = this.buttonSelcetTexts[index];
        }
    }

    private _getButtonByIndex(index: number): cc.Button {
        if (index === undefined || index === null || index >= 3) return;
        let button: cc.Button = index === this.contentType.EarnGold ? this.earnGoldBtn: this.drawCommissionBtn;
        return button;
    }

    private onTouchEarnGold() {
        this.changeView(this.contentType.EarnGold);
    }

    private onTouchDrawCommission() {
        this.changeView(this.contentType.DrawCommission);
    }

    /**关闭按钮 */
    private onCloseBtnClick() {
        this.closeWindow();
    }

}