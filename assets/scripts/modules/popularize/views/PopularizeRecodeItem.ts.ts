import JPView from "../../../../libs/common/scripts/utils/JPView";
import { DirectCommissionItem } from "../../../protocol/protocols/protocols";
import ConversionFunction from "../../../../libs/common/scripts/utils/mathUtils/ConversionFunction";

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
export default class PopularizeRecodeItem extends JPView {

    @property(cc.Label)
    private userId: cc.Label = null;

    @property(cc.Label)
    private nickname: cc.Label = null;

    @property(cc.Label)
    private goldCount: cc.Label = null;

    @property(cc.Label)
    private loginTime: cc.Label = null;

    constructor() {
        super();
    }

    onInit() {
        super.onInit();
    }

    onShow() {
        super.onShow();
    }

    onHide() {
        super.onHide();
    }

    onDispose() {
        super.onDispose();
    }

    public updateItem(data: DirectCommissionItem): void {
        this.userId.string = data.userId + "";
        this.nickname.string = data.nickname;
        this.goldCount.string = ConversionFunction.intToFloat(data.amount, 2) + "";
        this.loginTime.string = data.lastLoginTime; //this._getDateString(parseInt(data.lastLoginTime));
    }

    private _getDateString(date: number): string {
        let time = new Date(date);
        return time.getFullYear()
        + "/" + (time.getMonth() + 1)
        + "/" + time.getDate()
        + " " + time.getHours()
        + ":" + time.getMinutes()
    }

}
