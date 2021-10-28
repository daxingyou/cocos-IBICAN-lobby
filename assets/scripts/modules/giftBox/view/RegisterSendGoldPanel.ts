import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import Panel from "../../../../libs/common/scripts/utils/Panel";
import GiftBoxServer from "../servers/GiftBoxServer";
import { ErrResp } from "../../../protocol/protocols/protocols";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import OnUserInfoUpdateSignal from "../../../../libs/common/scripts/modules/user/signals/OnUserInfoUpdateSignal";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import GiftBoxModel from "../models/GiftBoxModel";
import GiftBoxType from "../models/GiftBoxType";
//注册送金
const {ccclass, property} = cc._decorator;
@ccclass
export default class RegisterSendGoldPanel extends Panel {
    @property(cc.Button)
    public getBtn: cc.Button = null;

    @riggerIOC.inject(GiftBoxServer)
    private giftBoxServer: GiftBoxServer;
    
    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;
    
    @riggerIOC.inject(OnUserInfoUpdateSignal)
    protected onUserInfoUpdateSignal: OnUserInfoUpdateSignal;

    @riggerIOC.inject(PushTipsQueueSignal)
    public pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(GiftBoxModel)
    private giftBoxModel: GiftBoxModel;

    // @property(cc.Node)
    // public box:cc.Node = null;

    private isClick:boolean = true;
    constructor() {
        super();
    }

    onInit() {
        super.onInit();
    }

    onShow() {
        super.onShow();
        this.addEventListener();
        this.getBtn.node.active = true;
        this.isClick = true;
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
       this.getBtn.node.on('click', this.getHandle, this);
    }

    removeEventListener() {
        this.getBtn.node.off('click', this.getHandle, this);
    }

    private async getHandle()
    {
        if(!this.isClick)return;
        this.isClick = false;
        let task = this.giftBoxServer.receiveRegAmount();
        let result = await task.wait();
        if(result.isOk) 
        {
            this.getBtn.node.active = false;
            //this.box.active = false;
            //this.box.scale = 0;
            // this.lobbyUserModel.self.balance += result.amount / 100;
            // this.onUserInfoUpdateSignal.dispatch();
            this.giftBoxModel.getOperationalActivityInfoByCode(GiftBoxType.REGISTER).finish = true;
            this.pushTipsQueueSignal.dispatch('奖励已发送到您的账号');
            this.closeWindow();
        }
        else 
        {
            let reason = result.reason;
            if(reason instanceof ErrResp) {
                this.pushTipsQueueSignal.dispatch(reason.errMsg);
                this.closeWindow();
            }
            this.isClick = true;
        }
        
    }
}
