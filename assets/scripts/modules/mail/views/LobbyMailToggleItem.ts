import JPView from "../../../../libs/common/scripts/utils/JPView";
import { UserSysMail, SysMailSummary } from "../../../protocol/protocols/protocols";
import { MailType } from "../model/LobbyMailModel";
import LobbyToggleItem from "../model/LobbyToggleItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyMailToggleItem extends JPView{
    @property(cc.Sprite)
    private mailstateSprite: cc.Sprite = null;

    @property(cc.Node)
    private mailRedPoint: cc.Node = null;

    @property(cc.Label)
    private mailDate: cc.Label = null;

    @property(cc.Label)
    private mailTitle: cc.Label = null;

    @property(cc.Label)
    private mailSender: cc.Label = null;

    @property(cc.SpriteFrame)
    private mailStateSpriteFrame: cc.SpriteFrame[] = [];

    constructor(){
        super();
        
    }

    public setItem(info: SysMailSummary) {
        let hasRedPoint: boolean;
        if(info.mailType == MailType.SystemAward){
            hasRedPoint = !info.hasReceivedProps
        }else{
            hasRedPoint = !info.hasRead
        }
        this.mailRedPoint.active = hasRedPoint;
        this.mailTitle.string = this.substringName(info.title);  
        this.mailDate.string = this.timeChange(info.sendTime);
        this.mailSender.string = '发件人：'+info.sender
        let mailType = info.mailType
        let hasRecive = info.hasReceivedProps
        this.mailstateSprite.spriteFrame = this.getStateSpriteFrame(info.hasRead,hasRecive,mailType);
    }

    setFontColor(){
        this.node.parent.children.forEach((child)=>{
            if(child === this.node){
                this.mailTitle.node.color = cc.color(196,23,0)
                this.mailDate.node.color = cc.color(119,1,37)
                this.mailSender.node.color = cc.color(58,31,8)
            }else{
                child.getComponent(LobbyMailToggleItem).mailTitle.node.color = cc.color(204,203,203)
                child.getComponent(LobbyMailToggleItem).mailDate.node.color = cc.color(168,157,126)
                child.getComponent(LobbyMailToggleItem).mailSender.node.color = cc.color(165,179,147)
            }
        })
    }

    private getStateSpriteFrame(hasRead: boolean, hasRecive:boolean,mailType:number): cc.SpriteFrame{
        //0 未读邮件
        //1 已读邮件
        //2 未读礼物邮件
        //3 已读礼物邮件
        //mailtype  1系统消息  2系统奖励  3系统扣除
        
        let stateKey: number = 0;
        if(hasRead){
            stateKey = (mailType == MailType.SystemAward && hasRecive) ? 3 : 2 
            if(mailType == MailType.SystemAward){
                stateKey = hasRecive ? 3 : 2
            }else{
                stateKey = 1
            }         
        }else{
            stateKey = mailType == MailType.SystemAward ? 2 : 0
        }
        return this.mailStateSpriteFrame[stateKey];
    }

    public substringName(str) {
        let max = 6;
        if (str.length > max) {
            let temp = str;
            str = "";
            let len = 0;
            for (let i = 0; i < temp.length; i++) {
                if (temp.charCodeAt(i) > 127 || temp.charCodeAt(i) == 94) {
                    len++;
                }else{
                    len+= 0.5
                }
                str += temp[i];
                if(i == temp.length -1 && len == 4.5) break;
                if (len > max - 2) {
                    str += "...";
                    break;
                }
            }
            
        }
        return str;
    }

    public timeChange(sendTime:string){
        let newtime = sendTime.slice(0,-3)
        return newtime
    }
} 