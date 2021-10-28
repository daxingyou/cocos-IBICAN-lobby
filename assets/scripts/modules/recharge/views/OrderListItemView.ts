import JPView from "../../../../libs/common/scripts/utils/JPView";
import RechargeDetailsPanel, { orderStatusType } from "./RechargeDetailsPanel";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import RechargeServer from "../servers/RechargeServer";
import { ErrResp } from "../../../protocol/protocols/protocols";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";

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
export default class OrderListItemView extends JPView {
    @property(cc.Label)
    private orderTimeTxt: cc.Label = null;

    @property(cc.Label)
    private rechargeCoinTxt: cc.Label = null;

    @property(cc.Label)
    private statusTxt: cc.Label = null;

    @property(cc.Button)
    private detailsBtn: cc.Button = null;

    @riggerIOC.inject(RechargeServer)
    private rechargeServer: RechargeServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    constructor() {
        super();
    }

    onShow() {
        this.addEventListener();
    }

    onHide() {
        this.removeEventListener();
    }

    private orderId: number;
    updateView(id: number, time: string, coin: string, status: number) {
        this.orderId = id;
        this.orderTimeTxt.string = time.replace(/-/g, '/');
        this.rechargeCoinTxt.string = coin;
        let color: cc.Color;
        let str: string;
        switch(status) {
            case orderStatusType.waitForPay:
                    color = new cc.Color(255, 230, 155);
                    str = '等待中';
                break;
            case orderStatusType.succeed:
                    color = new cc.Color(123, 231, 126);
                    str = '充值成功';
                break;
            case orderStatusType.failed:
                    color = new cc.Color(245, 92, 92);
                    str = '充值失败';
                break;
            case orderStatusType.cancel:
                    color = new cc.Color(245, 92, 92);
                    str = '未支付';
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
        if(!this.orderId) {
            cc.log(`order id is not exist`);
            return;
        }

        let getDetailsTask = this.rechargeServer.requestRechargeOrderDetails(this.orderId);
        let result = await getDetailsTask.wait();
        if(result.isOk) {
            UIManager.instance.showPanel(RechargeDetailsPanel, LayerManager.uiLayerName, false, result.result.order);
        }
        else {
            let reason = result.reason;
            if(reason instanceof ErrResp) {
                this.pushTipsQueueSignal.dispatch(reason.errMsg);
            }
            else {
                this.pushTipsQueueSignal.dispatch(reason);
            }
        }
    }
}