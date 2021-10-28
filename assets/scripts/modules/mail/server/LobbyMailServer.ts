import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import { UserSysMailListRespSignal, ReceiveMailPropRespSignal, DeleteSysMailRespSignal, SysMailPushSignal, SysMailDetailRespSignal } from "../../../protocol/signals/signals";
import CommandCodes from "../../../protocol/CommandCodes";
import { UserSysMailListResp, UserSysMailListReq , ReceiveMailPropResp, DeleteSysMailResp, ReceiveMailPropReq, DeleteSysMailReq, ErrResp, UserSysMail, SysMail, SysMailProp, SysMailPush, SysMailDetailResp, SysMailDetailReq, SysMailSummary } from "../../../protocol/protocols/protocols";
import LobbyMailModel from "../model/LobbyMailModel";
import OnLoginSuccessSignal from "../../../../libs/common/scripts/modules/login/signals/OnLoginSuccessSignal";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import LobbyMailUpdateRedPointSignal from "../signals/LobbyMailUpdateRedPointSignal";
import LobbyMailDeleteMailSignal from "../signals/LobbyMailDeleteMailSignal";
import LobbyMailReadMailSignal from "../signals/LobbyMailReadMailSignal";
import LobbyMailReceiveMailPropSignal from "../signals/LobbyMailReceiveMailPropSignal";
import LobbyMailPushSignal from "../signals/LobbyMailPushSignal";

/**邮件服务 */
export default class LobbyMailServer extends riggerIOC.Server {

    @riggerIOC.inject(LobbyMailModel)
    private model: LobbyMailModel;

    @riggerIOC.inject(UserSysMailListRespSignal)
    private userSysMailListRespSignal: UserSysMailListRespSignal;

    @riggerIOC.inject(ProtocolTask)
    private requestMailListTask: ProtocolTask<UserSysMailListResp>;

    @riggerIOC.inject(SysMailDetailRespSignal)
    private sysMailDetailRespSignal: SysMailDetailRespSignal;

    @riggerIOC.inject(ProtocolTask)
    private readSysMailTask: ProtocolTask<SysMailDetailResp>;

    @riggerIOC.inject(ReceiveMailPropRespSignal)
    private receiveMailPropRespSignal: ReceiveMailPropRespSignal;

    @riggerIOC.inject(ProtocolTask)
    private receiveMailPropTask: ProtocolTask<ReceiveMailPropResp>;

    @riggerIOC.inject(DeleteSysMailRespSignal)
    private deleteSysMailRespSignal: DeleteSysMailRespSignal;

    @riggerIOC.inject(ProtocolTask)
    private deleteSysMailTask: ProtocolTask<DeleteSysMailResp>;

    @riggerIOC.inject(OnLoginSuccessSignal)
    private loginSuccessSignal: OnLoginSuccessSignal;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(LobbyMailUpdateRedPointSignal)
    private udpateRedPointSignal: LobbyMailUpdateRedPointSignal;

    @riggerIOC.inject(LobbyMailDeleteMailSignal)
    private deleteMailSignal: LobbyMailDeleteMailSignal;

    @riggerIOC.inject(LobbyMailReadMailSignal)
    private readMailSignal: LobbyMailReadMailSignal;

    @riggerIOC.inject(LobbyMailReceiveMailPropSignal)
    private receiveMailPropSignal: LobbyMailReceiveMailPropSignal;

    @riggerIOC.inject(SysMailPushSignal)
    private sysMailPushSignal: SysMailPushSignal;

    @riggerIOC.inject(LobbyMailPushSignal)
    private lobbyMailPushSignal: LobbyMailPushSignal;

    constructor() {
        super();

        this.requestMailListTask.init(CommandCodes.PPUserSysMailListReq, UserSysMailListRespSignal)
        this.userSysMailListRespSignal.on(this, this.onGetMailList);
        

        this.readSysMailTask.init(CommandCodes.PPSysMailDetailReq, SysMailDetailRespSignal)
        // this.sysMailDetailRespSignal.on(this, this.onReadMail);

        this.receiveMailPropTask.init(CommandCodes.PPReceiveMailPropReq, ReceiveMailPropRespSignal)
        this.receiveMailPropRespSignal.on(this, this.onReceiveMailProp);
        // this.deleteSysMailRespSignal.on(this, this.onDeleteMail);
        this.sysMailDetailRespSignal.on(this, this.onReadMail);

        this.deleteSysMailTask.init(CommandCodes.PPDeleteSysMailReq, DeleteSysMailRespSignal)
        this.deleteSysMailRespSignal.on(this, this.onDeleteMail);

        this.loginSuccessSignal.on(this, this.onLoginSuccess);
        this.sysMailPushSignal.on(this,this.sysMailPush);
    }
    
