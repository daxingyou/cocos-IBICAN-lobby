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
export default class PayType {
    public static readonly PROXY: string = 'Proxy'; //代理充值

    public static readonly ALIPAY_SM: string = 'Alipay_SM';  //支付宝扫码

    public static readonly ALIPAY_H5: string = 'Alipay_H5';  //支付宝H5

    public static readonly WEIXIN_SM: string = 'Weixin_SM';  //微信扫码

    public static readonly WEIXIN_H5: string = 'Weixin_H5';  //微信扫码

    public static readonly QQ_SM: string = 'QQ_SM';  //QQ钱包扫码

    public static readonly QQ_H5: string = 'QQ_H5';  //QQ钱包H5

    public static readonly JD_SM: string = 'JD_SM';  //京东钱包扫码

    public static readonly JD_H5: string = 'JD_H5';  //京东钱包H5

    public static readonly QUICK_PAY: string = 'QuickPay';  //快捷支付

    public static readonly UNIONPAY_SM: string = 'UnionPay_SM';  //银联扫码

    public static readonly UNIONPAY_H5: string = 'UnionPay_H5';  //银联H5

    public static readonly ALIPAY_TO_BANK: string = 'AlipayToBank';  //支付宝银行转账

    public static readonly WEIXIN_TO_BANK: string = 'WeixinToBank';  //微信银行转账
    
    public static readonly BANK_TO_BANK: string = 'BankToBank';  //银行卡转账
}
