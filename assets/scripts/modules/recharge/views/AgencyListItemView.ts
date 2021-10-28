import JPView from "../../../../libs/common/scripts/utils/JPView";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import ContactAgencyPanel from "./ContactAgencyPanel";
import { RechargeAgentItem } from "../../../protocol/protocols/protocols";

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
export default class AgencyListItemView extends JPView {

    @property(cc.Sprite)
    public typeIcon: cc.Sprite = null;

    @property([cc.SpriteFrame])
    public typeIconSpriteFrames: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    public recommendFlag: cc.Sprite = null;

    @property([cc.SpriteFrame])
    public flagSpriteFrames: cc.SpriteFrame[] = [];

    @property(cc.Label)
    public agencyName: cc.Label = null;

    @property(cc.Label)
    public supportPayType: cc.Label = null;

    @property(cc.Button)
    public rechargeBtn: cc.Button = null;

    constructor() {
        super();
    }

    onShow() {
        this.addEventListener();
    }

    onHide() {
        this.removeEventListener();
    }


    private agencyContactAccount: string = ''; //代理人联系账号
    private agencyContactType: number; //代理人联系方式
    private agencyId: number; //id

    /**
     * 
     * @param rechargeAgentItem 代理信息
     */
    init(rechargeAgentItem: RechargeAgentItem) {
        this.agencyId = rechargeAgentItem.agentUid;
        this.agencyName.string = rechargeAgentItem.agentNick;
        this.agencyContactAccount = rechargeAgentItem.contactAccount;
        this.supportPayType.string = '支持:' + rechargeAgentItem.payType;
        this.agencyContactType = rechargeAgentItem.contactType;
        this.typeIcon.spriteFrame = this.typeIconSpriteFrames[rechargeAgentItem.contactType - 1];
        this.recommendFlag.spriteFrame = this.flagSpriteFrames[rechargeAgentItem.mark];
    } 

    addEventListener() {
        this.rechargeBtn.node.on('click', this.onRechargeBtnClick, this);
    }

    removeEventListener() {
        this.rechargeBtn.node.off('click', this.onRechargeBtnClick, this);
    }

    private onRechargeBtnClick() {
        UIManager.instance.showPanel(ContactAgencyPanel, LayerManager.uiLayerName, false, [this.agencyId, this.agencyName.string, this.agencyContactType, this.agencyContactAccount]);
    }


}