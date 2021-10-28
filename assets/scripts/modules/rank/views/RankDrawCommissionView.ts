import JPView from "../../../../libs/common/scripts/utils/JPView";
import AsyncRefreshList from "../../../../libs/common/scripts/utils/refreshList/AsyncRefreshList";
import { CommissionRankResp, CommissionRankItem } from "../../../protocol/protocols/protocols";
import RankItem from "./RankDrawCommissionItem";
import RankDrawCommissionItem from "./RankDrawCommissionItem";
import ConversionFunction from "../../../../libs/common/scripts/utils/mathUtils/ConversionFunction";
import LobbyListEmptyTipsView from "../../../common/views/LobbyListEmptyTipsView";
import UIUtils from "../../../../libs/common/scripts/utils/UIUtils";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import VirtualAsyncList from "../../../utils/VirtualAsyncList";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";


// import AsyncRefreshList from "../../../../libs/common/scripts/utils/refreshList/AsyncRefreshList";
// import BaseRefreshListTask from "../../../../libs/common/scripts/utils/refreshList/task/BaseRefreshListTask";
// import TestRefreshTask from "../../../../libs/common/scripts/utils/refreshList/task/testRefreshTask";

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
export default class RankDrawCommissionView extends JPView {

    @property(VirtualAsyncList)
    public rankList: VirtualAsyncList = null;

    @property(cc.Node)
    private myRankInfosView: cc.Node = null;

    @property(cc.Label)
    private rankIndexLabel: cc.Label = null;

    @property(cc.Sprite)
    private roleHeadIcon: cc.Sprite = null;

    @property(cc.Sprite)
    private rankIndexImage: cc.Sprite = null;

    @property(cc.Sprite)
    private goldIcon: cc.Sprite = null;
    
    @property(cc.Label)
    private nickNameLabel: cc.Label = null;

    @property(cc.Label)
    private drawCommissionNum: cc.Label = null;

    @property(cc.SpriteFrame)
    private avatarFrames: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    private rankIndexFrames: cc.SpriteFrame[] = [];

    @property(cc.Node)
    private listEmptyTipsParentNode: cc.Node = null

    @property(cc.Prefab)
    private lobbyListEmptyTipsPrefab: cc.Prefab = null;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;


    private listEmptyTips: LobbyListEmptyTipsView = null;

   
    private data: CommissionRankResp = null;

    constructor() {
        super();
    }

    
    onInit() {
        super.onInit();
    }


    onDispose() {
        super.onDispose();
    }

    onShow() {
        super.onShow();
        this.rankList.onRender(this, this.onRender);
        let node : cc.Node = UIUtils.instantiate(this.lobbyListEmptyTipsPrefab);
        if (node) {
            this.listEmptyTipsParentNode.addChild(node);
        }
        this.listEmptyTipsParentNode.active = false
        if (node && node instanceof cc.Node) {
            this.listEmptyTips = node.getComponent(LobbyListEmptyTipsView);
            this.listEmptyTips.setDesc("暂时数据, 每天早上9点清零，更新一次~");
        };
    }

    onHide() {
        super.onHide();
        this.rankList.offRender(this, this.onRender);
    }

    /**更新列表 */
    public updateView(data: CommissionRankResp) {
        let length = 100
        this.data = data;
        if (length === 0) {
            this.listEmptyTipsParentNode.active = true;
        }else{
            this.listEmptyTipsParentNode.active = false;
        }
        if(length <= 8) {
            (this.rankList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.NONE;
            this.rankList.node.width = 720;
            this.rankList.node.height = 440;
        }
        // else {
        //     (this.rankList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.CONTAINER;
        // }
        this.rankList.initPage(10,2);
        this.rankList.reset(length);
        // this.rankList.run();
        // this.rankList.clearPool();
        this.updateMyRankInfo(data.myCommissionRankItem)
    }
 
    private onRender(node: cc.Node, idx: number) {
        let item: RankDrawCommissionItem = node.getComponent(RankDrawCommissionItem) as RankDrawCommissionItem;
        let rankInfo: CommissionRankItem = this.data.commissionRankItems[idx];
        let isExtand = rankInfo === undefined || rankInfo == null;
        rankInfo = rankInfo || new CommissionRankItem();
        rankInfo["isExtand"] = isExtand;
        rankInfo.number = isExtand ? (idx + 1).toString() : rankInfo.number;
        item.updateItem(rankInfo);
    }

    private updateMyRankInfo(rankInfo: CommissionRankItem) {
        this.myRankInfosView.active = true;
        if (rankInfo === undefined || rankInfo === null || rankInfo.number === '未上榜') {
            this.rankIndexImage.node.active = false;
            this.rankIndexLabel.string = "100+";
            this.nickNameLabel.string = this.lobbyUserModel.self.nickName;
            this.drawCommissionNum.string = "0";
            this.roleHeadIcon.node.active = true;
            this.roleHeadIcon.spriteFrame = this.avatarFrames[parseInt(this.lobbyUserModel.self.icon) - 1];
            return;
        }
        let rankIndex = parseInt(rankInfo.number);
        this.rankIndexLabel.string = rankIndex> 3 ? rankInfo.number + "" : "";
        this.nickNameLabel.string = rankInfo.nickname;
        this.drawCommissionNum.string = ConversionFunction.intToFloat(rankInfo.amount, 2)+ "";
        if (rankIndex && rankIndex <= 3){
            this.rankIndexImage.node.active = true;
            this.rankIndexImage.spriteFrame = this.rankIndexFrames[rankIndex - 1];
        }
        if (rankInfo.avatarId){
            this.roleHeadIcon.node.active = true;
            this.roleHeadIcon.spriteFrame = this.avatarFrames[rankInfo.avatarId - 1];
        }
    }

}
