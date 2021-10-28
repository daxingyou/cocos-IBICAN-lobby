import JPView from "../../../../libs/common/scripts/utils/JPView";
import { DirectCommissionItem, CommissionRankItem } from "../../../protocol/protocols/protocols";
import ConversionFunction from "../../../../libs/common/scripts/utils/mathUtils/ConversionFunction";

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
export default class RankDrawCommissionItem extends JPView {

    @property(cc.Label)
    private rankIndexLable: cc.Label = null;

    @property(cc.Sprite) 
    private rankIndexImage: cc.Sprite = null;

    @property(cc.Label)
    private nickname: cc.Label = null;

    @property(cc.Label)
    private goldCount: cc.Label = null;

    @property(cc.Label)
    private extendLabel: cc.Label = null;

    @property(cc.Sprite)
    private roleAvatar: cc.Sprite = null;

    @property(cc.Sprite)
    private goldIcon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    private avatarFrames: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    private rankIndexFrames: cc.SpriteFrame[] = [];

    constructor() {
        super();
    }

    onInit() {
        super.onInit();
    }

    onShow() {
        super.onShow();
    }

    onHide() {
        super.onHide();
    }

    onDispose() {
        super.onDispose();
    }

    public updateItem(rankInfo: CommissionRankItem): void {
        let rankIndex = parseInt(rankInfo.number);
        this.rankIndexLable.node.active = rankIndex > 3  
        this.rankIndexLable.string = rankIndex > 3 ? rankInfo.number + "" : "";
        if (rankInfo.isExtand){
            this.extendLabel.node.active = true;
            this.roleAvatar.node.active = false;
            this.rankIndexImage.node.active = false;
            this.goldIcon.node.active = false;
            this.nickname.node.active = false;
            this.goldCount.node.active = false;
        }else{
            this.goldIcon.node.active = true;
            this.nickname.node.active = true;
            this.goldCount.node.active = true;
            this.nickname.string = this.exChangeNickName(rankInfo.nickname);
            this.goldCount.string = ConversionFunction.intToFloat(rankInfo.amount, 2) + "";
            if (rankInfo.avatarId){
                this.roleAvatar.node.active = true;
                this.roleAvatar.spriteFrame = this.avatarFrames[rankInfo.avatarId - 1];
                this.extendLabel.node.active = false;
            }
        }
        if (rankIndex && rankIndex <= 3){
            this.rankIndexImage.node.active = true;
            this.rankIndexImage.spriteFrame = this.rankIndexFrames[rankIndex - 1];
        }else{
            this.rankIndexImage.node.active = false;
        }
    }

    exChangeNickName(nickName:string){
        let len = 12 
        let str = ''
        if(nickName.length > 12){
            for(let i = 0;i < 11;i++){
                str+= nickName[i]
            }
            return str+'...'
        }else{
            return nickName
        }
    }

}
