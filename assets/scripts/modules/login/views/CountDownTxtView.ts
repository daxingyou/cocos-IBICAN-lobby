import JPView from "../../../../libs/common/scripts/utils/JPView";

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
export default class CountDownTxtView extends JPView {
    constructor() {
        super();
    }

    onShow() {
        super.onShow();
        // this.node.getComponent(cc.Label).string = '';
    }

    onHide() {
        super.onHide();
    }



    get isShowTxt(): boolean {return this,this._isShowTxt;}
    set isShowTxt(v: boolean) {
        this._isShowTxt = v;
        if(v) {
            this.node.getComponent(cc.Label).string = this.leftTime + '';
        }
        else {
            this.node.getComponent(cc.Label).string = '';
        }
    }
    public _isShowTxt: boolean = true;


    private durationTime: number;
    private cb: riggerIOC.Handler;
    private isPlay: boolean = false;
    private startTime: number = 0;
    private leftTime: number = 0;
    /**
     * 开始倒计时
     * @param time 时间
     * @param cb 倒计时结束回调
     */
    play(time: number = 60, cb: riggerIOC.Handler = null) {
        this.isPlay = true;
        this.startTime = new Date().getTime();
        this.durationTime = this.leftTime = time;
        if(this.cb) this.cb.dispose();
        this.cb = cb;
        if(this.isShowTxt) {
            this.node.getComponent(cc.Label).string = time + '';
        }
        else {
            this.node.getComponent(cc.Label).string = '';
        }
        this.schedule(this.updateTime, 1);
    }

    private updateTime() {
        this.leftTime = this.durationTime - Math.floor((new Date().getTime() - this.startTime) / 1000) ; 
        if(this.leftTime > 0) {
            if(this.isShowTxt) {
                this.node.getComponent(cc.Label).string = this.leftTime + '';
            }
            else {
                this.node.getComponent(cc.Label).string = '';
            }
        }
        else {
            this.node.getComponent(cc.Label).string = '';
            this.end();
        }
    }

    private end() {
        this.unschedule(this.updateTime);
        this.cb && this.cb.run();
        this.reset();
    }

    /**
     * 立即结束倒计时
     * @param runCb 是否执行回调
     */
    stopImmediately(runCb: boolean) {
        this.unschedule(this.updateTime);
        if(runCb) {
            this.cb && this.cb.run();
        }
        this.reset();
    }

    reset() {
        this.leftTime = 0;
        this.startTime = 0;
        this.durationTime = 0;
        this.isPlay = false;
        this.cb.dispose();
        this.cb = null;
    }
}
