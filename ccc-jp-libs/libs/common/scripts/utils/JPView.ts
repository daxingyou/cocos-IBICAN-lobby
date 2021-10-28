import JPMediator from "./JPMediator";
import CommonContext from "../CommonContext";

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
/**
 * 所有视图类的基类
 */
@riggerIOC.autoDispose
@ccclass
export default class JPView extends cc.Component implements riggerIOC.View {
    /**
     * 预初始化，在初始化之前调用
     */
    onPreInit(): void { }

    /**
     * 初始化
     */
    onInit(): void { }

    protected __extraArgs: any = null;
    /**
     * 
     * @param arg 
     */
    onExtra(arg: any): void { }

    /**
     * 显示出来时调用
     */
    onShow(): void { }

    onHide(): void { }

    onDispose(): void { }

    /**
     * 视图是否已经初始化完成
     */
    public get isInitialized(): boolean {
        return this.initWait && !this.initWait.isWaitting();
    }

    protected mediator: JPMediator;

    /**
     * 用于保证界面初始化完成
     */
    protected initWait: riggerIOC.SafeWaitable;

    constructor() {
        super();
        this.initWait = new riggerIOC.SafeWaitable();
        this.initWait.wait();
    }

    /**
     * 一般不需要重写这些回调
     */
    onLoad(): void {
        if (CommonContext) {
            this.injectMediator();
        }

        this.onPreInit();
        this.mediator && this.mediator.onPreInit();
    }

    start(): void {
        this.onInit();
        this.mediator && this.mediator.onInit();
        this.initWait.done();
        this.doEnable();
    }

    /**
     * 等界面初始化完成
     * 可以使用 await 等待
     */
    waitInit() {
        return this.initWait.wait();
    }

    onEnable(): void {
        if (this.initWait && this.initWait.isWaitting()) return;
        this.doEnable();
    }

    onDisable(): void {
        this.onHide();
        this.mediator && this.mediator.onHide();
    }

    /**
     * 由引擎调用
     */
    onDestroy(): void {
        // this.doOnDestryoy();
        this.doDestroy();
    }

    doDestroy(): void {
        this.realDestroy();
    }

    /**
     * 供DEBUG使用
     */
    doDestroyDebug(): void {
        try {
            let oldErr = riggerIOC.getDisposeError(this);
            if (oldErr) {
                throw new Error(`there has been a dispose error before destroy`)
            }
            this.realDestroy();
        } catch (error) {
            riggerIOC.setDisposeError(this, error);
        }
    }

    /**
     * 供riggerIOC使用
     */
    dispose(): void {
        // 只有在初始化后才会跑析构
        if(this.isInitialized){
            this.onDispose();
        }
        this.mMediationBinder = null;

        this.__extraArgs = null;
        this.initWait.dispose();
        this.initWait = null;
    }

    protected doEnable(): void {
        this.onExtra(this.__extraArgs);
        this.mediator && this.mediator.onExtra(this.__extraArgs);
        this.__extraArgs = null;

        // cc.log(`now on show in jpview`)
        this.onShow();
        this.mediator && this.mediator.onShow();
    }

    /**
     * 真正的析构逻辑
     */
    private realDestroy(): void {
        if (this.mediator) {
            this.mediator.dispose();
            this.mediator = null;
        }
        else {
            this.mMediationBinder.detach(this, this.mediator);
        }
    }

    private get mediationBinder(): riggerIOC.MediationBinder {
        if (!this.mMediationBinder) {
            this.mMediationBinder
                = (riggerIOC.InjectionBinder.instance.bind(CommonContext).getInstance() as CommonContext).getMediationBinder();
        }
        return this.mMediationBinder;
    }
    private mMediationBinder = null;

    private injectMediator() {
        if (!this.mediationBinder) return;
        // cc.log(`inject mediator in jp view:` + this.constructor)
        // 先尝试从自己开始注入
        let mediator: JPMediator = this.injectMediaotrRecursive(this.constructor);

        this.mediator = mediator;
    }

    private injectMediaotrRecursive(obj): JPMediator {
        let lastOne: boolean = obj == JPView;

        let mediator: JPMediator
            = <JPMediator>this.mediationBinder.createAndAttach(obj, this);
        if (mediator) return mediator;
        if (!lastOne) return this.injectMediaotrRecursive(obj.__proto__);
        return null;
    }

}
if (riggerIOC && riggerIOC.debug) {
    JPView.prototype.doDestroy = JPView.prototype.doDestroyDebug;
}