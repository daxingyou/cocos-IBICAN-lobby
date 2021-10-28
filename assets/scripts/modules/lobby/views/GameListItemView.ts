import JPView from "../../../../libs/common/scripts/utils/JPView";
import SubGameEntity, { GameState } from "../../subGames/models/SubGameEntity";
import JPSprite from "../../../../libs/common/scripts/utils/JPSprite";
import Task from "../../../../libs/common/scripts/utils/Task";
import { throws } from "assert";

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
export default class GameListItemView extends JPView {
    @property(cc.Node)
    public newFlag: cc.Node = null;

    @property(cc.Node)
    public updateFlag: cc.Node = null;

    @property(cc.Node)
    public comingFlag: cc.Node = null;

    @property(cc.Node)
    public hotFlag: cc.Node = null;

    @property(cc.Node)
    public maintanceFlag: cc.Node = null;

    @property(cc.Node)
    public downLoadFlag: cc.Node = null;

    @property(cc.ProgressBar)
    public progressBar: cc.ProgressBar = null;

    @property(JPSprite)
    public icon: JPSprite = null;

    @property(cc.Button)
    public btn: cc.Button = null;

    @property(cc.Label)
    public proLabel: cc.Label = null;

    // @property(cc.Animation)
    // public hotClip: cc.Animation = null;

    @property(cc.Animation)
    public loading: cc.Animation = null;

    private clickListener: riggerIOC.ListenerManager;

    protected _inited: boolean = false;

    /**
     * 
     */
    public get info(): SubGameEntity {
        return this.mInfo;
    }
    private mInfo: SubGameEntity = null;

    onInit(): void {
        this._inited = true;

        this.resetFlags();
    }

    onShow(): void {
        this.updateData();
        this.btn.node.on(cc.Node.EventType.TOUCH_END, this.onClickSelf, this);
        // this.btn.node.active = false;
        if (this.loading) {
            let clipState: cc.AnimationState = this.loading.play("loadClip");
            clipState.wrapMode = cc.WrapMode.Loop;
        }
        // 检查是否在更新
        this.updateProgress(true);
    }

    play(): void {
        this.btn.node.position = new cc.Vec2(1000, 0);
        let s = cc.moveTo(0.4, 0, 0).easing(cc.easeCubicActionOut());
        this.btn.node.runAction(s);
    }

    onHide(): void {
        this.removeUpdateListener();
        this.btn.node.off(cc.Node.EventType.TOUCH_END, this.onClickSelf, this);
        if (this.loading) {
            this.loading.stop("loadClip");
        }
        // this.btn.node.position = new cc.Vec2(1000, 0);
        if (this.clickListener) {
            this.clickListener.dispose();
            this.clickListener = null;
        }
        this.mInfo = null;
        this.icon.spriteFrame = null;
        this.icon.node.off('loadComplete', this.onLoadIconComplete, this);

    }

    onDispose(): void {
        // this.btn.node.off(cc.Node.EventType.TOUCH_END, this.onClickSelf, this);

        // this.clickListener.dispose();
        // this.clickListener = null;
        // this.mInfo = null;
    }



    setData(info: SubGameEntity): void {
        this.mInfo = info;
        // this.updateData();
        this.updateProgress();
    }

    public startUpdate(): void {
        if (!this.info) return;
        if (!this.info.updateTask) return;
        this.addUpdateListener();
    }

    private addUpdateListener(): void {
        if (!this.info) return;
        if (!this.info.updateTask) return;

        this.info.updateTask.onProgreess(this, this.onProgress);
        this.info.updateTask.onComplete(this, this.onTaskComplete);
        this.info.updateTask.onCancel(this, this.onError);
    }

    private removeUpdateListener(): void {
        if (!this.info) return;
        if (!this.info.updateTask) return;

        this.info.updateTask.offProgreess(this, this.onProgress);
        this.info.updateTask.offComplete(this, this.onTaskComplete);
        this.info.updateTask.offCancel(this, this.onError);
    }

