// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 流水类型
 */
export default class RunningWaterType {
    /**充值转入 */
    public static readonly RECHARGE_IN: number = 11;

    /**提现转出 */
    public static readonly WITHDRAW_OUT: number = 12;

    /**提现失败转入 */
    public static readonly WITHDRAW_FAIL_IN: number = 13;

    /**游戏转入 */
    public static readonly GAME_IN: number = 31;

    /**游戏转出 */
    public static readonly GAME_OUT: number = 32;

    /**游戏转出失败转入 */
    public static readonly GAME_OUT_FAIL_IN: number = 33;

    /**后台转入 */
    public static readonly BACKSTAGE_IN: number = 41;

    /**后台转出 */
    public static readonly BACKSTAGE_OUT: number = 42;

    /**保险箱取款转入 */
    public static readonly SAFE_IN: number = 51;

    /**保险箱存款转出 */
    public static readonly SAFE_OUT: number = 52;

    /**注册送金优惠转入 */
    public static readonly REGISTER_GIFT: number = 101;

    /**绑定有礼优惠转入 */
    public static readonly BIND_MOBILE_GIFT: number = 103;

    /**首充礼包优惠转入 */
    public static readonly FIRST_RECHARGE_GIFT: number = 105;
}

/**
 * 流水查看,时间关键字
 */
export class RunningWaterTimeKeyWord {
    /**今天 */
    public static readonly TODAY: string = 'TODAY';

    /**昨天 */
    public static readonly YESTERDAY: string = 'YESTERDAY';

    /**最近一个月 */
    public static readonly LAST_MONTH: string = 'LAST_MONTH';

    /**全部 */
    public static readonly ALL: string = 'ALL';
}
