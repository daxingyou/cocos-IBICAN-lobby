import JPView from "../../../../libs/common/scripts/utils/JPView";
import { Winning } from "../../../protocol/protocols/protocols";
import { PoolType} from "../models/ActivityDrawModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PerRecordView extends JPView {
    @property(cc.Label)
    private dateTxt: cc.Label = null;

    @property(cc.Label)
    private turnTxt: cc.Label = null;

    @property(cc.Label)
    private goldNum: cc.Label = null;

    constructor() {
        super();
    }

    initItem(winInfo: Winning) {
        this.dateTxt.string = this.dateTxtChange(winInfo.time);
        this.turnTxt.string = winInfo.poolName;
        this.goldNum.string = winInfo.prizeAmount/100 + '';
        this.setFontColor(winInfo.poolId)
    }

    setFontColor(poolId: number){
        switch (poolId){
            case PoolType.SliverTurn:
                this.turnTxt.node.color = new cc.Color().fromHEX('#10c8f0');
                break;
            case PoolType.GoldTurn:
                this.turnTxt.node.color = new cc.Color().fromHEX('#f7ce3e');
                break;
            case PoolType.DiamonTurn:
                this.turnTxt.node.color = new cc.Color().fromHEX('#d835f5');
                break;
        }
    }

    private dateTxtChange(date: string){
        let newtime = date.slice(5,10)
        return newtime.replace(/-/g,'/')
    }
}
