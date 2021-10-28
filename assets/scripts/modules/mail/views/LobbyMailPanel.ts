import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LobbyMailDetailView from "./LobbyMailDetailView";
import { UserSysMail, ReceiveMailPropResp, DeleteSysMailResp,SysMailSummary, ErrResp } from "../../../protocol/protocols/protocols";
import LobbyMailModel, { MailType } from "../model/LobbyMailModel";
import LobbyMailToggleItem from "./LobbyMailToggleItem";
import UIUtils from "../../../../libs/common/scripts/utils/UIUtils";
import LobbyMailServer from "../server/LobbyMailServer";
import {ReceiveMailPropRespSignal, DeleteSysMailRespSignal, SysMailPushSignal } from "../../../protocol/signals/signals";
import LobbyMailReadMailSignal from "../signals/LobbyMailReadMailSignal";
import LobbyMailReceiveMailPropSignal from "../signals/LobbyMailReceiveMailPropSignal";
import LobbyMailDeleteMailSignal from "../signals/LobbyMailDeleteMailSignal";
import LobbyToggleItem from "../model/LobbyToggleItem";
import RedDotUtils from "../../../utils/redDot/RedDotUtils";
import RedDotNodeName from "../../../utils/redDot/RedDotNodeName";
import LobbyMailPushSignal from "../signals/LobbyMailPushSignal";

const { ccclass, property } = cc._decorator;


@ccclass
export default class LobbyMailPanel extends Panel {
    
    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property(cc.Node)
    private emptyMailView: cc.Node = null;

    @property(cc.Node)
    private mailContentView: cc.Node = null;

    @property(cc.ToggleContainer)
    private mailToggleContainer: cc.ToggleContainer = null;

    @property(cc.Node)
    private mailDetailViewNode: cc.Node = null;

    @property(cc.Node)
    private fisrstIntNode: cc.Node = null;

    @property(cc.Prefab)
    private toggleItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    private maskView: cc.Node = null;

    @property(cc.Node)
    private accessory: cc.Node = null;

    @property(cc.Node)
    private line: cc.Node = null;

    @riggerIOC.inject(LobbyMailModel)
    private model: LobbyMailModel;

    @riggerIOC.inject(LobbyMailServer)
    private mailServer: LobbyMailServer;

    @riggerIOC.inject(LobbyMailReadMailSignal)
    private readMailSignal: LobbyMailReadMailSignal;

    @riggerIOC.inject(LobbyMailReceiveMailPropSignal)
    private receiveMailPropSignal: LobbyMailReceiveMailPropSignal;

    @riggerIOC.inject(LobbyMailDeleteMailSignal)
    private deleteMailSignal: LobbyMailDeleteMailSignal;

    @riggerIOC.inject(LobbyMailPushSignal)
    private lobbyMailPushSignal: LobbyMailPushSignal;

    private toggleItemList: LobbyToggleItem[] = [];

    private currentToggle = null

    constructor() {
        super();
    }

   
    onShow() {
        super.onShow();
        this.initView();
        this.addEventListener();
        this.initToggle();
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
    }

