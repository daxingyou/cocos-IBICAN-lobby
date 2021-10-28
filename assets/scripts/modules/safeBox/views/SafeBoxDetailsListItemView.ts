import JPView from "../../../../libs/common/scripts/utils/JPView";

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
export default class SafeBoxDetailsListItemView extends JPView {
    @property(cc.Label)
    private timeTxt: cc.Label = null;

    @property(cc.Label)
    private tipsTxt: cc.Label = null;

    @property(cc.Label)
    private coinTxt: cc.Label = null;

    constructor() {
        super();
    }

    initItem(time: string, tips: string, cooin: number) {
        this.timeTxt.string = time.replace(/-/g, '/');
        this.tipsTxt.string = tips;
        this.coinTxt.string = cooin / 100 + '';
    }
}
