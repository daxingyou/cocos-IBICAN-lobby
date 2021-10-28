import JPView from "../../../../libs/common/scripts/utils/JPView";
import JPSprite from "../../../../libs/common/scripts/utils/JPSprite";
import ShowLoginPanelSignal from "../../../../libs/common/scripts/modules/login/signals/ShowLoginPanelSignal";
import ShowRegisterPanelSignal from "../../../../libs/common/scripts/modules/login/signals/ShowRegisterPanelSignal";
import ShowPersonalCenterPanelSignal from "../../user/signals/ShowPersonalCenterPanelSingal";
import UserBriefView from "../../lobby/views/UserBriefView";

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
export default class PopularizeUserBriefView extends JPView {
    @property(JPSprite)
    public avatar: JPSprite = null;

    @property(cc.Label)
    public nickname: cc.Label = null;

    @property(cc.Label)
    public vipLevel: cc.Label = null;

    @property([cc.SpriteFrame])
    public headList: cc.SpriteFrame[] = [];

    onShow(): void {
        super.onShow();
        this.avatar.node.on(cc.Node.EventType.TOUCH_END, this.onClickHeadIcon, this);
    }

    onHide():void{
        super.onHide();
        this.avatar.node.off(cc.Node.EventType.TOUCH_END, this.onClickHeadIcon, this);
    }

    onInit() {
        super.onInit();
    }

    onDispose() {
        super.onDispose();
    }

    /**
     * 设置头像
     * @param index 
     */
    setAvatar(index: number) {
        this.avatar.spriteFrame = this.headList[index - 1];
    }

    /**
     * 设置VIP等级
     * @param vipLevel 
     */
    setVipLevel(vipLevel: number) {
        this.vipLevel.string = vipLevel + "";
    }

    /**
     * 设置昵称
     * @param name 
     */
    setNickname(name: string) {
        this.nickname.string = name;
    }


    @riggerIOC.inject(ShowPersonalCenterPanelSignal)
    private showPersonaCenterPanelSingal: ShowPersonalCenterPanelSignal;

    private onClickHeadIcon(): void {
        this.showPersonaCenterPanelSingal.dispatch();
    }

}
