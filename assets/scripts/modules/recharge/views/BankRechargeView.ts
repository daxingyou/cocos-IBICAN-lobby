import JPView from "../../../../libs/common/scripts/utils/JPView";
import { RechargeSetting } from "../../../protocol/protocols/protocols";
import RechargeModel from "../models/RechargeModel";
import RechargeServer from "../servers/RechargeServer";
//充值，银行支付界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class BankRechargeView extends JPView {
    @property(cc.EditBox)
    public inputTxt:cc.EditBox = null;

    @property(cc.Button)
    public cancelBtn:cc.Button = null;

    @property([cc.Button])
    public btns: cc.Button[] = [];

    @riggerIOC.inject(RechargeModel)
    private rechargeModel: RechargeModel;

    @riggerIOC.inject(RechargeServer)
    private rechargeServer: RechargeServer;
    

    constructor() {
        super();
    }

    onInit() {
        super.onInit();
        this.initUsualCoin();
    }

    onShow() {
        super.onShow();
        this.addEventListener();
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
    }

    onDispose() {
        super.onDispose();
    }

    addEventListener() {
        for(let i = 0; i < this.btns.length; i++) {
            this.btns[i] && this.btns[i].node.on('click', this.onClick, this);
        }

        this.cancelBtn.node.on("click", this.cancelHandle, this);
    }

    removeEventListener() {
        for(let i = 0; i < this.btns.length; i++) {
            this.btns[i] && this.btns[i].node.off('click', this.onClick, this);
        }
        this.cancelBtn.node.off("click", this.cancelHandle, this);
    }

    private bankSettingInfo: RechargeSetting;
    initUsualCoin() {
        this.bankSettingInfo = this.rechargeModel.getSettingInfoByType(RechargeType.Bank);
        if(!this.bankSettingInfo) {
            this.rechargeServer.initSetting();
            this.bankSettingInfo = this.rechargeModel.getSettingInfoByType(RechargeType.Bank);
        }

        if(this.bankSettingInfo) {
            this.btns.forEach((btn, idx) => {
                cc.find('Background/label', btn.node).getComponent(cc.Label).string = this.bankSettingInfo.fastAmountList[idx] / 100 + '';
            });
        }

        if(this.bankSettingInfo && this.bankSettingInfo.minAmount && this.bankSettingInfo.maxAmount) {
            this.inputTxt.placeholder = `建议充值${this.bankSettingInfo.minAmount}-${this.bankSettingInfo.maxAmount}元`;
        }
    }

    private cancelHandle():void
    {
        this.inputTxt.string = "";
    }


    private onClick(btn:cc.Button):void
    {
        let name = btn.node.name;
        //let label:any= cc.find("Background/label", btn.node);
        //this.inputTxt.string = label._components[0].string;
        let label:cc.Label = btn.node.getChildByName("Background").getChildByName("label").getComponent(cc.Label);
        this.inputTxt.string = label.string;
    }
    // update (dt) {}
}
