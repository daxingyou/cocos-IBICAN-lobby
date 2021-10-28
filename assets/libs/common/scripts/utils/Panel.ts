// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import LayerManager, { Layer } from "./LayerManager"
import JPView from "./JPView";
import AssetsUtils from "./AssetsUtils";
// import UIUtils from "./UIUtils";
// import UIManager from "./UIManager";

@ccclass
export default class Panel extends JPView {
    /**
     * 面板的绑存池
     */
    public static get pool(): riggerIOC.Pool {
        if (!Panel.mPool) {
            Panel.mPool = new riggerIOC.Pool();
        }

        return Panel.mPool;
    }
    private static mPool: riggerIOC.Pool = null

    public static disposePool(): void {
        if (!this.mPool) return;
        this.mPool.forEach(e => e.destroy());
        this.mPool.dispose();
        this.mPool = null;
    }

    /**
     * 是否需要缓存，如果设置为true,则当面板被关闭时，面板会被回收至对象池
     */
    @property
    public needCache: boolean = true;

    /**
     * 面板显示时，是否需要遮挡住其后的界面
     */
    @property
    public needBlockOther: boolean = true;

    /**
     * 面板显示时，是否阻止键盘响应
     */
    @property
    public needBlockKeyboard: boolean = false;

    /**
     * 是否需要启用弹出效果
     */
    @property
    public needPopup: boolean = true;

    /**
     * 显示时是否会关闭同层的其它Panel,默认为true
     */
    @property
    public closeOther: boolean = true;

    /**
     * 忽略"closeOther"
     * 具有此标志的面板不会被打开的其它面板自动关闭
     */
    @property
    public ignoreCloseOther: boolean = false;


    /**
     * 资源路径
     */
    public resPath: string = null;

    protected __mInitScaleX: number;
    protected __mInitScaleY: number;

    private static get showingPanelMap(): { [path: string]: Panel[] } {
        if (!Panel.mShowingPanelMap) Panel.mShowingPanelMap = {};
        return Panel.mShowingPanelMap;
    }
    private static mShowingPanelMap: { [path: string]: Panel[] };


    constructor() {
        super();
    }

    /**
     * 显示窗口，一般不需要用户自己直接调用
     * @param layerOrNameOrId 
     * @param extraArgs 
     */
    show(layerOrNameOrId: number | string | Layer, extraArgs?: any) {
        if (!this.node) throw new Error("panel should have a node to be shown");
        this.__extraArgs = extraArgs;

        // 添加到显示列表
        LayerManager.addToLayer(this.node, layerOrNameOrId);
        Panel.register(this);
    }

    /**
     * 隐藏窗口
     * 用户一般不要直接调用此接口
     */
    hide() {
        Panel.unRegister(this);
        if (!this.node) return;
        // 移除
        if (!this.node.parent) return;
        if (this.needCache) {
            this.node.parent.removeChild(this.node, false);
            Panel.pool.recover(this.resPath, this.node)
        }
        else {
            this.node.parent.removeChild(this.node, true);
            this.node.destroy();
        }
    }

    start() {
        this.__mInitScaleX = this.node.scaleX;
        this.__mInitScaleY = this.node.scaleY;
        super.start();
    }

    // async onEnable() {
       
    //     if (this.needPopup) {
    //         this.node.opacity = 0;
    //     }
    //     await super.onEnable();
    //     await this.waitInit();
    //     // cc.log("panel on enable after init")
    //     // await riggerIOC.waitForSeconds(1000);
    //     if (this.needPopup) {
    //         if (this.node.opacity == 0) this.node.opacity = oldOpacity;
    //         this.popup();
    //     }
    // }

    onDestroy(): void {
        this.resPath = null;
        super.onDestroy();
    }

    protected doEnable(): void{
        super.doEnable();
        let oldOpacity = this.node.opacity;
        if (this.needPopup) {
            this.node.opacity = 0;
        }
        if (this.needPopup) {
            if (this.node.opacity == 0) this.node.opacity = oldOpacity;
            this.popup();
        }
    }

    // protected popAction: cc.ActionInterval = cc.scaleTo(0.4, 1, 1).easing(cc.easeBackInOut());
    protected popup(): void {
        if (!this.needPopup) return;
        // let sx: number = this.node.scaleX;
        // let sy: number = this.node.scaleY;

        this.node.scale = 0;
        // cc.log(`pop sx:${sx}, sy:${sy}`)
        // cc.tween(this.node).to(0.4, { scale: 1.2}, cc.easeBackInOut).start()
        let s = cc.scaleTo(0.4, this.__mInitScaleX, this.__mInitScaleY).easing(cc.easeBackInOut());
        this.node.runAction(s);
        // this.node.stopAction()
    }

    private static register(panel: Panel): void {
        let old: Panel[] = Panel.showingPanelMap[panel.resPath] || [];
        old.push(panel);
        Panel.showingPanelMap[panel.resPath] = old;
    }

    private static unRegister(panel: Panel): void {
        let old: Panel[] = Panel.showingPanelMap[panel.resPath] || [];
        old = old.filter((v, idx, arr) => v !== panel);
        Panel.showingPanelMap[panel.resPath] = old;
    }

    /**
     * 获取一个指定类型的面板（已经显示出来的)
     * @param panelClass 
     */
    public static getPanel(panelClass: { new(): Panel }): Panel | null {
        // 获取真实类
        let bindInfo: riggerIOC.InjectionBindInfo = riggerIOC.InjectionBinder.instance.bind(panelClass);
        let path: string = AssetsUtils.getResoucePath(bindInfo.realClass);
        let panels: Panel[] = Panel.showingPanelMap[path];
        if (panels && panels.length > 0) return panels.shift();
        return null;
    }
}
