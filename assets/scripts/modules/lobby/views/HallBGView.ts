import JPView from "../../../../libs/common/scripts/utils/JPView";
import ArrowPage, { ArrowType } from "../../../../libs/common/scripts/utils/arrow/ArrowPage";
import { SubGameType } from "../../subGames/models/SubGamesModel";

/* *
    大厅背景
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class HallBGView extends JPView {

    @property([cc.SpriteFrame])
    public frames: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    public topFrames: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    public pageTitles: cc.SpriteFrame[] = [];

    @property(cc.Node)
    public gameBg: cc.Node = null;

    // @property(ArrowPage)
    // public arrowRight:ArrowPage;

    // @property(ArrowPage)
    // public arrowLeft:ArrowPage;

    @property(cc.Button)
    public backBtn: cc.Button = null;

    @property(cc.Integer)
    public arrowRightEndX: number = 0;

    @property(cc.Integer)
    public arrowLeftEndX: number = 0;

    public constructor() {
        super();
    }
    public onInit(): void {
        // this.init();
    }

    public onDispose(): void {
        // this.backBtn.node.off( "click",this.onBack,this );
    }

    onShow() {
        this.init();
    }

    onHide() {
        this.backBtn.node.off("click", this.onBack, this);
    }

    public switchBG(type: SubGameType): void {
        // this.arrowRight.visible = false;
        // this.arrowLeft.visible = false;
        let index: number = -1;
        switch (type) {
            case SubGameType.SLOT:
                index = 2;
                break;
            case SubGameType.ARCADE:
                index = 1;
                break;
            default:
                index = 0;
                break;
        }
        this.currentIndex = index;
        this.changeShow(index);
    }

    public set totlePage(value: number) {
        // this.arrowRight.totlePage = value;
        // this.arrowLeft.totlePage = value;
    }

    public get totlePage(): number {
        return 0;
        // return this.arrowRight.totlePage;
    }

    public get curPage(): number {
        return 0;
        // return this.arrowRight.curPage;
    }
    public set curPage(value: number) {
        // this.arrowRight.curPage = value;
        // this.arrowLeft.curPage = value;
    }

    private currentIndex: number = 0;
    private init(): void {
        // this.arrowRight.visible = false;
        // this.arrowLeft.visible = false;
        // this.arrowRight.reset();
        // this.arrowLeft.reset();
        // this.backBtn.node.active = false;
        this.changeShow(this.currentIndex);
    }

    private changeShow(index: number): void {
        this.gameBg.getComponent(cc.Sprite).spriteFrame = this.frames[index];
        // this.gameBg.getComponent( 'BGView' ).resize();
        this.node.getChildByName("topBG").getComponent(cc.Sprite).spriteFrame = this.topFrames[index];
        this.node.getChildByName("pageTitle").getComponent(cc.Sprite).spriteFrame = this.pageTitles[index] ? this.pageTitles[index] : null;
        this.backBtn.node.active = index > 0;
        if (this.backBtn.node.active) {
            this.backBtn.node.on("click", this.onBack, this);
        } else {
            this.backBtn.node.off("click", this.onBack, this);
        }
    }

    private play(target: cc.Node, pos: number): void {
        target.active = true;
        this.backBtn.node.active = true;
        // target.x = target.x < 0 ? -1 * 1000 : 1000;
        // let s = cc.moveTo(0.2, pos, target.y).easing(cc.easeCubicActionOut());
        // target.runAction(s);
        target.x = pos;
    }

    private onBack(): void {
        // this.init();
        this.currentIndex = 0;
        this.changeShow(0);
    }
}