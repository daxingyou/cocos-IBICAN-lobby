import SubGameExitSignal from "../signals/SubGameExitSignal";
import SubGameReadySignal from "../signals/SubGameReadySignal";
import ReportViewCloseSignal from "../signals/ReportViewCloseSignal";
import ReportViewOpenSignal from "../signals/ReportViewOpenSignal";
import { reportParams } from "../../../../libs/common/scripts/CommonContext";
import { SubGameId } from "../models/SubGameEntity";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 子游戏命令执行器
 */
export default class SubGameCommandEexcuter {
    @riggerIOC.inject(SubGameExitSignal)
    private exitSignal: SubGameExitSignal;
    @riggerIOC.inject(SubGameReadySignal)
    private readySignal: SubGameReadySignal;

    @riggerIOC.inject(ReportViewOpenSignal)
    private reportViewOpenSignal: ReportViewOpenSignal;

    @riggerIOC.inject(ReportViewCloseSignal)
    private reportViewCloseSignal: ReportViewCloseSignal;

    private readonly protocol: string = "jplobby";
    public init(webview: cc.WebView, reportWebView: cc.WebView) {
        webview.setJavascriptInterfaceScheme(this.protocol);
        webview.setOnJSCallback((target, url) => this.onWebViewCallBack(target, url, webview));

        //报表
        reportWebView.setJavascriptInterfaceScheme(this.protocol);
        reportWebView.setOnJSCallback((target, url) => this.onReportWebViewCallBack(target, url, webview));
    }

    private owner: SubGameId;
    public bind(subGameId: SubGameId): void {
        this.owner = subGameId;
    }

    public getOwner(): SubGameId {
        return this.owner;
    }

    private onReportWebViewCallBack(target, url, webview) {
        var str = url.replace(this.protocol + '://', '');
        var cmd = str.replace("cmd=", "");
        cc.log("cmd:" + cmd);
        switch (cmd) {
            case "goback":
                this.handlerReportViewCloseCommand();
                cc.log(`goback`);
                break;
            default:
                break;
        }
    }

    private onWebViewCallBack(target, url, webview) {
        var str = url.replace(this.protocol + '://', '');
        var cmd: string = str.replace("cmd=", "");
        cc.log("cmd:" + cmd);
        if (cmd.indexOf('openReport') != -1) {
            var reportUrl = cmd.replace("openReport//url=", '');
            cmd = "openReport";
            cc.log(`reportUrl: ${reportUrl}`);
        }
        switch (cmd) {
            case "exit":
                this.handlerSubGameExitCommand(webview);
                break;
            case "ready":
                this.handlerSubGameReadyCommand();
                break;
            case "openReport":
                this.handlerReportViewOpenCommand(reportUrl);
                break;
            default:
                break;
        }
    }

    private handlerSubGameReadyCommand(): void {
        cc.log("this.showWebViewSignal");
        this.readySignal.dispatch(this.owner);
    }

    /**
     * 处理子游戏退出命令
     * @param webview 
     */
    private handlerSubGameExitCommand(webview: cc.WebView): void {
        this.exitSignal.dispatch(this.owner);
    }

    private handlerReportViewOpenCommand(url: string): void {
        cc.log(`handlerReportViewOpenCommand`);
        let params: reportParams = new reportParams();
        params.url = url;
        this.reportViewOpenSignal.dispatch(params);
    }

    private handlerReportViewCloseCommand(): void {
        cc.log(`handlerReportViewCloseCommand`);
        this.reportViewCloseSignal.dispatch();
    }

}
