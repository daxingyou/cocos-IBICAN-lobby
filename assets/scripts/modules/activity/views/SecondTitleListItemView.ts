import JPView from "../../../../libs/common/scripts/utils/JPView";
import { Activity, Notice } from "../../../protocol/protocols/protocols";

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
export default class SecondTitleListItemView extends JPView {
    // @property(cc.Label)
    // public secondTitle: cc.Label = null; 

    @property(cc.Node)
    public redDotNode: cc.Node = null;

    @property(cc.RichText)
    public secondTitle: cc.RichText = null;

    constructor() {
        super(); 
    }

    /**
     * 活动|公告id
     */
    public id: number;

    /**
     * 列表索引
     */
    public index: number;

    /**
     * 红点注册名
     */
    public redDotRegistrName: string;

    /**
     * 是否已读
     */
    public hasRead: boolean;

    /**
     * 数据
     */
    public data: Activity | Notice;

    /**
     * 初始化二级标签
     * @param title 
     * @param id 
     */
    init(title: string, id: number) {
        let str: string[] = [];
        if(title.length > 6) {
            str.push(title.substring(0, 6));
            str.push(title.substring(6, title.length));
        }
        else {
            str.push(title);
        }
        if(str.length == 2) {
            this.secondTitle.string = `<b>${str[0]}</b><br/><b>${str[1]}</b>`;
        }
        else {
            this.secondTitle.string = `<b>${str[0]}</b>`;
        }
        if(title.length >= 6) this.secondTitle.horizontalAlign = cc.macro.TextAlignment.LEFT
        else this.secondTitle.horizontalAlign = cc.macro.TextAlignment.CENTER
        this.id = id;
        this.node.on('toggle', this.onToggleChanged, this);
    }

    showRedDot() {
        this.redDotNode.active = true;
        this.hasRead = false;
    }

    hideRedDot() {
        this.redDotNode.active = false;
        this.hasRead = true;
    }

    async onToggleChanged(toggle: cc.Toggle) {
        await riggerIOC.waitForNextFrame();
        if(toggle.isChecked) {
            this.secondTitle.node.color = cc.color(58,31,8)
        }
        else {
            this.secondTitle.node.color = cc.color(204,203,203)
        }
    }

    onDispose() {
        super.onDispose();
        this.node.off('toggle', this.onToggleChanged);
    }
}
