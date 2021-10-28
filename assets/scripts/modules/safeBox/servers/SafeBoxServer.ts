import SaveDepositTask from "../tasks/saveDepositTask";
import SaveWithdrawTask from "../tasks/SaveWithdrawTask";
import ModifySavePwdTask from "../tasks/ModifySavePwdTask";
import GetSaveWalletCoinTask from "../tasks/GetSaveWalletCoinTask";

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
export default class SafeBoxServer extends  riggerIOC.Server{
    constructor() {
        super();
    }
    
    /**
     * 获取当前用户保险箱金额
     */
    public getSafeBoxCoinReq(): GetSaveWalletCoinTask {
        let task: GetSaveWalletCoinTask = new GetSaveWalletCoinTask();
        task.start();
        return task;
    }

    /**
     * 保险箱存款请求
     * @param coin 存款金额,以分为单位
     */
    public saveMoneyReq(coin: number): SaveDepositTask {
        let task: SaveDepositTask = new SaveDepositTask();
        task.start(coin);
        return task;
    }

    /**
     * 保险箱取款请求
     * @param coin 取款金额,以分为单位
     * @param password 保险箱密码
     */
    public withdrawalMoneyReq(coin: number, password: string): SaveWithdrawTask {
        let task: SaveWithdrawTask = new SaveWithdrawTask();
        task.start([coin, password]);
        return task;
    }

    /**
     * 修改保险箱密码
     * @param newPassword 新密码 
     * @param oldPassword 旧密码
     */
    public modifySavePwdReq(): ModifySavePwdTask {
        let task: ModifySavePwdTask = new ModifySavePwdTask();
        // task.start([newPassword, oldPassword]);
        return task;
    }

    dispose() {
    }
}
