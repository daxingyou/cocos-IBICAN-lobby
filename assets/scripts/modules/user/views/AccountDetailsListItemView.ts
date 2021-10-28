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
export default class AccountDetailsListItemView extends JPView {
    @property(cc.Label)
    private timeTxt: cc.Label = null;

    @property(cc.Label)
    private typeTxt: cc.Label = null;

    @property(cc.Label)
    private earningTxt: cc.Label = null;

    @property(cc.Label)
    private payoffTxt: cc.Label = null;

    @property(cc.Label)
    private balanceTxt: cc.Label = null;

    constructor() {
        super();
    }

    initItem(time: string, type: string, transferAmount: number, transferWay: number, balanceCoin: number) {
        this.timeTxt.string = time.replace(/-/g, '/');
        this.typeTxt.string = type;
        this.balanceTxt.string = (balanceCoin / 100).toFixed(2);
        let color1 = new cc.Color(13, 93, 130);
        let color2 = new cc.Color(12, 156, 1);

        if(transferWay == 1) {
            //收入
            this.earningTxt.string = (transferAmount / 100).toFixed(2);
            this.earningTxt.node.color = color2;
            this.payoffTxt.string = '0.00';
            this.payoffTxt.node.color = color1;
        }
        else if(transferWay == 2) {
            //支出
            this.earningTxt.string = '0.00';
            this.earningTxt.node.color = color1;
            this.payoffTxt.string = (transferAmount / 100).toFixed(2);
            this.payoffTxt.node.color = color2;
        }
    }
}
