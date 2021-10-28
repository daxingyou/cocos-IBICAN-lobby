import JPView from "../../../../../libs/common/scripts/utils/JPView";
import RechargeServer from "../../servers/RechargeServer";
import WithdrawOrderDetailsTask from "../../task/WithdrawOrderDetailsTask";
import { WithdrawOrderResp } from "../../../../protocol/protocols/protocols";
import UIManager from "../../../../../libs/common/scripts/utils/UIManager";
import WithdrawDetailsPanel, { withdrawDetailsPanelType, withdrawStatusType } from "./WithdrawDetailsPanel";
import LayerManager from "../../../../../libs/common/scripts/utils/LayerManager";

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
export default class WithdrawListItemView extends JPView {
    @property(cc.Label)
    private orderTimeTxt: cc.Label = null;

    @property(cc.Label)
    private withdrawCoinTxt: cc.Label = null;

    @property(cc.Label)
    private statusTxt: cc.Label = null;

    @property(cc.Button)
    private detailsBtn: cc.Button = null;

    @riggerIOC.inject(RechargeServer)
    private rechargeServer: RechargeServer;

    constructor() {
        super();
    }

    onShow() {
        this.addEventListener();
    }

    onHide() {
        this.removeEventListener();
    }

    /**订单id */
    private orderIdx: number;
    /**
     * 转出单条记录初始化
     * @param orderIdx 
     * @param orderTime 
     * @param withdrawCoin 
     * @param status 
     */
    initItem(orderIdx: number, orderTime: string, withdrawCoin: number, status: number) {
        this.orderIdx = orderIdx;
        this.orderTimeTxt.string = orderTime.replace(/-/g, '/');
        this.withdrawCoinTxt.string = withdrawCoin / 100 + '';
        let color: cc.Color;
        let str: string;
        switch(status) {
            case withdrawStatusType.wait:
                    color = new cc.Color(255, 230, 155);
                    str = '等待中';
                break;
            case withdrawStatusType.succeed:
                    color = new cc.Color(123, 231, 126);
                    str = '转出成功';
                break;
            case withdrawStatusType.failed:
                    color = new cc.Color(245, 92, 92);
                    str = '转出失败';
                break;
            default :
                break;
        }
        this.statusTxt.string = str;
        this.statusTxt.node.color = color;
    }

    addEventListener() {
        this.detailsBtn.node.on('click', this.onDetailsBtnClick, this);
    }

    removeEventListener() {
        this.detailsBtn.node.off('click', this.onDetailsBtnClick, this);
    }

    private async onDetailsBtnClick() {
        let task: WithdrawOrderDetailsTask = this.rechargeServer.requestWithdrawOrderDetails(this.orderIdx);
        let result = await task.wait();
        if(result.isOk) {
            UIManager.instance.showPanel(WithdrawDetailsPanel, LayerManager.uiLayerName, false, [withdrawDetailsPanelType.withdrawRecordDetailsPanel, result.result.withdrawOrder]);
        }
    }
}
