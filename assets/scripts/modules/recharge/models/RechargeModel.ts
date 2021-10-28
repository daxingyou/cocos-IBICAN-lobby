import { RechargeOrder, RechargeSetting } from "../../../protocol/protocols/protocols";
import PayType from "./PayType";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class RechargeModel extends riggerIOC.Model {
    constructor() {
        super();
    }

    dispose() {
    }

    /**订单列表 */
    get orderList(): RechargeOrder[] {
        return this._orderList;
    }
    set orderList(v: RechargeOrder[]) {
        this._orderList = v;
    }
    private _orderList: RechargeOrder[] = [];

    /**充值设置信息 */
    get rechargeSettings(): RechargeSetting[] {
        return this._rechargeSettings;
    }
    set rechargeSettings(v: RechargeSetting[]) {
        this._rechargeSettings = v;
    }
    private _rechargeSettings: RechargeSetting[] = [];

    /**
     * 根据充值类型返回相应的充值设置信息
     * @param payType 充值类型 
     */
    getSettingInfoByType(payType: PayType): RechargeSetting {
        let info: RechargeSetting;
        this._rechargeSettings.forEach((item, idx)=> {
            if(item.payFlag == payType) {
                info = this._rechargeSettings[idx];
            } 
        });
        return info;
    }
}

export enum WithdrawType {
    alipay = 1,
    weixin = 2,
    bank = 3
}
