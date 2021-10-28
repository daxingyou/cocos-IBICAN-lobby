import IAsyncListLayout from "./IAsyncListLayout";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class LinearLayout implements IAsyncListLayout {
    public spaceX: number = 0;
    public spaceY: number = 0;
    public row: number = 0;
    public col: number = 0;

    private startX: number = 0;
    private startY: number = 0;

    layout(node: cc.Node, index: number): void {
        if (this.row > 0) {
            this.layoutByRow(node, index);
        }
        else if (this.col > 0) {
            this.layoutByCol(node, index);
        }
        else {
            cc.warn("no invalid row or col to reposition for AsyncList");
        }
    }

    layoutByRow(node: cc.Node, index: number): void {
        let nowRowIndex: number = Math.floor(index / this.row);
        let nowColIndex:number = index % this.row;
        node.x = this.startX + this.spaceX * nowRowIndex;
        node.y = this.startY + this.spaceY * nowColIndex;
    }

    layoutByCol(node: cc.Node, index: number): void {
        // 当前项所在行索引
        let nowRowIndex: number = Math.floor(index / this.col);
        // 当前项所在列索引
        let nowColIndex: number = index % this.col;
        // cc.log(`nowNum:${index}, specified col:${this.col}, row:${nowRowIndex}, col:${nowColIndex}`)
        node.x = this.startX + this.spaceX * nowColIndex;
        node.y = this.startY + this.spaceY * nowRowIndex;
    }
}
