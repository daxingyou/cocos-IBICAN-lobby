import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import ServicePanel from "../../service/ServicePanel";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import { RechargeOrder } from "../../../protocol/protocols/protocols";

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
export default class RechargeDetailsPanel extends Panel {
    @property([cc.SpriteFrame])
    private statusSigns: cc.SpriteFrame[] = [];

    @property(cc.Label)
    private statusTxt: cc.Label = null;

    @property(cc.Sprite)
    private statusSign: cc.Sprite = null;

    @property(cc.Label)
    private rechargeCoinTxt: cc.Label = null;

    @property(cc.Label)
    private presenterCoinTxt: cc.Label = null;

    @property(cc.Label)
    private payTypeTxt: cc.Label = null;

    @property(cc.Label)
    private orderIdTxt: cc.Label = null;

    @property(cc.Label)
    private orderTimeTxt: cc.Label = null;

    @property(cc.Button)
    private closeBtn: cc.Button = null;

    @property(cc.Button)
    private customerBtn: cc.Button = null;
    
    constructor() {
        super();
    }

    onShow() {
        this.addEventListener();
    }

    onHide() {
        this.removeEventListener();
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.customerBtn.node.on('click', this.onCustomerBtnClick, this);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick, this);
        this.customerBtn.node.off('click', this.onCustomerBtnClick, this);
    }

    onExtra(order: RechargeOrder) {
        if(order) {
            this.updateView(order);
        }
    }

    updateView(order: RechargeOrder) {
        this.rechargeCoinTxt.string = '+' + order.rechargeAmount / 100 + '';
        this.presenterCoinTxt.string = '+' + order.giftAmount / 100 + '';
        this.payTypeTxt.string = order.payFlag;
        this.orderIdTxt.string = order.orderNo;
        this.orderTimeTxt.string = order.createTime.replace(/-/g, '/');
        this.updateStatus(order.status);
    }

    updateStatus(status: number) {
        let spriteFrame: cc.SpriteFrame;
        let color: cc.Color;
        let str: string;
        switch(status) {
            case orderStatusType.waitForPay:
                color = new cc.Color(236, 106, 0);
                spriteFrame = this.statusSigns[orderStatusType.waitForPay - 1];
                str = '等待中';
                break;
            case orderStatusType.succeed:
                color = new cc.Color().fromHEX('#019E61');
                spriteFrame = this.statusSigns[orderStatusType.succeed - 1];
                str = '充值成功';
                break;
            case orderStatusType.failed:
                color = new cc.Color(231, 0, 0);
                spriteFrame = this.statusSigns[orderStatusType.failed - 1];
                str = '充值失败';
                break;
            case orderStatusType.cancel:
                color = new cc.Color(231, 0, 0);
                spriteFrame = this.statusSigns[orderStatusType.failed - 1];
                str = '未支付';
                break;
            default:
                break;
        }
        this.statusTxt.node.color = color;
        this.statusTxt.string = str;
        this.statusSign.spriteFrame = spriteFrame;
    }

    private onCloseBtnClick() {
        this.closeWindow();
    }

    private onCustomerBtnClick() {
        UIManager.instance.showPanel(ServicePanel, LayerManager.uiLayerName, true);
    }
}

export enum orderStatusType {
    /**等待,待支付 */
    waitForPay = 1,

    /**支付成功 */
    succeed,

    /**支付失败 */
    failed,

    /**未支付 */
    cancel
}
