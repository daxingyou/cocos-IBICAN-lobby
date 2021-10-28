import JPView from "../../../../libs/common/scripts/utils/JPView";
import { UserSysMail, SysMailProp, ErrResp, SysMailSummary } from "../../../protocol/protocols/protocols";
import UIUtils from "../../../../libs/common/scripts/utils/UIUtils";
import LobbyMailAwardsItem from "./LobbyMailAwardsItem";
import LobbyMailServer from "../server/LobbyMailServer";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import LobbyMailModel, { MailType } from "../model/LobbyMailModel";
import ShowLobbyMailAwardsPanelSignal from "../signals/showLobbyMailAwardsPanelSignal";
import LobbyMailReceiveMailPropSignal from "../signals/LobbyMailReceiveMailPropSignal";
import RedDotUtils from "../../../utils/redDot/RedDotUtils";
import LobbyMailPanel from "./LobbyMailPanel";
import LobbyToggleItem from "../model/LobbyToggleItem";


const { ccclass, property } = cc._decorator;


@ccclass
export default class LobbyMailDetailView extends JPView {

    @property(cc.Label)
    private mailTitle: cc.Label = null;

    // @property(cc.Label)
    // private mailSender: cc.Label = null;

    // @property(cc.Label)
    // private mailDate: cc.Label = null;

    @property(cc.RichText)
    private mailDesc: cc.RichText = null;

    @property(cc.Label)
    private lavNode: cc.Label = null;

    @property(cc.Node)
    private awardsNode: cc.Node = null;

    @property(cc.Button)
    private buttonGetAwards: cc.Button = null;

    @property(cc.Button)
    private buttonDelMail: cc.Button = null;

    @property(cc.Prefab)
    private awardsItemPrefab: cc.Prefab = null;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(LobbyMailModel)
    private model: LobbyMailModel;

    @riggerIOC.inject(LobbyMailServer)
    private mailServer: LobbyMailServer;

    @riggerIOC.inject(ShowLobbyMailAwardsPanelSignal)
    private showMailAwardsPanelSignal: ShowLobbyMailAwardsPanelSignal;

    @riggerIOC.inject(LobbyMailReceiveMailPropSignal)
    private receiveMailPropSignal: LobbyMailReceiveMailPropSignal;

    
    private readonly awardsPos: cc.Vec2[] = [new cc.Vec2(110, -156), new cc.Vec2(74, -156), new cc.Vec2(38, -156)];

    private mailId: number = 0;
    private toggInfo: LobbyToggleItem
    private mailInfo: UserSysMail


    public onShow() {
        super.onShow();
        this.buttonGetAwards.node.on("click", this.onTouchGetAwards, this);
        this.buttonDelMail.node.on("click", this.onTouchDelMail, this);
        this.receiveMailPropSignal.on(this, this.updateButtonState);
    }

    public onHide() {
        super.onHide();
        this.buttonGetAwards.node.off("click", this.onTouchGetAwards, this);
        this.buttonDelMail.node.off("click", this.onTouchDelMail, this);
        this.receiveMailPropSignal.off(this, this.updateButtonState);
    }

    public setDetail(mailInfo: UserSysMail) {
        this.mailTitle.string = mailInfo.mail.title;
        // this.mailSender.string = mailInfo.mail.sender;
        // this.mailDate.string = mailInfo.mail.sendTime;
        // this.mailDesc.string = this.formatStr(mailInfo.mail.content);
        this.lavNode.string = mailInfo.mail.content
        this.mailId = mailInfo.mailId;
        this.mailInfo = mailInfo
        this.awardsNode.removeAllChildren();
        let length: number = mailInfo.mail.props ? mailInfo.mail.props.length : 0;
        if (length > 0) {
            this.setAwardsList(mailInfo.mail.props,mailInfo.hasReceivedProps);
        }
        this.updateButtonState();
        // length = length > 0 ? length : 1;
        // this.awardsNode.setPosition(this.awardsPos[length - 1]);
        // this.awardsNode.width = 143 * length + (length - 1) * 10;
    }

    public setToggleItem(toggInfo: LobbyToggleItem) {
        this.toggInfo = toggInfo
    }

    private formatStr(str: string): string {
        str = str.replace(/\[/g, '<');
        str = str.replace(/\]/g, '>');
        return str;
    }

    private updateButtonState() {
        // let mailInfo: UserSysMail = this.model.getMailDetail(this.mailId);
        let mailInfo = this.mailInfo
        let length: number = mailInfo.mail.props ? mailInfo.mail.props.length : 0;
        let mailType = mailInfo.mail.mailType
        if (length > 0 && mailType == MailType.SystemAward && !mailInfo.hasReceivedProps) {
            this.buttonGetAwards.node.active = true;
            this.buttonDelMail.node.active = false;
        } else {
            this.buttonGetAwards.node.active = false;
            this.buttonDelMail.node.active = true;
        }
    }

    private setAwardsList(props: SysMailProp[],hasDraw: boolean) {
        props.forEach((prop: SysMailProp, idx) => {
            let awardsItem: cc.Node = UIUtils.instantiate(this.awardsItemPrefab);
            this.awardsNode.addChild(awardsItem);
            let award = awardsItem.getComponent(LobbyMailAwardsItem);
            award.setGoodsInfo(prop);
            award.setConirmAwards(hasDraw);
        })
    }

    private async onTouchGetAwards() {
        let mailInfo: SysMailSummary = this.model.getMailInfo(this.mailId);
        if (mailInfo.hasReceivedProps) {
            this.pushTipsQueueSignal.dispatch("物品已领取");
            return;
        }
        // this.showMailAwardsPanelSignal.dispatch(this.mailId);
        let task = this.mailServer.requestReceiveMailProp(this.mailId);
        let result = await task.wait();
        if (result.isFailed) {
            let reason = result.reason;
            if (reason instanceof ErrResp) {
                this.pushTipsQueueSignal.dispatch(reason.errMsg);
            }
            else {
                cc.log(reason);
            }
        } else {
            this.showMailAwardsPanelSignal.dispatch(this.mailId);
            RedDotUtils.updateRedDot(this.toggInfo.redPointName, 0);
            RedDotUtils.unRegistrRedDot(this.toggInfo.redPointName);
            this.updatePros()
        }
    }

    private updatePros(){
        this.awardsNode.children.forEach((child)=>{
            child.getComponent(LobbyMailAwardsItem).setConirmAwards(true)
        })
    }

    private async onTouchDelMail() {
        let mailInfo: UserSysMail = this.model.getMailDetail(this.mailId);
        if (mailInfo.mail.props && mailInfo.mail.props.length > 0 && !mailInfo.hasReceivedProps && mailInfo.mail.mailType == MailType.SystemAward) {
            this.pushTipsQueueSignal.dispatch("请先领取物品");
            return;
        }
        let task = this.mailServer.requestDeleteMail(this.mailId);
        let result = await task.wait();
        if(result.isFailed){
            let reason = result.reason;
            if(reason instanceof ErrResp) {
                this.pushTipsQueueSignal.dispatch(reason.errMsg);
            }
            else {
                cc.log(reason);
            }
        }
    }
}