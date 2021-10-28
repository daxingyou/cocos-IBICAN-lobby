import Dragable from "../Dragable";
import DiagnoseUtils, { SubGameChecker, ProjStarter } from "../DiagnoseUtils";
import PersistRootNode from "../PersistRootNode";
import Constants from "../../Constants";

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
enum AnalyzeStep {
    Running = 1,
    Stopped = 2,
}

@ccclass
export default class JPTools extends cc.Component {
    // private mainBtn: cc.Button;
    private analyzeBtn: cc.Button;
    private stopBtn: cc.Button;
    private startBtn: cc.Button;

    private nowStep: AnalyzeStep = AnalyzeStep.Running;

    onLoad() {
        this.node.addComponent(PersistRootNode);
        let dragable = this.node.getComponent(Dragable);
        // 确保自己可以被拖动
        if (!dragable) this.node.addComponent(Dragable);

        // this.mainBtn = this.node.getChildByName("mainBtn").getComponent(cc.Button);
        this.analyzeBtn = this.node.getChildByName("analyzeBtn").getComponent(cc.Button);
        this.stopBtn = this.node.getChildByName("stopBtn").getComponent(cc.Button);
        this.startBtn = this.node.getChildByName("startBtn").getComponent(cc.Button);
        this.addEventListener();

        this.updateBtnStatus();

    }

    private addEventListener(): void {
        this.analyzeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickAnalyzeBtn, this);
        this.startBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickStartBtn, this);
        this.stopBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClickStopBtn, this);
    }

    private onClickMainBtn(): void {

    }

    private get checker(): SubGameChecker {
        if (!this.mChecker) this.mChecker = DiagnoseUtils.initChecker();
        return this.mChecker;
    }
    private mChecker: SubGameChecker = null;

    private get application(): riggerIOC.ApplicationContext {
        if (!this.mApplication) this.mApplication = this.checker.getApplication();
        return this.mApplication;
    }
    private mApplication: riggerIOC.ApplicationContext;

    private starter: ProjStarter = null;

    private onClickAnalyzeBtn(): void {
        let [baseCheckStr, baseCheckParams]  = this.checker.checkBase();
        let anaRet: riggerIOC.AnalyseResult = this.application.analyser.analyze();
        let analyzeStr: string = anaRet.analyseReport;
        let [anaResStr, anaResParams] = this.makeInjectionAnalyzeResultStr(anaRet);
        let ret: string = "%c" + baseCheckStr + anaResStr + analyzeStr;
        baseCheckParams = ["background-color:cyan"].concat(baseCheckParams, anaResParams);
        cc.log(ret, ...baseCheckParams);
    }

    private onClickStartBtn(): void {
        if (this.nowStep !== AnalyzeStep.Stopped) return;
        this.nowStep = AnalyzeStep.Running;
        this.updateBtnStatus();
        this.mApplication = null;
        this.starter.start();
        this.starter = null;
    }

    private onClickStopBtn(): void {
        if (this.nowStep !== AnalyzeStep.Running) return;
        this.nowStep = AnalyzeStep.Stopped;
        this.updateBtnStatus();
        this.application;
        this.starter = this.checker.checkRestart();
    }

    private updateBtnStatus(): void {
        this.startBtn.interactable = this.nowStep == AnalyzeStep.Stopped;
        this.stopBtn.interactable = this.nowStep == AnalyzeStep.Running;
    }

    private makeInjectionAnalyzeResultStr(ret: riggerIOC.AnalyseResult): [string, string[]] {
        let style:string = `font-weight:bold;background-color:yellow`;
        let defaultStyle: string = "color:black;font-weight:no;background-color:cyan";
        let okStyle: string = `color:green;${style}`;
        let failedStyle: string = `color:red;${style}`;
        let str = "";
        let params: string[] = [];
        let checkRet: boolean = this.makeStickInstsCheckRet(ret.stickInsts);
        // 释放检查
        str += `析构检查:${ret.stickInsts.length} ====> %c${checkRet ? "ok" : "failed"}%c`
        checkRet ? params.push(okStyle) : params.push(failedStyle);
        params.push(defaultStyle);

        let len = ret.instsWithInjectionError.length;
        str += `\r\n注入错误检查:${len} ====> %c${len <= 0 ? "ok" :  "failed"}%c`;
        len <= 0 ? params.push(okStyle) : params.push(failedStyle);
        params.push(defaultStyle);

        len  = ret.instsWithDisposeError.length;
        str += `\r\n析构错误检查:${len} ====> %c${len <= 0 ? "ok" : "failed"}%c\r\n`;
        len <= 0 ? params.push(okStyle) : params.push(failedStyle);
        params.push(defaultStyle);

        return [str, params];

    }

    private makeStickInstsCheckRet(insts: riggerIOC.InjectionTrack[]): boolean {
        if (insts.length <= 0) return true;
        if (insts.length == 1) return insts[0].inst instanceof Constants;
        return false;
    }
}
