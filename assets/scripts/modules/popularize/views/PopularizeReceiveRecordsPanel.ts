import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import AsyncRefreshList from "../../../../libs/common/scripts/utils/refreshList/AsyncRefreshList";
import { DrawCommissionRecordItem } from "../../../protocol/protocols/protocols";
import ReceiveRecordsItem from "./ReceiveRecordsItem.ts";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import LobbyListEmptyTipsView from "../../../common/views/LobbyListEmptyTipsView";
import UIUtils from "../../../../libs/common/scripts/utils/UIUtils";


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
export default class PopularizeReceiveRecordsPanel extends Panel {
    @property(cc.Button)
    private closeBtn: cc.Button = null;

    @riggerIOC.inject(PushTipsQueueSignal)
    public pushTipsQueueSignal: PushTipsQueueSignal;

    @property(cc.Node)
    private listEmptyTipsParentNode: cc.Node = null

    @property(cc.Prefab)
    private lobbyListEmptyTipsPrefab: cc.Prefab = null;

    private listEmptyTips: LobbyListEmptyTipsView = null;
    
    @property(AsyncRefreshList)
    public recordList: AsyncRefreshList = null;
    private data: DrawCommissionRecordItem[] = null;
    
    constructor() {
        super();        
    }

    onInit(){
        super.onInit();
        let node : cc.Node = UIUtils.instantiate(this.lobbyListEmptyTipsPrefab);
        if (node) {
            this.listEmptyTipsParentNode.addChild(node);
        }
        this.listEmptyTipsParentNode.active = false
        if (node && node instanceof cc.Node) {
            this.listEmptyTips = node.getComponent(LobbyListEmptyTipsView);
            this.listEmptyTips.setDesc("您暂时还没有任何提取纪录~");
        };
    }

    onShow() {
        super.onShow();
        this.addEventListener();
        this.recordList.onRender(this, this.onRender);
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
        this.recordList.offRender(this, this.onRender);
    }

    onDispose() {
        super.onDispose();
    }

    closeWindow() {
        UIManager.instance.hidePanel(this);
    }

    addEventListener() {
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
    }

    removeEventListener() {
        this.closeBtn.node.off('click', this.onCloseBtnClick);
    }

    /**更新列表 */
    public updateList(list: DrawCommissionRecordItem[]) {
        this.data = list;
        if (list.length === 0) {
            this.listEmptyTipsParentNode.active = true;
        }else{
            this.listEmptyTipsParentNode.active = false;
        }
        if (list.length <= 8) {            
            (this.recordList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.NONE;
            this.recordList.node.width = 765;
            this.recordList.node.height = 520;
        }
        else {
            (this.recordList.node.getComponent(cc.Layout) as cc.Layout).resizeMode = cc.Layout.ResizeMode.CONTAINER;
        }
        this.recordList.reset(list.length);
        this.recordList.run(2, 1);
    }

    private onRender(node: cc.Node, idx: number) {
        let item: ReceiveRecordsItem = node.getComponent(ReceiveRecordsItem) as ReceiveRecordsItem;
        let record: DrawCommissionRecordItem = this.data[idx];
        item.updateItem(record);
    }

    /**关闭按钮 */
    private onCloseBtnClick() {
        this.closeWindow();
    }

}