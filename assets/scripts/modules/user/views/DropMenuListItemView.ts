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
export default class DropMenuListItemView extends JPView {
    @property(cc.Label)
    private selectTxt: cc.Label = null;

    constructor() {
        super();
    }

    get selectName(): string {
        return this.selectTxt.string;
    }

    get selectType(): number | string {
        return this.type;
    }

    private type: number | string;
    initItem(str: string, type?: number | string) {
        this.selectTxt.string = str;
        type && (this.type = type);
    }

}
