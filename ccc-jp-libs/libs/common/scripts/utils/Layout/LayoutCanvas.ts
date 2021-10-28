import LayoutBg from "./LayoutBg";
import LayoutContent from "./LayoutContent";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property, executionOrder} = cc._decorator;

@ccclass
@executionOrder(1)
export default class LayoutCanvas extends cc.Component {
    @property
    private landscapeGame: boolean = true;

    @property
    private portraitGame: boolean = true;

    @property({type:cc.size})
    private _landscapeDesignResolution: cc.Size = cc.size(1334, 750);

    @property({type:cc.size})
    get landscapeDesignResolution(): cc.Size {
        return this._landscapeDesignResolution;
    }
    set landscapeDesignResolution(value: cc.Size) {
        this._landscapeDesignResolution = value;
        value && this.resizeCanvas();
    }

    @property({type:cc.size})
    private _portraitDesignResolution: cc.Size = cc.size(750, 1334);

    @property({type:cc.size})
    get portraitDesignResolution(): cc.Size {
        return this._portraitDesignResolution;
    }
    set portraitDesignResolution(value: cc.Size) {
        this._portraitDesignResolution = value;
        value && this.resizeCanvas();
    }

    @property(LayoutBg)
    public bgAdaptive: LayoutBg = null;

    @property([LayoutContent])
    public contentAdaptive: LayoutContent[] = [];

    private isStart: boolean = false;
    onLoad() {
        cc.log(`layout onLoad`);
        this.isStart = true;
    }

    start() {
        cc.log(`layout start`);
        this.resizeCanvas();
        this.updateLayout();
        cc.view['on']('canvas-resize', this.onResize, this);
    }

    onDestroy() {
        cc.view['off']('canvas-resize', this.onResize, this);
    }

    onResize() {
        this.resizeCanvas();
        this.updateLayout();
    }

    /**调整canvas */
    resizeCanvas() {
        if(!this.isStart) return;
        cc.log(`canvas-resize`);
        //showAll
        this.node.getComponent(cc.Canvas).fitWidth = true;
        this.node.getComponent(cc.Canvas).fitHeight = true; 

        if(this.landscapeGame != this.portraitGame) {
            if(this.landscapeGame) {
                this.node.getComponent(cc.Canvas).designResolution = cc.size(this.landscapeDesignResolution.width, this.landscapeDesignResolution.height);
            }
            else {
                this.node.getComponent(cc.Canvas).designResolution = cc.size(this.portraitDesignResolution.width, this.portraitDesignResolution.height);
            }
        }
        else if(this.landscapeGame == this.portraitGame && this.landscapeGame) {
            if(cc.view.getFrameSize().width >= cc.view.getFrameSize().height) {
                this.node.getComponent(cc.Canvas).designResolution = cc.size(this.landscapeDesignResolution.width, this.landscapeDesignResolution.height);
            }
            else {
                this.node.getComponent(cc.Canvas).designResolution = cc.size(this.portraitDesignResolution.width, this.portraitDesignResolution.height);
            }
        }
        else {
            cc.log(`landscapr == portrait == false`);
        }
    }

    /**适配前 */
    beforeLayout() {
        if(this.bgAdaptive && this.bgAdaptive.beforeLayout) {
            this.bgAdaptive.beforeLayout();
        }

        this.contentAdaptive && this.contentAdaptive.forEach((item, idx) => {
            if(item && item.beforeLayout) {
                item.beforeLayout();
            }
        });
    }

    /**适配 */
    async updateLayout() {
        this.beforeLayout();

        this.bgAdaptive && this.bgAdaptive.layout();
        this.contentAdaptive && this.contentAdaptive.forEach((item, idx) => {
            item && item.layout();
        });

        this.afterLayout();
    }

    /**适配后 */
    afterLayout() {
        if(this.bgAdaptive && this.bgAdaptive.afterLayout) {
            this.bgAdaptive.afterLayout();
        }

        this.contentAdaptive && this.contentAdaptive.forEach((item, idx) => {
            if(item && item.afterLayout) {
                item.afterLayout();
            }
        });
    }
}
