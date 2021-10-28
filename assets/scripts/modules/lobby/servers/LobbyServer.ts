import GetUserAmountTask from "../task/GetUserAmountTask.ts";
import GameWalletTransferAllTask from "../task/GameWalletTransferAllTask";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

export default class LobbyServer extends riggerIOC.Server {
    constructor() {
        super();
    }
    

    getUserAmount(): GetUserAmountTask {
        let task = new GetUserAmountTask();
        task.start();
        return task;
    }

    @riggerIOC.inject(GameWalletTransferAllTask)
    private walletTransferAllTask: GameWalletTransferAllTask;

    /**
     * 大厅钱包与游戏钱包的转换。。。。
     * transferType 转账类型，，transferType = 1 游戏钱包转到大厅钱包， transferType = 2 大厅钱包转到游戏钱包。。
     */
    gameWalletTransferAll(transferType: number): GameWalletTransferAllTask {
        if(this.walletTransferAllTask.isWaitting()) this.walletTransferAllTask.cancel(null);
        this.walletTransferAllTask.prepare();
        this.walletTransferAllTask.start(transferType)
        return this.walletTransferAllTask;
    }
}
