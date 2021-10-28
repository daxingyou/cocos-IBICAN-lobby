import { CommissionRankItem, CommissionRankResp, MyPromotionInformationResp } from "../../../protocol/protocols/protocols";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopularizeModel extends riggerIOC.Model {
    private _commissionRank: CommissionRankItem[];
    
    private _myCommisionRank: CommissionRankItem;

    private _myPromotionInformationResp: MyPromotionInformationResp = null;

    constructor() {
        super();
    }

    dispose() {
        super.dispose();
        this._commissionRank = null;
        this._myCommisionRank = null;
    }

    public setCommissionRankInfos(respData: CommissionRankResp) {
        this.commissionRank = respData.commissionRankItems;
        this.myCommissionRank = respData.myCommissionRankItem;
    }

    set commissionRank(data: CommissionRankItem[]){
        this._commissionRank = data;
    }

    get commissionRank(): CommissionRankItem[] {
        return this._commissionRank;
    }

    set myCommissionRank(data: CommissionRankItem) {
        this._myCommisionRank = data;
    }

    get myCommissionRank(): CommissionRankItem{
        return this._myCommisionRank;
    }

    set qrCodeUrl(url: string) {
        this._myPromotionInformationResp.qrCodeUrl = url;
    }

    get qrCodeUrl(): string{
        return this._myPromotionInformationResp.qrCodeUrl ;
    }

    set myPromotionInformationResp(data: MyPromotionInformationResp) {
        this._myPromotionInformationResp = data;
    }

    get myPromotionInformationResp(): MyPromotionInformationResp {
        return this._myPromotionInformationResp;
    }

    set totalCommission(amount: number){
        this._myPromotionInformationResp.totalCommission = amount;
    }

    get totalCommission(): number{
        return this._myPromotionInformationResp.totalCommission;
    }

    set dataCommission(amount: number){
        this._myPromotionInformationResp.commission = amount;
    }

    get dataCommission(): number{
        return this._myPromotionInformationResp.commission;
    }


    public getFlaotByInt(num: number): number{
        let temp: number = num / 100;
        return Math.floor(temp);
    }
}