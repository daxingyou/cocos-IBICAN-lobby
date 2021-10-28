import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import LobbyUserServer from "../servers/LobbyUserServer";
import UserModel from "../../../../libs/common/scripts/modules/user/models/UserModel";
import LobbyUserModel from "../model/LobbyUserModel";

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
export default class ChangeNicknamePanel extends Panel {
    @property(cc.Button)
    public closeBtn: cc.Button = null;

    @property(cc.Button)
    public cancelBtn: cc.Button = null;

    @property(cc.Button)
    public confirmBtn: cc.Button = null;

    @property(cc.EditBox)
    public nicknameInputTxt: cc.EditBox = null;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(LobbyUserServer)
    private userServer: LobbyUserServer;

    @riggerIOC.inject(UserModel)
    private lobbyUserModel: LobbyUserModel;

    constructor() {
        super();
    }

    onShow() {
        super.onShow();
        this.addEventListener();
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
    }

    onDispose() {
        super.onDispose();
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.cancelBtn.node.on('click', this.onCloseBtnClick, this);
        this.confirmBtn.node.on('click', this.onConfirmBtnClick, this);
        this.nicknameInputTxt.node.on('editing-did-ended', this.onNicknameInputEnd, this);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick, this);
        this.cancelBtn.node.off('click', this.onCloseBtnClick, this);
        this.confirmBtn.node.off('click', this.onConfirmBtnClick, this);
        this.nicknameInputTxt.node.off('editing-did-ended', this.onNicknameInputEnd, this);
    }

    /**
     * 点击关闭、取消按钮
     */
    private onCloseBtnClick() {
        this.closeWindow();
    }

    private onNicknameInputEnd(input: cc.EditBox) {
        let str: string = input.string;
        if(!this.isValidNickname(str)) {
            this.pushTipsQueueSignal.dispatch('请输入2-6个汉字或者6-12位数字或者字母组合');
            this.nicknameInputTxt.string = '';
        }
    }

    /**
     * 点击昵称修改确认按钮
     */
    async onConfirmBtnClick() {
        let str = this.nicknameInputTxt.string;
        if(this.isValidNickname(str)) {
            if(str == this.lobbyUserModel.self.nickName) {
                this.pushTipsQueueSignal.dispatch('与原昵称重复');
                return;
            }
            let task = this.userServer.changeNicknameReq(str);
            // task.reset();
            let result = await task.wait();
            if(result.isOk) {
                this.pushTipsQueueSignal.dispatch('修改昵称成功');
                this.closeWindow();
            }
            else {
                this.pushTipsQueueSignal.dispatch('修改昵称失败');
                cc.log(`changeNickname failed. reason: ${result.reason}`);
            }
        }
    }

    /**
     * 检查昵称是否有效
     * @param name 
     */
    private isValidNickname(name: string) {
        let re = /^[a-zA-Z0-9]{6,12}$/; //数字字母均可
        let recharacters = /^[\u4e00-\u9fa5]{2,6}$/; //汉字均可
        if(re.test(name) || recharacters.test(name)) {
            return true;
        }
        else {
            return false;
        }
    }
}
