import LinearLayout from "./LinearLayout";
import AsyncList from "./AsyncList";

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
export default class LinearLayoutComponent extends cc.Component {

    @property
    public spaceX: number = 0;

    @property
    public spaceY: number = 0;

    @property
    public row: number = 0;

    @property
    public col: number = 0;

    @property(AsyncList)
    public list: AsyncList = null;

    private layout: LinearLayout;

    onLoad() {
        if (!this.layout) {
            this.layout = new LinearLayout();
            this.layout.col = this.col;
            this.layout.row = this.row;
            this.layout.spaceX = this.spaceX;
            this.layout.spaceY = this.spaceY;
        }

        if (this.list) {
            this.list.setLayout(this.layout);
        }
    }

    // start() {

    // }
}
