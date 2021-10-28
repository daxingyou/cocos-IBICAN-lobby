import { SysMailSummary, UserSysMail, ErrResp } from "../../../protocol/protocols/protocols";
import RedDotUtils from "../../../utils/redDot/RedDotUtils";
import RedDotNodeName from "../../../utils/redDot/RedDotNodeName";
import LobbyMailServer from "../server/LobbyMailServer";

/**邮件model */
export default class LobbyMailModel extends riggerIOC.Model {
    private _curReceiveAmount: number = 0;
    private _mailList: SysMailSummary[] = [];
    private _mailDetail: UserSysMail[] = [];
    /**是否清除邮件列表*/
    private _isClear: boolean = false;

    constructor() {
        super();
    }

    public set receiveAmount(awardsNumber: number) {
        this._curReceiveAmount = awardsNumber;
    }

    public get receiveAmount(): number {
        return this._curReceiveAmount;
    }

    public set isClear(v: boolean) {
        this._isClear = v;
    }

    public get isClear():boolean {
        return this._isClear;
    }

    public set mailList(list: SysMailSummary[]) {
        this._mailList = list;
    }

    public get mailList(): SysMailSummary[] {
        return this._mailList.sort(this.sortMail);
    }
    
    public get mailListLen(): number {
        return this._mailList.length;
    }

    public set mailDetail(detail: UserSysMail[]) {
        this._mailDetail = detail;
    }

    public get mailDetail(): UserSysMail[] {
        return this._mailDetail;
    }

    private sortMail(a:SysMailSummary,b:SysMailSummary){
        if(a.hasRead && b.hasRead){
            if(a.mailType == 2 && !a.hasReceivedProps){
                return -1
            }
            else if(b.mailType == 2 && !b.hasReceivedProps){
                return 1
            }else{
                return b.mailId - a.mailId
            }
        }

        if(!a.hasRead && !b.hasRead){
            return b.mailId - a.mailId
        }
        
        if(a.hasRead && !b.hasRead){
            return 1
        }

        if(!a.hasRead && b.hasRead){
            return -1
        }
    }

    public getMailInfo(mailId: number): SysMailSummary {
        let mailList = this._mailList
        let mailInfo: SysMailSummary = null;
        mailList.forEach((info)=>{
            if(info.mailId === mailId){
                mailInfo = info
                return
            }
        })
        return mailInfo;
    }

    public getMailDetail(mailId: number):UserSysMail{
        let mailDetail:UserSysMail = null
        if(this._mailDetail.length > 0){
            for (let index = 0; index < this._mailDetail.length; index++) {
                let data = this._mailDetail[index];
                if (data.mailId === mailId) {
                    mailDetail = data;
                    break;
                }
            }
            return mailDetail;
        }
    }

    public hasMailDetai(mailId: number):Boolean{
        let has = false
        this._mailDetail.forEach((detail)=>{
            if(detail.mailId == mailId){
                has = true
                return 
            }
        })
        return has 
    }

    public readMail(mailId: number) {
        let mailList = this._mailList
        for (let index = 0; index < mailList.length; index++) {
            let data = mailList[index];
            if (data.mailId === mailId) {
                data.hasRead = true;
                break;
            }
        }

        for (let index = 0; index < this._mailDetail.length; index++) {
            let data = this._mailDetail[index];
            if (data.mailId === mailId) {
                data.hasRead = true;
                break;
            }
        }
    }

    public receiveMailProp(mailId: number) {
        let mailList = this._mailList
        for (let index = 0; index < mailList.length; index++) {
            let data = mailList[index];
            if (data.mailId === mailId) {
                data.hasReceivedProps = true;
                break;
            }
        }

        for (let index = 0; index < this._mailDetail.length; index++) {
            let data = this._mailDetail[index];
            if (data.mailId === mailId) {
                data.hasReceivedProps = true;
                break;
            }
        }
    }

    public deleteMail(mailId: number) {
        let mailList = this._mailList
        for (let index = 0; index < mailList.length; index++) {
            let data = mailList[index];
            if (data.mailId === mailId) {
                this._mailList.splice(index, 1);
                break;
            }
        }

        for (let index = 0; index < this._mailDetail.length; index++) {
            let data = this._mailDetail[index];
            if (data.mailId === mailId) {
                this._mailDetail.splice(index, 1);
                break;
            }
        }
        
    }

    public checkRedPoint() {
        let unRedNum: number = 0;
        let mailList = this._mailList
        for (let index = 0; index < mailList.length; index++) {
            let data = mailList[index];
            if (data.mailType == 2) {
                if(!data.hasReceivedProps) unRedNum++;
            }else{
                if(!data.hasRead) unRedNum++;
            }
        }
        RedDotUtils.updateRedDot(RedDotNodeName.TOP_NODE_MAIL, unRedNum);
    }
}

export enum MailType {
    SystemMsg = 1,     //系统消息
    SystemAward = 2,   //系统奖励 
    SystemDel = 3      //系统扣除
}