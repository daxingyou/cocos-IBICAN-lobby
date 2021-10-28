import JPView from "../../../../libs/common/scripts/utils/JPView";
import { DrawCommissionRecordItem } from "../../../protocol/protocols/protocols";
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
export default class ReceiveRecordsItem extends JPView {

    @property(cc.Label)
    private receiveTime: cc.Label = null;

    @property(cc.Label)
    private receiveNumber: cc.Label = null;

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

    public updateItem(data: DrawCommissionRecordItem): void {
        this.receiveTime.string = data.drawTime;;
        this.receiveNumber.string = ConversionFunction.intToFloat(data.amount, 2) + "";
    }

    private _getDateString(date: number): string {
        let time = new Date(date);
        return time.getFullYear()
        + "/" + (time.getMonth() + 1)
        + "/" + time.getDate()
        + " " + time.getHours()
        + ":" + time.getMinutes()
        + ":" + time.getSeconds()
    }

}
