import JPView from "../../../../libs/common/scripts/utils/JPView";
import { UserAmountPush } from "../../../protocol/protocols/protocols";
import OnUserInfoUpdateSignal from "../../../../libs/common/scripts/modules/user/signals/OnUserInfoUpdateSignal";
import LobbyUserModel from "../../user/model/LobbyUserModel";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyServer from "../servers/LobbyServer";
import BindPhoneCompleteSignal from "../../giftBox/signals/BindPhoneCompleteSignal";
import ShowRechargePanelByLobbySignal from "../signals/ShowRechargePanelByLobbySignal";
import { SubGameType } from "../../subGames/models/SubGamesModel";


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
export default class BalanceView extends JPView {
    @property(cc.Label)
    public balanceLabel: cc.Label = null;

    @property(cc.Button)
    public chargeBtn: cc.Button = null;

    @property(cc.Sprite)
    public bg: cc.Sprite = null;

    @property([cc.SpriteFrame])
    public bgFrames: cc.SpriteFrame[] = [];

    @riggerIOC.inject(OnUserInfoUpdateSignal)
    protected onUserInfoUpdateSignal: OnUserInfoUpdateSignal;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;

    // @riggerIOC.inject(LobbyServer)
    // private lobbyServer: LobbyServer;

    // @riggerIOC.inject(BindPhoneCompleteSignal)
    // private bindPhoneCompleteSignal: BindPhoneCompleteSignal;

    @riggerIOC.inject(ShowRechargePanelByLobbySignal)
    private showRechargePanelByLobbySignal: ShowRechargePanelByLobbySignal;

    onInit(): void {

    }

    onShow(): void {
        this.addEventListener();
    }

    onHide(): void {
        this.removeEventListener();
    }

    addEventListener() {
        this.chargeBtn.node.on('click', this.onChargeBtnClick, this);

        // this.bindPhoneCompleteSignal.on(this, this.getUserAmount);
    }

    removeEventListener() {
        this.chargeBtn.node.off('click', this.onChargeBtnClick, this);
        // this.bindPhoneCompleteSignal.off(this, this.getUserAmount);
    }

    public switchStyle(type: string) {
        let index: number = -1;
        switch (type) {
            case SubGameType.SLOT:
                index = 2;
                break;
            case SubGameType.ARCADE:
                index = 1;
                break;
            default:
                index = 0;
                break;
        }
        this.changeShow(index);
    }

    private changeShow(index: number): void {
        if (index == 2) {
            this.bg.spriteFrame = this.bgFrames[1];
        }
        else {
            this.bg.spriteFrame = this.bgFrames[0];
        }
    }

    /**客户端请求用户金额 */
    // async getUserAmount()
    // {
    //     let task = this.lobbyServer.getUserAmount();
    //     let result:riggerIOC.Result<GetUserAmountResp> = await task.wait();
    //     if(result.isOk)
    //     {
    //         cc.log(`amount req: ${result.result.amount}`);
    //         this.updateUserAmount(result.result.amount);
    //     }

    // }

    /**
     * 服务器主动推送用户金额
     * @param resp 
     */
    private userAmountPushHandle(resp: UserAmountPush): void {
        cc.log(`amount push: ${resp.amount}`);
        this.updateUserAmount(resp.amount);
    }

    private updateUserAmount(amount: number): void {
        this.lobbyUserModel.self.balance = amount / 100;
        //this.balanceLabel.string = this.lobbyUserModel.self.balance.toString();
        // this.onUserInfoUpdateSignal.dispatch();
    }

    private onChargeBtnClick(): void {
        this.showRechargePanelByLobbySignal.dispatch();
        // UIManager.instance.showPanel(RechargePanel, LayerManager.uiLayerName, false);
    }

}
