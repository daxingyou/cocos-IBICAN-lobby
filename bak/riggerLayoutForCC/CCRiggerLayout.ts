// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import CCTopContainer from "./CCTopContainer"
import CCLayoutGroupSpec from "./CCLayoutGroupSpec"
const { ccclass, property } = cc._decorator;

@ccclass
export default class CCRiggerLayout extends cc.Component {

    // @property(cc.Canvas)
    // canvas: cc.Canvas = null;

    @property([CCLayoutGroupSpec])
    groups: CCLayoutGroupSpec[] = [];

    @property
    designWidth:number = 0;

    @property
    designHeight:number = 0;

    public get defaultLayer(): riggerLayout.Group {
        return this.layoutLayer;
    }
    protected layoutLayer: riggerLayout.LayoutLayer;


    // protected layoutLayers:riggerLayout.Group[] = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}k

    public getLayoutLayerByName(name: string | number) {
        return this.layoutLayer.getElementByName(name);
    }

    start() {
        this.layoutLayer = new riggerLayout.LayoutLayer(new CCTopContainer(this));
        this.layoutLayer.name = "layout layer default"
        this.initGroups();
    }

    private initGroups() {
        // this.layoutLayers = [];
        for (let i = 0; i < this.groups.length; i++) {
            const element: CCLayoutGroupSpec = this.groups[i];
            if (rigger.utils.Utils.isNullOrEmpty(element.groupName) || rigger.utils.Utils.isNullOrUndefined(element.groupName)) {
                throw new Error("must have a group name for layout spec");
            }

            let group: riggerLayout.Group = new riggerLayout.Group();
            group.top = element.top;
            group.bottom = element.bottom;
            group.left = element.left;
            group.right = element.right;
            group.horizontalCenter = element.horizontalCenter;
            group.verticalCenter = element.verticalCenter;
            group.width = element.width;
            group.height = element.height;

            group.name = element.groupName;

            this.layoutLayer.addChild(group);
        }
    }

    // update (dt) {}
}
