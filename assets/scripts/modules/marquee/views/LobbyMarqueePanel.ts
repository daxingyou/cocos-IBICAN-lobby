import BaseTipsPanel from "../../../../libs/common/scripts/modules/tips/views/BaseTipsPanel";
import Panel from "../../../../libs/common/scripts/utils/Panel";
import LobbyMarqueeView from "./LobbyMarqueeView";
import UIUtils from "../../../../libs/common/scripts/utils/UIUtils";
import LobbyMarqueeModel from "../model/LobbyMarqueeModel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import WaitablePanel from "../../../../libs/common/scripts/utils/WaitablePanel";
const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyMarqueePanel extends WaitablePanel {
    @property(cc.Node)
    private maskNode: cc.Node = null;

    @property(cc.Prefab)
    private marqueePrefab: cc.Prefab = null;

    private marqueeView: LobbyMarqueeView = null;

    @riggerIOC.inject(LobbyMarqueeModel)
    private model: LobbyMarqueeModel;

    private marqueeNode: cc.Node;

    constructor() {
        super();
    }

    start() {
        cc.log('marqueePanel Start');
        super.start();
    }

    // public onInit(): void {
    //     super.onInit();
    // }

    // public onShow(): void {
    //     super.onShow();
    // }

    // public reset(){
    //     super.reset();
    // }

    // public onHide(): void {
    //     super.onHide();
    // }

    public isWaitting(){
        return this.workWait.isWaitting();
    }

    public async playNext() {
        if (this.model.getMsgCount() > 0) {
            if (this.marqueeView.isWorkWaitting()) {
                this.marqueeView.reset();
            }
            let tempStr: string = this.model.shiftMessage().body;
            this.marqueeView.resetMarquee(tempStr);
            this.marqueeView.playMarquee();
            await this.marqueeView.wait();
        } else {
            this.done(true);
            console.log(" this done ", this)
            // UIManager.instance.hidePanel(this);
        }
    }

    onInit():void{
        this.marqueeNode = UIUtils.instantiate(this.marqueePrefab);
        this.marqueeView = this.marqueeNode.getComponent(LobbyMarqueeView);
        this.maskNode.addChild(this.marqueeNode);
        this.marqueeNode.x = - this.marqueeNode.width / 2;
    }

    // public start() {
    //     super.start();
    // }

}