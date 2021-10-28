import JPView from "../../../../libs/common/scripts/utils/JPView";
import JPSprite from "../../../../libs/common/scripts/utils/JPSprite";
import ShowLoginPanelSignal from "../../../../libs/common/scripts/modules/login/signals/ShowLoginPanelSignal";
import ShowRegisterPanelSignal from "../../../../libs/common/scripts/modules/login/signals/ShowRegisterPanelSignal";
import ShowPersonalCenterPanelSignal from "../../user/signals/ShowPersonalCenterPanelSingal";

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
export default class UserBriefView extends JPView {
    @property(JPSprite)
    public iconImg: JPSprite = null;

    @property(cc.Label)
    public nickname: cc.Label = null;

    // @property(cc.Button)
    // public loginBtn: cc.Button = null;

    // @property(cc.Button)
    // public registerBtn: cc.Button = null;

    @property([cc.SpriteFrame])
    public headList: cc.SpriteFrame[] = [];

    onShow(): void {
        // this.loginBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickLogin, this);
        // this.registerBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickRegister, this);
        this.iconImg.node.on(cc.Node.EventType.TOUCH_END, this.onClickHeadIcon, this);
    }

    onHide():void{
        // this.loginBtn.node.off(cc.Node.EventType.TOUCH_END, this.onClickLogin, this);
        // this.registerBtn.node.off(cc.Node.EventType.TOUCH_END, this.onClickRegister, this);
        this.iconImg.node.off(cc.Node.EventType.TOUCH_END, this.onClickHeadIcon, this);

    }

    /**
     * 设置头像
     * @param index 
     */
    setIcon(index: number) {
        this.iconImg.spriteFrame = this.headList[index - 1];
    }

    /**
     * 设置昵称
     * @param name 
     */
    setNickname(name: string) {
        this.nickname.string = name;
    }

    @riggerIOC.inject(ShowLoginPanelSignal)
    private showLoginPanelSignal: ShowLoginPanelSignal;

    private onClickLogin(): void {
        this.showLoginPanelSignal.dispatch();
    }

    @riggerIOC.inject(ShowRegisterPanelSignal)
    private showRegisterPanelSignal: ShowRegisterPanelSignal;

    private onClickRegister(): void {
        this.showRegisterPanelSignal.dispatch();
    }

    @riggerIOC.inject(ShowPersonalCenterPanelSignal)
    private showPersonaCenterPanelSingal: ShowPersonalCenterPanelSignal;

    private onClickHeadIcon(): void {
        this.showPersonaCenterPanelSingal.dispatch();
    }

}
