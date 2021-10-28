import ReqCommissionRankTask from "../task/ReqCommissionRankTask";
import ReqWinRankingListTask from "../task/ReqEarnGoldRankTask";

const { ccclass, property } = cc._decorator;

/**
 * 推广服务 用于创建/获取推广数据的请求任务
 */
export default class RankServer extends riggerIOC.Server {


    constructor() {
        super();
    }

    /**推广佣金排行榜 请求任务*/
    requestCommissionRank(): ReqCommissionRankTask {
        let task = new ReqCommissionRankTask();
        task.timeout = 5000;
        task.start();
        return task;
    }

    @riggerIOC.inject(ReqWinRankingListTask)
    protected reqWinRankingListTask: ReqWinRankingListTask;
    /**赚金排行榜 请求任务*/
    requestEarnGoldRank(): ReqWinRankingListTask {
        if(this.reqWinRankingListTask.isWaitting()) return this.reqWinRankingListTask;
        this.reqWinRankingListTask.prepare();
        this.reqWinRankingListTask.timeout = 5000;
        this.reqWinRankingListTask.start();
        return this.reqWinRankingListTask;

        // let task = new ReqWinRankingListTask();
        // task.timeout = 5000;
        // task.start();
        // return task;
    }

}
