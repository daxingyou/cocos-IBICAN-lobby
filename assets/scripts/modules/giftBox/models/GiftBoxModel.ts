import { OperationalActivity } from "../../../protocol/protocols/protocols";

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
export default class GiftBoxModel extends riggerIOC.Model {
    constructor() {
        super();
    }

    dispose() {
        super.dispose();
    }

    get operationalActivityList(): OperationalActivity[] {
        return this._operationalActivityList;
    }
    set operationalActivityList(v: OperationalActivity[]) {
        this._operationalActivityList = v;
    }
    private _operationalActivityList: OperationalActivity[] = [];

    /**
     * 获取指定编码的活动信息
     * @param code 
     */
    getOperationalActivityInfoByCode(code: string): OperationalActivity {
        if(!this._operationalActivityList) return;
        for(let i = 0; i < this._operationalActivityList.length; i++) {
            if(this._operationalActivityList[i].activityCode == code) {
                return this._operationalActivityList[i];
            }
        }
    }
}
