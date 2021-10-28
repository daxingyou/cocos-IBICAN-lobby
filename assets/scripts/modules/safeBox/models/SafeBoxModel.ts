import SafeBoxServer from "../servers/SafeBoxServer";

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

export default class SafeBoxModel extends riggerIOC.Model {
    /**保险箱服务 */
    @riggerIOC.inject(SafeBoxServer)
    private safeBoxServer: SafeBoxServer;

    constructor() {
        super();
    }

    /**
     * 保险箱余额
     */
    get saveBoxCoin(): number {
        return this._saveBoxCoin;
    }
    set saveBoxCoin(value: number) {
        if(value <= 0) value = 0;
        this._saveBoxCoin = value;
    }
    private _saveBoxCoin: number = 0;

    dispose() {
    }
}
