import ProtocolTask from "../../../../libs/common/scripts/utils/ProtocolTask";
import CommandCodes from "../../../protocol/CommandCodes";
import NetworkServer from "../../../../libs/common/scripts/modules/network/servers/NetworkServer";
import {  MyPromotionInformationResp, MyPromotionInformationReq } from "../../../protocol/protocols/protocols";
import {  MyPromotionInformationRespSignal } from "../../../protocol/signals/signals";
import PopularizeModel from "../model/PopularizeModel";

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

/**
 * 提取佣金 请求任务
 */
@ccclass
export default class ReqMyPromotionInformationTask extends ProtocolTask<MyPromotionInformationResp> {
    @riggerIOC.inject(NetworkServer)
    protected networkServer: NetworkServer;

    @riggerIOC.inject(MyPromotionInformationRespSignal)
    private myPromotionInformationRespSignal: MyPromotionInformationRespSignal;

    @riggerIOC.inject(PopularizeModel)
    private popularizeModel: PopularizeModel;


    constructor() {
        super(CommandCodes.PPMyPromotionInformationReq);
    }

    start() {
        return super.start() as ReqMyPromotionInformationTask;
    } 

    onTaskStart() {
        let req: MyPromotionInformationReq = new MyPromotionInformationReq();
        this.networkServer.sendDefault(CommandCodes.PPMyPromotionInformationReq, req);
        this.myPromotionInformationRespSignal.on(this, this.onGetMyPromotionInformation);
    }

    onTaskCancel() {
        this.myPromotionInformationRespSignal.off(this, this.onGetMyPromotionInformation);
    }

    private onGetMyPromotionInformation(resp: MyPromotionInformationResp) {
        this.myPromotionInformationRespSignal.off(this, this.onGetMyPromotionInformation);
        console.log("onGetMyPromotionInformation", resp)
        this.popularizeModel.myPromotionInformationResp = resp;
        this.setComplete(resp);
    }
}
