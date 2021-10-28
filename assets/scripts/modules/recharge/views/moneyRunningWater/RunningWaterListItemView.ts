import JPView from "../../../../../libs/common/scripts/utils/JPView";
import { SafeWithdrawReq } from "../../../../protocol/protocols/protocols";

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
export default class RunningWaterListItemView extends JPView {
    @property(cc.Label)
    private timeTxt: cc.Label = null;

    @property(cc.Label)
    private rechargeMosaicTxt: cc.Label = null;

    @property(cc.Label)
    private giftMosaicTxt: cc.Label = null;

    @property(cc.Label)
    private actualMosaicTxt: cc.Label = null;

    @property(cc.Label)
    private rechargeStatusTxt: cc.Label = null;

    @property(cc.Label)
    private giftStatusTxt: cc.Label = null;

    constructor() {
        super();
    }

    initItem(time: string, rechargeMosaic: number, giftMosaic: number, actualMosaic: number, rechargeStatus: boolean, giftStatus: boolean) {
        this.timeTxt.string = time;
        this.rechargeMosaicTxt.string = rechargeMosaic / 100 + '';
        this.giftMosaicTxt.string = giftMosaic / 100 + '';
        this.actualMosaicTxt.string = actualMosaic / 100 + '';

        let rechargeStatusArg = this.statusArg(rechargeStatus);
        this.rechargeStatusTxt.string = rechargeStatusArg.str;
        this.rechargeStatusTxt.node.color = rechargeStatusArg.color;

        let giftStatusArg = this.statusArg(giftStatus);
        this.giftStatusTxt.string = giftStatusArg.str;
        this.giftStatusTxt.node.color = giftStatusArg.color;
    }   

    private statusArg(status: boolean): {color: cc.Color, str: string}{
        let c: cc.Color;
        let str: string;
        if(status) {
            c = new cc.Color(105, 251, 136);
            str = '已通过';
        }
        else {
            c = new cc.Color(255, 173, 31);
            str = '未通过';
        } 
        return {color: c, str: str};
    }
}
