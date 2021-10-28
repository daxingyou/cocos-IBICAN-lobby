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
export default class Dragable extends cc.Component {
    private isTouching: boolean = false;
    onLoad(): void {
        this.isTouching = false;
        let node: cc.Node = this.node;
        node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        // node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);

    }

    private onTouchStart(): void {
        this.isTouching = true;
    }

    private onTouchEnd(): void {
        this.isTouching = false;
    }

    private onTouchMove(event): void {
        if(!this.isTouching) return;
        let delta = event.getDelta();
        this.node.x += delta.x;
        this.node.y += delta.y;
    }

    private onClick():void{
        cc.log(`clicked dragable`);
    }
}
