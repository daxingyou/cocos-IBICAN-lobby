import JPMediator from "../../../../../libs/common/scripts/utils/JPMediator";
import WithdrawDetailsPanel from "./WithdrawDetailsPanel";
import { WithdrawMosaicResp, WithdrawOrder } from "../../../../protocol/protocols/protocols";

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
export default class WithdrawDetatilsMediator extends JPMediator {
    @riggerIOC.inject(WithdrawDetailsPanel)
    protected view: WithdrawDetailsPanel;

    constructor() {
        super();
    }

    onExtra([pageIdx, result]: [number, any]) {
        pageIdx && this.view.viewChange(pageIdx);
        if(result instanceof WithdrawMosaicResp) {
            //提现打码详情,申请提现
            this.view.updateView(result);
        }

        if(result instanceof WithdrawOrder) {
            //提现订单详情,查询记录
            this.view.updateView(result);
        }
    }

    onShow() {
    }

    onHide() {
    }
}
