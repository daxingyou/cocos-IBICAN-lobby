// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import CCLayoutGroupSpec from "./CCLayoutGroupSpec"
import CCRiggerLayoutSpec from "./CCRiggerLayoutSpec";
import CCRiggerLayout from "./CCRiggerLayout";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CCRiggerLayoutComp extends cc.Component {

    @property(CCRiggerLayoutSpec)
    spec: CCRiggerLayoutSpec = null;

    @property(CCRiggerLayout)
    layout: CCRiggerLayout = null;

    private group:riggerLayout.Group;

    // @property
    // isAuto: boolean = false;



    start() {
        this.node.name = "test_button"
        this.group = new riggerLayout.Group(this.node);
        this.group.name = "test_button_group"
        // this.group.addChild(this.node);
        this.group.top = this.spec.top;
        this.group.bottom = this.spec.bottom;
        this.group.left = this.spec.left;
        this.group.right = this.spec.right;
        this.group.horizontalCenter = this.spec.horizontalCenter;
        this.group.verticalCenter = this.spec.verticalCenter;
        this.group.width = this.spec.width;
        this.group.height = this.spec.height;

        this.layout.defaultLayer.addChild(this.group);
    }

    // update (dt) {}
}
