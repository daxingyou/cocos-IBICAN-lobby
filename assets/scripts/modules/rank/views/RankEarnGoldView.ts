import JPView from "../../../../libs/common/scripts/utils/JPView";
import AsyncRefreshList from "../../../../libs/common/scripts/utils/refreshList/AsyncRefreshList";
import { WinRankingListResp, WinRanking } from "../../../protocol/protocols/protocols";
import RankItem from "./RankDrawCommissionItem";
import RankEarnGoldItem from "./RankEarnGoldItem";
import ConversionFunction from "../../../../libs/common/scripts/utils/mathUtils/ConversionFunction";
import LobbyListEmptyTipsView from "../../../common/views/LobbyListEmptyTipsView";
import UIUtils from "../../../../libs/common/scripts/utils/UIUtils";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import VirtualAsyncList from "../../../utils/VirtualAsyncList";



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

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankEarnGoldView extends JPView {

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
    private earnGoldNum: cc.Label = null;

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

    private data: WinRankingListResp = null;

    constructor() {
        super();
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
            this.listEmptyTips.setDesc("暂时还没有任何佣金排行信息，每天0点更新一次~");
        };
    }

    onHide() {
        super.onHide();
        this.rankList.offRender(this, this.onRender);

    }

    /**更新列表 */
    public updateView(data: WinRankingListResp) {
        this.data = data;
        let length = 100
        if (length === 0) {
            this.listEmptyTipsParentNode.active = true;
        }else{
            this.listEmptyTipsParentNode.active = false;
        }
        if (length <= 8) {
            (this.rankList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.NONE;
            this.rankList.node.width = 743;
            this.rankList.node.height = 422;
        }
        // else {
        //     (this.rankList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.CONTAINER;
        // }

        this.rankList.initPage(10,2);
        this.rankList.reset(length);
        // this.rankList.run();
        // this.rankList.clearPool();

        this.updateMyRankInfo(data.myWinRanking);
    }

    private onRender(node: cc.Node, idx: number) {
        let item: RankEarnGoldItem = node.getComponent(RankEarnGoldItem) as RankEarnGoldItem;
        let rankInfo: WinRanking = this.data.list[idx];
        let isExtand = rankInfo === undefined || rankInfo == null;
        rankInfo = rankInfo || new WinRanking();
        rankInfo["isExtand"] = isExtand;
        rankInfo.no = isExtand ? idx + 1 : rankInfo.no;
        item.updateItem(rankInfo);
    }

    private updateMyRankInfo(rankInfo: WinRanking) {
        this.myRankInfosView.active = true;
        if (rankInfo === undefined || rankInfo === null || rankInfo.number === '未上榜') {
            this.rankIndexImage.node.active = false;
            this.rankIndexLabel.string = "100+";
            this.earnGoldNum.string = "";
            this.nickNameLabel.string = this.lobbyUserModel.self.nickName;
            this.earnGoldNum.string = "0";
            this.roleHeadIcon.node.active = true;
            this.roleHeadIcon.spriteFrame = this.avatarFrames[parseInt(this.lobbyUserModel.self.icon) - 1];
            return;
        }
        this.rankIndexLabel.string = rankInfo.no > 3 ? rankInfo.no + "" : "";
        this.nickNameLabel.string = rankInfo.nickname;
        this.earnGoldNum.string = ConversionFunction.intToFloat(rankInfo.winAmount, 2) + "";
        if (rankInfo.no && rankInfo.no <= 3) {
            this.rankIndexImage.node.active = true;
            this.rankIndexImage.spriteFrame = this.rankIndexFrames[rankInfo.no - 1];
        }
        if (rankInfo.avatar) {
            this.roleHeadIcon.node.active = true;
            this.roleHeadIcon.spriteFrame = this.avatarFrames[parseInt(rankInfo.avatar) - 1];
        }
    }

    
}
