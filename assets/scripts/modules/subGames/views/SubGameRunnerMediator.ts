import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import SubGameRunnerView from "./SubGameRunnerView";
import SubGameExitSignal from "../signals/SubGameExitSignal";
import SubGameReadySignal from "../signals/SubGameReadySignal";
import SubGameCommandEexcuter from "../servers/SubGameCommandEexcutar";
import LobbyServer from "../../lobby/servers/LobbyServer";
import ReportViewOpenSignal from "../signals/ReportViewOpenSignal";
import ReportViewCloseSignal from "../signals/ReportViewCloseSignal";
import NativeUtils from "../../../../libs/native/NativeUtils";
import SubGamesModel from "../models/SubGamesModel";
import { reportParams } from "../../../../libs/common/scripts/CommonContext";
import SubGameUtils from "../utils/SubGameUtils";
import LayoutCanvas from "../../../../libs/common/scripts/utils/Layout/LayoutCanvas";
import LayoutContent from "../../../../libs/common/scripts/utils/Layout/LayoutContent";
import SubGameEntity, { LaunchType, SubGameId } from "../models/SubGameEntity";
import ShowBindPhonePanelSignal from "../../giftBox/signals/ShowBindPhonePanelSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class SubGameRunnerMediator extends JPMediator {
    private workWait: riggerIOC.BaseWaitable = new riggerIOC.BaseWaitable();

    @riggerIOC.inject(SubGameRunnerView)
    protected view: SubGameRunnerView;

    @riggerIOC.inject(SubGameExitSignal)
    protected subGameExitSignal: SubGameExitSignal;

    @riggerIOC.inject(SubGameReadySignal)
    protected subGameReadySignal: SubGameReadySignal;

    public static get instance(): SubGameRunnerMediator {
        return SubGameRunnerMediator.mInstance;
    }
    protected static mInstance: SubGameRunnerMediator = null;

    @riggerIOC.inject(SubGameCommandEexcuter)
    protected executer: SubGameCommandEexcuter;

    @riggerIOC.inject(LobbyServer)
    private lobbyServer: LobbyServer;

    @riggerIOC.inject(ReportViewOpenSignal)
    private reportViewOpenSignal: ReportViewOpenSignal;

    @riggerIOC.inject(ReportViewCloseSignal)
    private reportViewCloseSignal: ReportViewCloseSignal;

    @riggerIOC.inject(SubGamesModel)
    private subGameModel: SubGamesModel;

    onInit(): void {
        SubGameRunnerMediator.mInstance = this;
        if (this.view.webView.appendUserAgent) {
            this.view.webView.appendUserAgent("/browser_type/android_app/");
            this.view.webView.appendUserAgent("/jp_runtime/embedded/");
            cc.log(`webView new user agent:${this.view.webView.getUserAgent()}`);
        }
        if (this.view.reportWebView.appendUserAgent) {
            this.view.reportWebView.appendUserAgent("/browser_type/android_app/");
            this.view.reportWebView.appendUserAgent("/jp_runtime/embedded/");
            cc.log(`reportWebView new user agent:${this.view.webView.getUserAgent()}`);
        }
        this.executer.init(this.view.webView, this.view.reportWebView);
        this.subGameExitSignal.on(this, this.onSubGameSayExit)
        this.subGameReadySignal.on(this, this.onSubGameSayReady);

        this.reportViewOpenSignal.on(this, this.onOpenReportView);
        this.reportViewCloseSignal.on(this, this.onCloseReportView);
    }

    onDispose(): void {
        this.subGameExitSignal.off(this, this.onSubGameSayExit)
        this.subGameReadySignal.off(this, this.onSubGameSayReady);

        this.reportViewOpenSignal.off(this, this.onOpenReportView);
        this.reportViewCloseSignal.off(this, this.onCloseReportView);

        super.onDispose();
    }

    run(subGameId: SubGameId) {
        let url: string = `http://localhost:10086/${subGameId}/bin/index.html`;
        this.view.run(url);
        this.executer.bind(subGameId);
        this.subGameModel.runningSubGameId = subGameId;
        this.workWait.reset();
        return this.workWait.wait();
    }

    /**lobby MainScene移除时, 常驻节点subGameRunner会脱离layoutCanvas的适配管理 */
    resetLayoutAdaptive() {
        if (cc.director.getScene().name != 'mainScene') return;
        let canvas = cc.director.getScene().getChildByName('Canvas');
        if (!canvas) return;
        if (!canvas.getComponent(LayoutCanvas)) return;
        let hasSubGameRunner: boolean = false;
        canvas.getComponent(LayoutCanvas).contentAdaptive.forEach((item, idx) => {
            if (!item.node) canvas.getComponent(LayoutCanvas).contentAdaptive.splice(idx, 1);
            else {
                if (item.node.name == 'subGameRunner') hasSubGameRunner = true;
            }
        });

        if (!hasSubGameRunner) {
            canvas.getComponent(LayoutCanvas).contentAdaptive.push(this.view.node.getComponent(LayoutContent));
            this.view.getComponent(LayoutContent).layout();
        } 
    }

    _updateAllChildNodeWidget(parentNode: cc.Node) {
        if (parentNode == null) {
            return;
        }
        let widget = parentNode.getComponent(cc.Widget);
        if (widget != null) {
            widget.updateAlignment();
        }
        if (parentNode.childrenCount == 0) {
            return;
        }
        parentNode.children.forEach((childNode: cc.Node) => {
            this._updateAllChildNodeWidget(childNode);
        });
    }

    private isInLayaGame: boolean = false; //防止游戏内断线重连,切换到竖屏,点击重连时,再次触发onSubGameSayReady 无法获取Canvas正确的position
    onSubGameSayReady(subGameId: SubGameId): void {
        if(this.isInLayaGame) return;
        let entity: SubGameEntity = this.subGameModel.getSubGame(subGameId);
        if (LaunchType.Native == entity.launchType) return;
        this.isInLayaGame = true;
        this.gameWalletTransferAll(2);

        this.resetLayoutAdaptive();
        NativeUtils.setOrientation(3);
        this.view.node.active = true;
        if (cc.view.getFrameSize().width >= cc.view.getFrameSize().height) {
            this.view.node.x = cc.director.getScene().getChildByName('Canvas').position.x;
            this.view.node.y = cc.director.getScene().getChildByName('Canvas').position.y;
        }
        else {
            this.view.node.x = cc.director.getScene().getChildByName('Canvas').position.y;
            this.view.node.y = cc.director.getScene().getChildByName('Canvas').position.x;
        }
        this.view.reportWebView.node.active = false;
        this.view.reportWebView.node.x = this.view.reportWebView.node.y = 10000;
        this.workWait.done();
    }

    onSubGameSayExit(subGameId: SubGameId): void {
        let entity: SubGameEntity = this.subGameModel.getSubGame(subGameId);
        if (entity.launchType == LaunchType.Native) return;
        this.isInLayaGame = false;
        NativeUtils.setOrientation(1);
        this.gameWalletTransferAll(1);
        // this.view.node.active = false;
        this.view.node.x = 5000;
        this.view.node.y = 375;
        if (cc.sys.os == cc.sys.OS_IOS) {
            this.view.run('www.baidu.com');
        }
        else {
            this.view.run("about:blank");
        }
        this.subGameModel.runningSubGameId = null;
        this.view.scheduleOnce(() => {
            this.bindPhone();
        }, 0.6);
    }

    private currentGameId: number | string;
    async onOpenReportView(params: reportParams) {
        // cc.log(`openReportView: gameId:${params.gameId}=====url:${params.url}`);
        // cc.log(`getFrameSize: width:${cc.view.getFrameSize().width}=====height:${cc.view.getFrameSize().height}`);
        // cc.log(`position: x:${cc.director.getScene().getChildByName('Canvas').position.x}=====y:${cc.director.getScene().getChildByName('Canvas').position.y}`);
        NativeUtils.setOrientation(1);
        await riggerIOC.waitForSeconds(500);
        if (params.gameId) {
            /**cocos游戏 */
            this.currentGameId = params.gameId;
            this.view.node.active = true;
            this.view.getComponent(LayoutContent).layout();
            if (cc.view.getFrameSize().width >= cc.view.getFrameSize().height) {
                this.view.node.x = cc.director.getScene().getChildByName('Canvas').position.x;
                this.view.node.y = cc.director.getScene().getChildByName('Canvas').position.y;
            }
            else {
                this.view.node.x = cc.director.getScene().getChildByName('Canvas').position.y;
                this.view.node.y = cc.director.getScene().getChildByName('Canvas').position.x;
            }

            this.view.webView.node.active = false;
        }

        this.view.runReport(params.url);
        this.view.reportWebView.node.x = this.view.reportWebView.node.y = 0;
        this.view.reportWebView.node.active = true;
        this._updateAllChildNodeWidget(this.view.node);
        cc.log(`show reportView`);
    }

    onCloseReportView(): void {
        NativeUtils.setOrientation(3);
        if (this.currentGameId) {
            /**cocos游戏 */
            this.view.node.x = 5000;
            this.view.node.y = 375;
            this.view.webView.node.active = true;
            switch (SubGameUtils.getSubGameSettings(this.subGameModel.getSubGame(this.currentGameId)).orientation) {
                case 'landscape':
                    NativeUtils.setOrientation(1);
                    break;
                case 'portrait':
                    NativeUtils.setOrientation(2);
                    break;
                default:
                    break;
            }
            this.currentGameId = null;
        }

        cc.log(`close reportView`);
        if (cc.sys.os == cc.sys.OS_IOS) {
            this.view.runReport("www.baidu.com");
        }
        else {
            this.view.runReport("about:blank");
        }
        this.view.reportWebView.node.x = this.view.reportWebView.node.y = 10000;
        this.view.reportWebView.node.active = false;
    }

    /**
    * 钱包转换
    */
    private async gameWalletTransferAll(type: number) {
        this.lobbyServer.gameWalletTransferAll(type);
    }

    @riggerIOC.inject(ShowBindPhonePanelSignal)
    private bindPhoneSig: ShowBindPhonePanelSignal;

    private bindPhone(): void {
        this.bindPhoneSig.dispatch();
    }
}
