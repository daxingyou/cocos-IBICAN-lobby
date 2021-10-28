import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import RechargePanel from "../../recharge/views/RechargePanel";
import GiftBoxServer from "../servers/GiftBoxServer";
import { ErrResp, RechargeSetting } from "../../../protocol/protocols/protocols";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import BaseWaitingPanel from "../../../../libs/common/scripts/modules/tips/views/BaseWaitingPanel";
import RechargeModel from "../../recharge/models/RechargeModel";
import RechargeServer from "../../recharge/servers/RechargeServer";
import InitSubGameInfoSignal from "../../subGames/signals/InitSubGameInfoSignal";

//首充送礼
const {ccclass, property} = cc._decorator;

@ccclass
export default class FirstChargePanel extends Panel {

    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property(cc.Button)
    public getBtn:cc.Button = null;

    @riggerIOC.inject(GiftBoxServer)
    private giftBoxServer: GiftBoxServer;

    @riggerIOC.inject(RechargeModel)
    private rechargeModel: RechargeModel;

    @riggerIOC.inject(RechargeServer)
    private rechargeServer: RechargeServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    constructor() {
        super();
    }

    onInit() {
        super.onInit();
    }

    onShow() {
        super.onShow();
        this.addEventListener();
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
       this.closeBtn.node.on('click', this.onCloseBtnClick, this);
       this.getBtn.node.on('click', this.getHandle, this);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick, this);
        this.getBtn.node.off('click', this.getHandle, this);
    }
    
    private async getHandle()
    {
        // UIManager.instance.showPanel(RechargePanel, LayerManager.uiLayerName, true);
        let payType: string;
        this.rechargeServer.initSetting();
        let rechargeSettingInfo = this.rechargeModel.rechargeSettings;
        for(let i = 0; i < rechargeSettingInfo.length; i++) {
            if(rechargeSettingInfo[i].enable) {
                payType = rechargeSettingInfo[i].payFlag;
                break;
            }
        }

        if(!payType) {
            this.pushTipsQueueSignal.dispatch('暂无可用的充值通道,获取更多信息请联系客服');
            return;
        }

        BaseWaitingPanel.show("正在登录");
        let task = this.giftBoxServer.firstRecharge(payType);
        let result  = await task.wait();
        if(BaseWaitingPanel.waittingPanel) UIManager.instance.hidePanel(BaseWaitingPanel.waittingPanel);
        if(result.isOk) {
            if(result.result.payAction == 2) {
                cc.sys.openURL(result.result.payData);
            }
        }
        else {
            let reason = result.reason;
            if(reason instanceof ErrResp) {
                this.pushTipsQueueSignal.dispatch(reason.errMsg);
            }
            else {
                cc.log(reason);
            }
        }
    }

     /**关闭按钮 */
    private onCloseBtnClick(){
        this.closeWindow();
    }
    // update (dt) {}
}
