import JPView from "../../../../libs/common/scripts/utils/JPView";
import JPSprite from "../../../../libs/common/scripts/utils/JPSprite";
import { Activity, Notice } from "../../../protocol/protocols/protocols";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import ActivityDailyShare from "./ActivityDailyShare";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import { ActiveType } from "../models/ActivityModel";
import LobbyAssetsConfig from "../../assets/LobbyAssetsConfig";
import ActivityConectUI from "./ActivityConectUI";
import ActivityDailyDraw from "./ActivityDailyDraw";
import ActivityPanel from "./ActivityPanel";

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
export default class ActivityContentView extends JPView {
    @property(JPSprite)
    public content: JPSprite = null;

    @property(cc.Button)
    public goonBtn: cc.Button = null;

    @property(cc.Node)
    private activeNode: cc.Node = null;

    private activityData: Activity | Notice

    constructor() {
        super();
    }

    onInit() {
        super.onInit();
        // this.goonBtn.node.active = false; 
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
        this.goonBtn.node.on('click', this.onGoonBtnClick, this);
    }

    removeEventListener() {
        this.goonBtn.node.off('click', this.onGoonBtnClick, this);
    }

    /**
     * 内容展示(图片)
     * @param data 
     */
    show(data: Activity | Notice) {
        let showGoonBtn: boolean = false;
        this.activityData = data
        if(data instanceof Activity) {
            this.content.getComponent(JPSprite).url = data.image;
        }
        
        if(data instanceof Notice) {
            this.content.getComponent(JPSprite).url = data.image;
        }

        if(data.url && data.url.length > 0) {
            showGoonBtn = true;
            cc.find('Background/Label', this.goonBtn.node).getComponent(cc.Label).string = data.buttonText;
        }else{
            // cc.log()
            cc.log('链接内容为空')
        }

        
        this.content.node.active = true;
        this.goonBtn.node.active = showGoonBtn; 
        this.node.getComponent(cc.ScrollView).scrollToTop();
    }

    /**点击跳转 */
    private onGoonBtnClick() {
        //外部链接
        if(this.activityData.urlType == ActiveType.External){
            cc.sys.openURL(this.activityData.url)
        }

        if(this.activityData.urlType == ActiveType.Internal){
            switch (this.activityData.url){
                case ActivityConectUI.ACTIVITYDAILYSHARE_PANEL:
                    this.activeNode.getComponent(ActivityPanel).needCache = true
                    UIManager.instance.showPanel(ActivityDailyShare, LayerManager.uiLayerName, true)
                    break
                case ActivityConectUI.ACTIVITYDAILYDRAW_PANEL:
                    this.activeNode.getComponent(ActivityPanel).needCache = true
                    UIManager.instance.showPanel(ActivityDailyDraw, LayerManager.uiLayerName, true)
                    break
            }
        }
        
    }

    clear() {
        this.content.node.active = false;
        this.goonBtn.node.active = false; 
    }
}
