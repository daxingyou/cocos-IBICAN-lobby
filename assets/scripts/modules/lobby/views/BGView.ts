import JPView from "../../../../libs/common/scripts/utils/JPView";
const {ccclass, property} = cc._decorator;

@ccclass
export default class BGView extends JPView {
    onLoad () {
        super.onLoad();
        this.resize();
    }

    public resize():void{
        this.node.width = cc.find('Canvas').getComponent(cc.Canvas).designResolution.width;
        this.node.height = cc.find('Canvas').getComponent(cc.Canvas).designResolution.height;

        // this.node.scale = Math.max(cc.view.getCanvasSize().width / this.node.width, cc.view.getCanvasSize().height / this.node.height);
        // 1. 先找到 SHOW_ALL 模式适配之后，本节点的实际宽高以及初始缩放值
        let srcScaleForShowAll = Math.min(cc.view.getCanvasSize().width / this.node.width, cc.view.getCanvasSize().height / this.node.height);
        let realWidth = this.node.width * srcScaleForShowAll;
        let realHeight = this.node.height * srcScaleForShowAll;

        // 2. 基于第一步的数据，再做缩放适配
        this.node.scale = Math.max(cc.view.getCanvasSize().width / realWidth, cc.view.getCanvasSize().height / realHeight);
    }
}
