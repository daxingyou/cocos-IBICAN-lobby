import JPView from "../../../../libs/common/scripts/utils/JPView";

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
export default class LoginScene extends JPView {
    @property(cc.ProgressBar)
    public progressBar: cc.ProgressBar = null;

    @property(cc.Label)
    public tipsLabel: cc.Label = null;

    @property(cc.Button)
    public wechatLoginBtn: cc.Button = null;

    @property(cc.Button)
    public mobileLoginBtn: cc.Button = null;

    @property(cc.Button)
    public quickLoginBtn: cc.Button = null;

    @property(cc.Node)
    public readyPartion: cc.Node  = null;

    @property(cc.Node)
    public hotUpdatePartion: cc.Node = null;

    @property(cc.Toggle)
    public comfirmPolicyToggle: cc.Toggle = null;

    @property(cc.Button)
    public readPolicyBtn: cc.Button = null;

    @property(cc.Label)
    public versionTxt: cc.Label = null;

    @property
    public enableHotUpdate:boolean = true;

    public showTips(tips: string): void {
        this.tipsLabel.string = tips;
    }

    public switchHotUpdate(): void {
        this.hotUpdatePartion.active = true;
        this.readyPartion.active = false;
    }

    public switchReady(): void {
        this.hotUpdatePartion.active = false;
        this.readyPartion.active = true;
    }
}
