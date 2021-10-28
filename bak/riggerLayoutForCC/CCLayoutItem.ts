// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// const {ccclass, property} = cc._decorator;

// @ccclass
export default class CCLayoutItem extends riggerLayout.LayoutItem<cc.Node> {
    public get itemX(): number {
        return this.item.position.x;
    }
    public set itemX(v: number) {
        this.item.position.x = v;
    }

    public get itemY(): number {
        return this.item.position.y;
    }
    public set itemY(v: number) {
        this.item.position.y = v;
    }

    public get itemWidth(): number {
        return this.item.width;
    }
    public set itemWidth(v: number) {
        this.item.width = v;
    }

    public get itemHeight(): number {
        return this.item.height;
    }
    public set itemHeight(v: number) {
        this.item.height = v;
    }

    public get itemScaleX(): number {
        return this.item.scaleX
    }
    public set itemScaleX(v: number) {
        this.item.scaleX = v;
    }

    public get itemScaleY(): number {
        return this.item.scaleY;
    }
    public set itemScaleY(v: number) {
        this.item.scaleY = v;
    }

    public get itemPivotX(): number {
        return this.item.anchorX;
    }
    public set itemPivotX(v: number) {
        this.item.anchorX = v;
    }

    public get itemPivotY(): number {
        return this.item.anchorY;
    }
    public set itemPivotY(v: number) {
        this.item.anchorY = v;
    }

    constructor(item: cc.Node) {
        super(item);
    }

}
