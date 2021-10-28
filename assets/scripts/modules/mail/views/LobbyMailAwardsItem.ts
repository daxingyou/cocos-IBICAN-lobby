import JPView from "../../../../libs/common/scripts/utils/JPView";
import {SysMailProp } from "../../../protocol/protocols/protocols";
import ConversionFunction from "../../../../libs/common/scripts/utils/mathUtils/ConversionFunction";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyMailAwardsItem extends JPView{

    @property(cc.Label)
    private amountLabel: cc.Label = null;

    @property(cc.Node)
    private confirmNode: cc.Node = null;

    constructor(){
        super();
    }

    public setGoodsInfo(info: SysMailProp) {
        this.amountLabel.string = ConversionFunction.intToFloat(info.propNumber,0).toString();
    }



    public setConirmAwards(hasDraw: boolean) {
        this.confirmNode.active = hasDraw
    }
} 