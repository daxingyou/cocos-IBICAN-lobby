
const { ccclass, property } = cc._decorator;

@ccclass
export default class RefreshListDescConst {

    public readonly updateDescList: any = ["下拉可更新", "释放立即更新", "正在更新", "更新成功"];
    public readonly updateStateTypes = {
        CAN_UPDATE: 0,
        TO_UPDATE: 1,
        UPATING: 2,
        UPDATE_SUC: 3
    };

    public readonly endDesc: string = "上次刷新时间：";

    public getDesc(stateType: number):string {
        if (stateType === null || stateType === undefined || ! this.updateDescList[stateType]) return;
        return this.updateDescList[stateType];
    }
}
