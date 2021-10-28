import RefreshListDescConst from "../const/RefreshListDescConst";
import JPView from "../../JPView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RefreshListUpdateDescView extends JPView {

    @property(cc.Label)
    refreshStateDesc: cc.Label;

    @property(cc.Label)
    refreshTimeDesc: cc.Label;

    @property(cc.Node)
    arrowImageNode: cc.Node;

    /**
     * 刷新列表状态描述常量
     */
    public refreshListDescConst: RefreshListDescConst;
    protected updateTime: Date;
    private stateType: number;

    constructor() {
        super();
        this.refreshListDescConst = new RefreshListDescConst();
        this.updateTime = new Date();
    }

    public changeState(stateType: number): void {
        if (stateType === null || stateType === undefined) return;
        if (!(this.stateType === null || this.stateType === undefined) && this.stateType === stateType) return;
        this.stateType = stateType;
        let desc: string = this.refreshListDescConst.getDesc(stateType);
        this.refreshStateDesc.string = desc;
        if (stateType === this.refreshListDescConst.updateStateTypes.UPDATE_SUC) {
            this.updateTime = null;
            this.updateTime = new Date(rigger.service.TimeService.instance.serverTime);
            if (this.arrowImageNode) {
                this.arrowImageNode.scaleY = -1;
            }
        } else if (stateType === this.refreshListDescConst.updateStateTypes.CAN_UPDATE) {
            if (this.arrowImageNode) {
                this.arrowImageNode.scaleY = 1;
            }
        }
        this.refreshTimeDesc.string = this.refreshListDescConst.endDesc + this.getDateString(this.updateTime)
    }

    private getDateString(date: Date): string {
        return this.updateTime.getFullYear()
            + "/" + (this.updateTime.getMonth() + 1)
            + "/" + this.updateTime.getDate()
            + " " + this.updateTime.getHours()
            + ":" + this.updateTime.getMinutes()
            + ":" + this.updateTime.getSeconds()
    }

    public onInit(): void {
        this.updateTime = new Date(rigger.service.TimeService.instance.serverTime);
        this.changeState(this.refreshListDescConst.updateDescList.CAN_UPDATE);
    }

    public onDispose() {
        super.onDispose();
        this.refreshListDescConst = null;
        this.updateTime = null;
    }
}
