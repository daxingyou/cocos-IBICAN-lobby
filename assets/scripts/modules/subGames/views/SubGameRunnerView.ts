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

const { ccclass, property } = cc._decorator;

@ccclass
export default class SubGameRunnerView extends JPView {

    @property(cc.WebView)
    public webView: cc.WebView = null;

    @property(cc.WebView)
    public reportWebView: cc.WebView = null;

    public run(url: string): void {
        this.webView.url = url;
    }

    public runReport(url: string): void {
        this.reportWebView.url = url;
    }
}
