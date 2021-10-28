import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import { SysMailProp, UserSysMail } from "../../../protocol/protocols/protocols";
import UIUtils from "../../../../libs/common/scripts/utils/UIUtils";
import LobbyMailAwardsItem from "./LobbyMailAwardsItem";
import LobbyMailModel from "../model/LobbyMailModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyMailAwardsPanel extends Panel {
    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property(cc.Button)
    public buttonDetermine: cc.Button = null;
    
    @property(cc.Prefab)
    private awardsItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    private awardsNode: cc.Node = null;

    @riggerIOC.inject(LobbyMailModel)
    private model: LobbyMailModel;

    private _mailId: number = 0;


    constructor() {
        super();
    }

    //传递数量
    onExtra(mailId: number) {
        this._mailId = mailId;
    }
   
    onShow() {
        super.onShow();
        this.addEventListener();
        this.initView();
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.buttonDetermine.node.on('click', this.onCloseBtnClick, this);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick);        
        this.buttonDetermine.node.off('click', this.onCloseBtnClick, this);
    }

    private initView(){
        this.awardsNode.removeAllChildren();
        let mailInfo: UserSysMail = this.model.getMailDetail(this._mailId);
        let length: number = mailInfo.mail.props ? mailInfo.mail.props.length : 0;
        if (length > 0){
            this.setAwardsList(mailInfo.mail.props);
        }
        length = length > 0 ? length : 1;
        this.awardsNode.width = 143 * length + (length - 1) * 10;
    }

    private setAwardsList(props: SysMailProp[]) {
        props.forEach((prop: SysMailProp, idx) => {
            let awardsItem: cc.Node = UIUtils.instantiate(this.awardsItemPrefab);
            this.awardsNode.addChild(awardsItem);
            awardsItem.getComponent(LobbyMailAwardsItem).setGoodsInfo(prop);
        })
    }


    closeWindow() {
        UIManager.instance.hidePanel(this);
    }

    /**关闭按钮 */
    private onCloseBtnClick() {
        this.closeWindow();
    }
}