import ReqDirectCommissionTask from "../task/ReqDirectCommissionTask";
import ReqDrawCommissionRecordsTask from "../task/ReqDrawCommissionRecordsTask";
import ReqDrawCommissionTask from "../task/ReqDrawCommissionTask";
import ReqMyPromotionInformationTask from "../task/ReqMyPromotionInformationTask";

const { ccclass, property } = cc._decorator;

/**
 * 推广服务 用于创建/获取推广数据的请求任务
 */
export default class PopularizeServer extends riggerIOC.Server {


    constructor() {
        super();
    }

    /** 推广明细 请求任务 */
    requestDirectCommission(): ReqDirectCommissionTask {
        let task = new ReqDirectCommissionTask();
        task.timeout = 5000;
        task.start();
        return task;
    }

    /**提取佣金记录 请求任务 */
    requestDrawCommissionRecords(): ReqDrawCommissionRecordsTask{
        let task = new ReqDrawCommissionRecordsTask();
        task.timeout = 5000;
        task.start();
        return task;
    }

    /**提取佣金 请求任务 */
    requestDrawCommission(number: number): ReqDrawCommissionTask {
        let task = new ReqDrawCommissionTask();
        task.timeout = 5000;
        task.start(number);
        return task;
    }

    /**我的推广 请求任务 */
    requestMyPromotionInformation(): ReqMyPromotionInformationTask {
        let task = new ReqMyPromotionInformationTask();
        task.timeout = 5000;
        task.start();
        return task;
    }

}