    private initView(){
        let maillen = this.model.mailListLen
        if(this.model.isClear){
            // this.mailToggleContainer.node.removeAllChildren()
            // this.toggleItemList = []
            this.needCache = false
            this.model.isClear = false
        }else{
            this.needCache = true
        }
        this.currentToggle = null
        if (maillen > 0) {
            this.emptyMailView.active = false;
            this.mailContentView.active = true;
            this.mailDetailViewNode.active = false;
            this.fisrstIntNode.active = true;
        }else{
            this.emptyMailView.active = true;
            this.mailContentView.active = false;
        }
    }


    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.receiveMailPropSignal.on(this, this.onReceiveMailProp);
        this.deleteMailSignal.on(this, this.onDeleteMail);
        this.readMailSignal.on(this, this.onReadMail);
        this.lobbyMailPushSignal.on(this,this.addToggNode)
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick);
        this.receiveMailPropSignal.off(this, this.onReceiveMailProp);
        this.deleteMailSignal.off(this, this.onDeleteMail);
        this.readMailSignal.off(this, this.onReadMail);
        this.lobbyMailPushSignal.off(this,this.addToggNode);

    }

    private initToggle() {
        let mailList: SysMailSummary[] = this.model.mailList
        mailList.forEach((info: SysMailSummary, idx) => {
            let toggleInfo: LobbyToggleItem = this.getToggleItem(idx+1);
            let mailItem: LobbyMailToggleItem = toggleInfo.toggleNode.getComponent(LobbyMailToggleItem);
            mailItem.setItem(info);  
            // if (idx === 0 ) {
            //     this.onCheckToggle(info.mailId)
            // }
            if(toggleInfo.mailId != info.mailId){
                toggleInfo.toggleNode.off('toggle')
                toggleInfo.mailId = info.mailId;
                toggleInfo.redPointName = `mailToggle${info.mailId}`;
                toggleInfo.toggleNode.on('toggle', this.onCheckToggle.bind(this, toggleInfo), this);
                if(info.mailType == MailType.SystemAward){
                    !info.hasReceivedProps && RedDotUtils.registrRedDot(toggleInfo.redPointName, RedDotNodeName.TOP_NODE_MAIL,1)
                }else{
                    !info.hasRead && RedDotUtils.registrRedDot(toggleInfo.redPointName, RedDotNodeName.TOP_NODE_MAIL, 1);
                }
            }
        });
        
        let toggleItem: LobbyToggleItem = this.getToggleItem(0);
        toggleItem.toggleNode.getComponent(cc.Toggle).check();
        toggleItem.toggleNode.getComponent(LobbyMailToggleItem).setFontColor();
        toggleItem.mailId = null;
        toggleItem.toggleNode.active = false; 
    }

    
    private addToggNode(){
        let len = this.toggleItemList.length
        if(len <= 1){
            !this.toggleItemList[0].mailId && this.initView();
        }
        this.initToggle()
        if(this.currentToggle != null){
            for (let index = 0; index < this.toggleItemList.length; index++) {
                let toggleItem: LobbyToggleItem = this.toggleItemList[index];
                if (toggleItem.mailId === this.currentToggle) {
                    toggleItem.toggleNode.getComponent(cc.Toggle).check();
                    break;
                }
            }
        }
    }

    private async onCheckToggle(toggleInfo: LobbyToggleItem){
        this.mailDetailViewNode.active = true;
        this.fisrstIntNode.active = false;
        // toggleInfo.toggleNode.getComponent(LobbyMailToggleItem).setFontColor()
        this.currentToggle = toggleInfo.mailId
        let data: UserSysMail;
        if(this.model.hasMailDetai(toggleInfo.mailId)){
            data = this.model.getMailDetail(toggleInfo.mailId)
        }
        if(!data) {
           let task = this.mailServer.requestReadMail(toggleInfo.mailId);
           let result = await task.wait();      
            if(result.isFailed){
                let reason = result.reason;
                if(reason instanceof ErrResp) {
                    // this.pushTipsQueueSignal.dispatch(reason.errMsg);
                }
                else {
                    cc.log(reason);
                }
            }else{
                data = result.result.userSysMail
            }
        }
        if(!data) return 
        this.mailDetailViewNode.getComponent(LobbyMailDetailView).setDetail(data);
        this.setDevatilView(data);
        // this.mailServer.requestReadMail(toggleInfo.mailId);
        if(data.mail.mailType == MailType.SystemAward){
            this.mailDetailViewNode.getComponent(LobbyMailDetailView).setToggleItem(toggleInfo)
        }else{
            RedDotUtils.updateRedDot(toggleInfo.redPointName, 0);
            RedDotUtils.unRegistrRedDot(toggleInfo.redPointName);
        }
    }

    setDevatilView(mailInfo: UserSysMail){
        let length: number = mailInfo.mail.props ? mailInfo.mail.props.length : 0;
        this.maskView.height = length > 0 ? 280 : 410;
        this.accessory.active = length > 0 ;
        let lineWidget = this.line.getComponent(cc.Widget);
        lineWidget.bottom = 0;
        lineWidget.updateAlignment();
    }

    private onReadMail(mailId: number){
        // this.initToggle();
        let data: SysMailSummary = this.model.getMailInfo(mailId);
        let toggleItem: LobbyToggleItem = this.getToggleItemByMailId(mailId);
        if (toggleItem){
            toggleItem.toggleNode.getComponent(LobbyMailToggleItem).setItem(data);
        }
        // this.updateToggle(mailId)
    }

    updateToggle(mailId: number){
        let mailList: SysMailSummary[] = this.model.mailList;
        mailList.forEach((info: SysMailSummary, idx) => {
            let toggleInfo: LobbyToggleItem = this.getToggleItem(idx+1);
            let mailItem: LobbyMailToggleItem = toggleInfo.toggleNode.getComponent(LobbyMailToggleItem);
            mailItem.setItem(info);  
            if(toggleInfo.mailId != info.mailId){
                toggleInfo.toggleNode.off('toggle')
                toggleInfo.mailId = info.mailId;
                toggleInfo.redPointName = `mailToggle${info.mailId}`;
                toggleInfo.toggleNode.on('toggle', this.onCheckToggle.bind(this, toggleInfo), this);
            }
        });

        let toggleItem: LobbyToggleItem = this.getToggleItemByMailId(mailId);
        toggleItem.toggleNode.getComponent(cc.Toggle).check();
    }

    private onDeleteMail(mailId: number){
        if(!mailId) {
            cc.log(`mailId err`);
            return;
        }
        
        let tempIndex: number = 0;
        for (let index = 0; index < this.toggleItemList.length; index++) {
            let toggleItem: LobbyToggleItem = this.toggleItemList[index];
            if (toggleItem.mailId === mailId) {
                toggleItem.toggleNode.off('toggle', this.onCheckToggle.bind(this, toggleItem), this);
                toggleItem.toggleNode.removeFromParent(); 
                this.toggleItemList.splice(index, 1);
                tempIndex = index;
                break;
            }
        }
        tempIndex = this.toggleItemList.length - 1 > tempIndex ? tempIndex : this.toggleItemList.length -1;
        if (this.toggleItemList.length > 1 ){
            let toggleItem: LobbyToggleItem = this.getToggleItem(1);
            toggleItem.toggleNode.getComponent(cc.Toggle).check();
            this.onCheckToggle(toggleItem);
        }else{
            !this.toggleItemList[0].mailId && this.initView();
        } 
    }

    private onReceiveMailProp(mailId: number){
        let data: SysMailSummary = this.model.getMailInfo(mailId);
        let toggleItem: LobbyToggleItem = this.getToggleItemByMailId(mailId);
        if (toggleItem){
            toggleItem.toggleNode.getComponent(LobbyMailToggleItem).setItem(data);
        }
    }
    
    private getToggleItem(index: number): LobbyToggleItem {
        let toggleItem: LobbyToggleItem = this.toggleItemList[index];
        this.mailToggleContainer.node.setPosition(0,0)
        if (! toggleItem) {
            let toggleNode = UIUtils.instantiate(this.toggleItemPrefab);
            this.mailToggleContainer.node.addChild(toggleNode);
            toggleItem = new LobbyToggleItem(toggleNode, index);
            this.toggleItemList[index] = toggleItem;
        }
        return toggleItem;
    }

    private getToggleItemByMailId(mailId: number): LobbyToggleItem{
        let toggleItem: LobbyToggleItem = null;
        for (let index = 0; index < this.toggleItemList.length; index++) {
            let data = this.toggleItemList[index];
            if (data.mailId === mailId) {
                toggleItem = data;
                break;
            }
        }
        return toggleItem;
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
    }


    /**关闭按钮 */
    private onCloseBtnClick() {
        this.closeWindow();
    }

}