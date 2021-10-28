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
export default class BankType {
    /**中国银行 */
    public static readonly BOC_BANK: string = "中国银行";

    /**中国农业银行 */
    public static readonly ABC_BANK: string = "中国农业银行";

    /**中国建设银行 */
    public static readonly CBC_BANK: string = "中国建设银行";

    /**招商银行 */
    public static readonly ICBC_BANK: string = "招商银行";

    /**交通银行 */
    public static readonly BCM_BANK: string = "交通银行";

    /**中国邮政储蓄 */
    public static readonly PSBC_BANK: string = "中国邮政储蓄";
}
