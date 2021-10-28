import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import RechargeModel from "../models/RechargeModel";
import RechargeServer from "../servers/RechargeServer";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import { RechargeSetting } from "../../../protocol/protocols/protocols";
import PayType from "../models/PayType";
import LobbySoundChannels from "../../sound/LobbySoundChannels";
import JPAudio from "../../../../libs/common/scripts/utils/JPAudio";
import UIUtils from "../../../../libs/common/scripts/utils/UIUtils";
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
export default class RechargePanel extends Panel {

    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property([cc.Prefab])
    public content: cc.Prefab[] = [];

    @property(cc.Node)
    public toggleNode: cc.Node = null;

    @property(cc.ToggleContainer)
    private controlBtnToggleContainer: cc.ToggleContainer = null;

    @property(cc.ToggleContainer)
    private controlBtnBgToggleContainer: cc.ToggleContainer = null;

    @riggerIOC.inject(LobbySoundChannels.PANEL_POP_UP)
    private popupChannel: JPAudio;

    @riggerIOC.inject(RechargeModel)
    private rechargeModel: RechargeModel;

    @riggerIOC.inject(RechargeServer)
    private rechargeServer: RechargeServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;
   
    public currentView:cc.Node;
    public currentIndex:number;
    constructor() {
        super();
    }

    onInit() {
        super.onInit();
        this.changeView(3);
    }

    private changeView(index:number = 0)
    {
        if(this.currentIndex == index) return;
        this.currentIndex = index;
        if(this.currentView )this.currentView.destroy();
        this.currentView = UIUtils.instantiate(this.content[this.currentIndex]);
        
        if(this.currentView) this.node.addChild(this.currentView);
    }

    onShow() {
        super.onShow();
        this.resetAllToggle();
        this.initToggle();
        this.addEventListener();
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
        this.popupChannel.stop();
    }

    onDispose() {
        super.onDispose();
    }

    private vaildRechargeType: number[] = [];
    initToggle() {
        this.vaildRechargeType = [];
        this.rechargeServer.initSetting();
        let rechargeSettingInfo = this.rechargeModel.rechargeSettings;
        rechargeSettingInfo.forEach((info: RechargeSetting, idx) => {
            if(info.enable) {
                let index = this.getToggleIdxByRechargeWay(info.payFlag);
                index >= 0 && this.vaildRechargeType.push(index);
            }
        });

        this.vaildRechargeType.push(this.toggleGroup.length - 1); //充值记录
        
        this.vaildRechargeType.sort(this.sortIdx);
        this.vaildRechargeType.forEach((index, idx)=> {
            this.controlBtnToggleContainer.toggleItems[index].node.active = true;
            this.controlBtnBgToggleContainer.toggleItems[index].node.active = true;
            this.controlBtnToggleContainer.getComponent(cc.Layout).updateLayout();
            this.controlBtnBgToggleContainer.getComponent(cc.Layout).updateLayout();
            if(idx == 0) {
                this.controlBtnToggleContainer.toggleItems[index].check();
                this.controlBtnBgToggleContainer.toggleItems[index].check();
                this.changeView(index);
            }
        });

        this.toggleNode.height = this.controlBtnBgToggleContainer.node.height;
        this.toggleNode.width = this.controlBtnBgToggleContainer.node.width;
    }

    resetAllToggle() {
        this.controlBtnBgToggleContainer.toggleItems.forEach((toggle, idx) => {
            toggle.node.active = false;
        });
        this.controlBtnToggleContainer.toggleItems.forEach((toggle, idx) => {
            toggle.node.active = false;
        });
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.controlBtnToggleContainer.node.children.forEach((toggle, idx) => {
            toggle.on('toggle', this.onToggleChanged, this);
        });
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick, this);
        this.controlBtnToggleContainer.node.children.forEach((toggle, idx) => {
            toggle.off('toggle', this.onToggleChanged, this);
        });
    }

    /**关闭按钮 */
    private onCloseBtnClick() {
        this.closeWindow();
    }
    
    private onToggleChanged(toggle: cc.Toggle) {
        let name = toggle.node.name;
        if(!name) return;
        switch(name) {
            case 'agencyToggle':
                this.controlBtnBgToggleContainer.toggleItems[0].check();
                this.changeView(0);
                break;
            case 'alipayH5Toggle':
                this.controlBtnBgToggleContainer.toggleItems[1].check();
                this.changeView(1);
                break;
            case 'alipaySmToggle':
                this.controlBtnBgToggleContainer.toggleItems[2].check();
                this.changeView(2);
                break;
            case 'bankToggle':
                this.controlBtnBgToggleContainer.toggleItems[3].check();
                this.changeView(3);
                break;
            case 'weixinToggle':
                this.controlBtnBgToggleContainer.toggleItems[4].check();
                this.changeView(4);
                break;
            case 'weixinSmToggle':
                this.controlBtnBgToggleContainer.toggleItems[5].check();
                this.changeView(5);
                break;
            case 'detailsToggle':
                this.controlBtnBgToggleContainer.toggleItems[6].check();
                this.changeView(6);
                break;
            default:
                break;
        }
    }

    private readonly toggleGroup: string[] = ['agencyToggle', 'alipayH5Toggle', 'alipaySmToggle', 'bankToggle', 'weixinToggle', 'weixinSmToggle', 'detailsToggle'];
    private getToggleIdxByRechargeWay(type: string) {
        let idx: number = -1;
        switch(type) {
            case PayType.PROXY:
                idx = 0;
                break;
            case PayType.ALIPAY_H5:
                idx = 1;
                break;
            case PayType.ALIPAY_SM:
                idx = 2;
                break;
            case PayType.BANK_TO_BANK:
                idx = 3;
                break;
            case PayType.WEIXIN_H5:
                idx = 4;
                break;
            case PayType.WEIXIN_SM:
                idx = 5;
                break;
            default :
                break;
        }
        return idx;
    }

    private sortIdx(idxA: number, idxB: number) {
        return idxA - idxB;
    }
}