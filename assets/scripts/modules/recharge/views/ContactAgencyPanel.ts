import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import ServicePanel from "../../service/ServicePanel";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import NativeUtils from "../../../../libs/native/NativeUtils";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import { RechargeAgentPushSignal } from "../../../protocol/signals/signals";
import { RechargeAgentPush, ReceiveRegAmountReq } from "../../../protocol/protocols/protocols";

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
export default class ContactAgencyPanel extends Panel {

    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property(cc.Button)
    public copyBtn: cc.Button = null;

    @property(cc.Button)
    public complainBtn: cc.Button = null;

    @property(cc.Label)
    public agencyContactAccount: cc.Label = null;

    @property(cc.Label)
    public agencyName: cc.Label = null;

    @property(cc.Sprite)
    public agencyTypeIcon: cc.Sprite = null;

    @property([cc.SpriteFrame])
    public typeSpriteFrames: cc.SpriteFrame[] = [];

    @riggerIOC.inject(PushTipsQueueSignal)
    public pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(RechargeAgentPushSignal)
    private rechargeAgentPushSignal: RechargeAgentPushSignal;

    constructor() {
        super();
    }

    private agencyId: number;
    private agencyContactType: number; //联系方式 （1.微信 2.QQ 3.支付宝）
    onExtra([agencyId, agencyName, agencyContactType, agencyContactAccount]: [number, string, number, string]) {
        this.agencyId = agencyId;
        this.agencyName.string = agencyName;
        this.agencyContactAccount.string = agencyContactAccount;
        this.agencyTypeIcon.spriteFrame = this.typeSpriteFrames[agencyContactType - 1];
        this.agencyContactType = agencyContactType;
    }

    onShow() {
        this.addEventListener();
        this.addProtocolListener();
    }

    onHide() {
        this.removeEventListener();
        this.removeProtocolListener();
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.copyBtn.node.on('click', this.onCopyBtnClick, this);
        this.complainBtn.node.on('click', this.onComplainBtnClick, this);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick, this);
        this.copyBtn.node.off('click', this.onCopyBtnClick, this);
        this.complainBtn.node.off('click', this.onComplainBtnClick, this);
    }

    addProtocolListener() {
        this.rechargeAgentPushSignal.on(this, this.onRechargeAgentPush);
    }

    removeProtocolListener() {
        this.rechargeAgentPushSignal.off(this, this.onRechargeAgentPush);
    }

    private isvalied: boolean = true;
    private onRechargeAgentPush(resp: RechargeAgentPush) {
        this.isvalied = false;
        let agencyData = resp.rechargeAgentItems;
        if(agencyData) {
            for(let i = 0; i < agencyData.length; i++) {
                if(agencyData[i].agentUid == this.agencyId) this.isvalied = true;
            }
        }
    }

    private onCloseBtnClick() {
        this.closeWindow();
    }

    /**
     * 复制账号并打开对应App
     */
    private onCopyBtnClick() {
        if(!this.isvalied) {
            this.pushTipsQueueSignal.dispatch('该代理已下架,请您联系其他代理');
            this.closeWindow();
            return;
        }
        let copyResult = NativeUtils.copy(this.agencyContactAccount.string);
        if(copyResult) {
            // copy succeed
            let jumpAPPResult = NativeUtils.jumpApp(this.agencyContactType);
            if(!jumpAPPResult) {
                let appName: string = ['微信', 'QQ', '支付宝'][this.agencyContactType - 1];
                this.pushTipsQueueSignal.dispatch(`账号已复制,跳转${appName}失败,请检查是否下载${appName}`);
            }
        }
        else {
            //copy failed
            this.pushTipsQueueSignal.dispatch('复制失败,请手动复制对应账号!');
        }
    }

    private onComplainBtnClick() {
        UIManager.instance.showPanel(ServicePanel, LayerManager.uiLayerName, true);
    }
}
