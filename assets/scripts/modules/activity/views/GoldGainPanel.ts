import Panel from "../../../../libs/common/scripts/utils/Panel";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GoldGainPanel extends Panel {
    @property(cc.Button)
    public confirmBtn: cc.Button = null;

    @property(cc.Label)
    public goldNumLabel: cc.Label = null;

    @property(cc.Node)
    public goldSpineNode: cc.Node = null;

    @property(sp.SkeletonData)
    private spineData: sp.SkeletonData;

    // private spineData: sp.SkeletonData;

    constructor() {
        super();
    }

   
    onShow() {
        super.onShow();
        this.initData()
        this.addEventListener();
    }

    onExtra(goldNum:number){
        this.goldNumLabel.string = goldNum + ''
    }

    onHide() {
        super.onHide();
        this.removeEventListener();
    }

    public setGoldNum(goldNum: number){
        this.goldNumLabel.string = goldNum + ''
    }

    
    initData(){
        if(!this.goldSpineNode.active){
            this.goldSpineNode.active = true
            let spNode = this.goldSpineNode.getComponent(sp.Skeleton)
            spNode.skeletonData = this.spineData
            spNode.animation = '1'
        }
        
        this.confirmBtn.node.runAction(
            cc.fadeIn(1)
        )
        this.goldNumLabel.node.runAction(
            cc.fadeIn(1)
        )
    }

    closeWindow() {
        this.goldSpineNode.active = false
        this.confirmBtn.node.opacity = 0
        this.goldNumLabel.node.opacity = 0
        UIManager.instance.hidePanel(this);
    }

    addEventListener() {
        this.confirmBtn.node.on('click', this.closeWindow, this);
    }

    removeEventListener() {
        this.confirmBtn.node.off('click', this.closeWindow, this);
    }



  
}