    dispose(): void {
        this.userSysMailListRespSignal.off(this, this.onGetMailList);
        this.sysMailDetailRespSignal.off(this, this.onReadMail);
        this.receiveMailPropRespSignal.off(this, this.onReceiveMailProp);
        // this.deleteSysMailRespSignal.off(this, this.onDeleteMail);
        // this.readSysMailRespSignal.off(this, this.onReadMail);
        this.deleteSysMailRespSignal.off(this, this.onDeleteMail);

        this.loginSuccessSignal.off(this, this.onLoginSuccess);
        this.sysMailPushSignal.off(this,this.sysMailPush);

        super.dispose();
    }

    private async onLoginSuccess() {
        this.model.isClear = true
        this.model.mailDetail = []
        let task = this.requestMailList();
        let result = await task.wait();      
        if(result.isFailed){
            let reason = result.reason;
            if(reason instanceof ErrResp) {
                // this.pushTipsQueueSignal.dispatch(reason.errMsg);
            }
            else {
                cc.log(reason);
            }
        }
    }

    /**系统邮件推送 */
    public async sysMailPush(resp: SysMailPush) {
        this.model.mailList = this.model.mailList.concat(resp.mail)
        this.model.checkRedPoint();
        this.lobbyMailPushSignal.dispatch()
    }


    /**请求邮件列表 */
    public requestMailList(): ProtocolTask<UserSysMailListResp> {
        if(this.requestMailListTask.isWaitting()) return this.requestMailListTask;
        this.requestMailListTask.prepare();

        let req: UserSysMailListReq = new UserSysMailListReq();
        this.requestMailListTask.start(req);

        return this.requestMailListTask;
    }

    private onGetMailList(result: UserSysMailListResp) {
        this.model.mailList = result.list;
        //更新红点状态
        this.model.checkRedPoint();
        // this.udpateRedPointSignal.dispatch(hasRedPoint);
    }

    /**请求更改邮件阅读状态 */
    public requestReadMail(mailId: number): ProtocolTask<SysMailDetailResp> {

        if(this.readSysMailTask.isWaitting()) return this.readSysMailTask;
        this.readSysMailTask.prepare();

        let req: SysMailDetailReq = new SysMailDetailReq();
        req.mailId = mailId;
        this.readSysMailTask.start(req);
        return this.readSysMailTask;
    }

    private onReadMail(result: SysMailDetailResp){
        this.model.readMail(result.userSysMail.mailId);
        this.model.mailDetail.push(result.userSysMail)
        //更新红点状态
        // let hasRedPoint: boolean = this.model.checkRedPoint();
        // this.udpateRedPointSignal.dispatch(hasRedPoint);
        this.readMailSignal.dispatch(result.userSysMail.mailId);
    }

    /**请求领取邮件附件物品 */
    public requestReceiveMailProp(mailId: number): ProtocolTask<ReceiveMailPropResp> {
        // let result: ReceiveMailPropResp = new ReceiveMailPropResp();
        // result.mailId = mailId;
        // this.onReceiveMailProp(result)
        // return;
        if(this.receiveMailPropTask.isWaitting()) return this.receiveMailPropTask;
        this.receiveMailPropTask.prepare();

        let req: ReceiveMailPropReq = new ReceiveMailPropReq();
        req.mailId = mailId;
        this.receiveMailPropTask.start(req);
        return this.receiveMailPropTask;
    }

    private onReceiveMailProp(result: ReceiveMailPropResp){
        this.model.receiveMailProp(result.mailId);
        this.receiveMailPropSignal.dispatch(result.mailId)
    }



    /**请求删除邮件 */
    public requestDeleteMail(mailId: number): ProtocolTask<DeleteSysMailResp> {
        if(this.deleteSysMailTask.isWaitting()) return this.deleteSysMailTask;

        this.deleteSysMailTask.prepare();
        // let result: DeleteSysMailResp = new DeleteSysMailResp();
        // result.mailId = mailId;
        // this.onDeleteMail(result)
        // return;
        let req: DeleteSysMailReq = new DeleteSysMailReq();
        req.mailId = mailId;
        this.deleteSysMailTask.start(req);
        return this.deleteSysMailTask;
    }

    private onDeleteMail(result: DeleteSysMailResp){
        this.model.deleteMail(result.mailId);
        this.deleteMailSignal.dispatch(result.mailId)
    }
}