    public updateProgress(needListener: boolean = false): void {
        if (!this.info) return;
        if (!this._inited) return;

        let info: SubGameEntity = this.mInfo;
        let isUpdating: boolean = info.isUpdating;
        this.downLoadFlag.active = isUpdating;//( !info.isLatest && !info.isNew ) || ( info.isUpdating );
        if (!this.info.updateTask || this.info.updateTask == undefined) return;
        if (needListener) this.addUpdateListener();
        let progress: number = this.info.updateTask.progress;
        this.progressBar.node.active = isUpdating;
        this.progressBar.progress = progress;
        if (this.proLabel) {
            this.proLabel.string = `${(progress * 100).toFixed(0)}%`;
        }
    }

    onClick(caller, callbacks, args?): void {
        this.initListener();
        this.clickListener.on(caller, callbacks, args);
    }

    offClick(caller, callbacks): void {
        this.initListener();
        this.clickListener.off(caller, callbacks);
    }

    private onProgress(task: Task): void {
        this.updateProgress();
    }

    private onError(task: Task): void {
        this.updateProgress();
        this.removeUpdateListener();
    }

    private onTaskComplete(): void {
        this.updateProgress();
        this.updateFlags();
        this.removeUpdateListener();
    }

    protected resetFlags(): void {

        this.updateFlag.active
            = this.comingFlag.active
            = this.maintanceFlag.active
            = this.downLoadFlag.active
            = this.progressBar.node.active = false;
        if (this.newFlag) {
            this.newFlag.active = false;
        }
        // if (this.hotNode && this.hotClip) {
        //     this.hotClip.stop("hotClip");
        //     this.hotNode.active = false;
        // }
        if(this.hotFlag) {
            this.hotFlag.active = false;
        }

    }

    protected updateData(): void {
        if (!this._inited) return;
        if (!this.mInfo) return;
        this.resetFlags();
        this.icon.node.on('loadComplete', this.onLoadIconComplete, this);
        this.icon.url = this.mInfo.iconUrl;
    }

    protected onLoadIconComplete(): void {
        this.icon.node.off('loadComplete', this.onLoadIconComplete, this);
        this.btn.node.active = true;
        if (this.loading) {
            this.loading.stop("loadClip");
            this.loading.node.active = false;
        }
        this.updateFlags();
    }

    protected updateFlags(): void {
        this.resetFlags();

        let info: SubGameEntity = this.mInfo;
        //敬请期待>维护>更新>热门>new       
        // 敬请期待
        if (rigger.utils.Utils.isNullOrEmpty(info.downloadUrl)) {
            this.comingFlag.active = true;
            return;
        }

        // 维护
        let isMaintain: boolean = info.status == GameState.MAINTAIN || info.status == GameState.CLOSE;
        if (isMaintain) {
            this.maintanceFlag.active = true;
            return;
        }

        // 更新
        if(!info.isLatest){
            this.updateFlag.active = true;
            return;
        }

        // 热门
        if(info.isHot){
            // if (this.hotNode && this.hotClip) {
            //     this.hotNode.active = true;
            //     let clipState: cc.AnimationState = this.hotClip.play("hotClip");
            //     clipState.wrapMode = cc.WrapMode.Loop;
            // }
            if (this.hotFlag) {
                this.hotFlag.active = true;
                // let clipState: cc.AnimationState = this.hotClip.play("hotClip");
                // clipState.wrapMode = cc.WrapMode.Loop;
            }
            return;
        }

        if(info.isNew && this.newFlag){
            this.newFlag.active = true;
            return;
        }
    }

    private initListener(): void {
        if (!this.clickListener) this.clickListener = new riggerIOC.ListenerManager();
    }

    private onClickSelf(): void {
        cc.log(`in game list item , click self`)
        this.clickListener && this.clickListener.execute(this);
    }
}
