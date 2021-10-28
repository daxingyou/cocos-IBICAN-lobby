import JPView from "../../../../../libs/common/scripts/utils/JPView";

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
export default class MoneyDetailsListItemView extends JPView {
    @property(cc.Label)
    private timeTxt: cc.Label = null;

    @property(cc.Label)
    private typeTxt: cc.Label = null;

    @property(cc.Label)
    private rechargeCoinTxt: cc.Label = null;

    @property(cc.Label)
    private giftCoinTxt: cc.Label = null;

    constructor() {
        super();
    }

    initItem(time: string, type: string, rechargeCoin: number, giftCoin: number) {
        this.timeTxt.string = time;
        this.typeTxt.string = type;
        this.rechargeCoinTxt.string = rechargeCoin / 100 + '';
        this.giftCoinTxt.string = giftCoin / 100 + '';
    }
}
