import JPView from "../../../../libs/common/scripts/utils/JPView";
import UserBriefView from "./UserBriefView";
import PromoteView from "./PromoteView";
import GameListView from "./GameListView";
import SwitchHallSignal from "../../../../libs/common/scripts/signals/SwitchHallSignal";
import HallBGView from "./HallBGView";
import SubGameEntity, { SubGameId } from "../../subGames/models/SubGameEntity";
import SubGamesModel, { SubGameType } from "../../subGames/models/SubGamesModel";
import SubGameListView from "./SubGameListView";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import RegisterSendGoldPanel from "../../giftBox/view/RegisterSendGoldPanel";
import LayerManager from "../../../../libs/common/scripts/utils/LayerManager";
import LobbyServer from "../servers/LobbyServer";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import BalanceView from "./BalanceView";
import { SoundUrlDefine } from "../../../../libs/common/scripts/modules/sound/SoundDefine";
import GiftBoxModel from "../../giftBox/models/GiftBoxModel";
// import GiftBoxServer from "../../giftBox/servers/GiftBoxServer";
import GiftBoxType from "../../giftBox/models/GiftBoxType";
import NativeUtils from "../../../../libs/native/NativeUtils";
import PlayMusicSignal from "../../../../libs/common/scripts/modules/sound/signals/PlayMusicSignal";
import LobbySoundChannels from "../../sound/LobbySoundChannels";
import JPAudio from "../../../../libs/common/scripts/utils/JPAudio";
import SubGameExitSignal from "../../subGames/signals/SubGameExitSignal";

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
export default class LobbyView extends JPView {
    @property(UserBriefView)
    public userBrief: UserBriefView = null;

    @property(PromoteView)
    public promoteView: PromoteView = null;

    @property(GameListView)
    public gameListView: GameListView = null;

    @property(SubGameListView)
    public subGameListView: SubGameListView = null;

    @property(BalanceView)
    public balanceView: BalanceView = null;

    @property(HallBGView)
    public hallBG: HallBGView = null;

    @property(cc.Node)
    public mouse: cc.Node = null;

    @riggerIOC.inject(SubGamesModel)
    private subGameModel: SubGamesModel;

    @riggerIOC.inject(SwitchHallSignal)
    protected onSwitchHallSignal: SwitchHallSignal;

    private readonly gridWidth: number = 215;

    private _mouseEffect: sp.Skeleton;

    @riggerIOC.inject(LobbyServer)
    protected lobbyServer: LobbyServer;

    @riggerIOC.inject(PushTipsQueueSignal)
    public pushTipsQueueSignal: PushTipsQueueSignal;

    @riggerIOC.inject(PlayMusicSignal)
    private playMusicSignal: PlayMusicSignal;

    @riggerIOC.inject(GiftBoxModel)
    private giftBoxModel: GiftBoxModel;


    @riggerIOC.inject(LobbySoundChannels.CLICK_EFFECT)
    private clickEffectChannel: JPAudio;

    onInit() {
        if (this.mouse) {
            this.mouse.active = false;
            let mouseEffect: sp.Skeleton = this.mouse.getComponent(sp.Skeleton);
            if (mouseEffect) {
                mouseEffect.clearTracks();
                this._mouseEffect = mouseEffect;
            }
        }
        NativeUtils.setOrientation(1);
    }

    onShow(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onStageClick, this, true);
        this.onSwitchHallSignal.on(this, this.onSwitchHall);
        this.subGameListView.onScrollViewEvent(cc.ScrollView.EventType.SCROLLING, this, this.onSubGameListScrolling);
        this.updateProgress(this.gameListView.scrollView.content.x);
        this.gameWalletTransferAll();
        this.isReceivedRegAmount();
        this.anchorToLastSubGame();
        // this.gameListView.onScrollViewEvent(cc.ScrollView.EventType.SCROLLING, this, this.onGameListScrolling);
        // this.gameListView.onScrollViewEvent(cc.ScrollView.EventType.SCROLL_ENDED, this, this.onGameListScrollEnd);
        // this.subGameExitSignal.on(this, this.onSubGameExit);
    }

    onHide(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onStageClick, this, true);
        this.subGameListView.offScrollViewEvent(cc.ScrollView.EventType.SCROLLING, this, this.onSubGameListScrolling)
        this.onSwitchHallSignal.off(this, this.onSwitchHall);
        // this.subGameExitSignal.off(this, this.onSubGameExit);
        // this.gameListView.offScrollViewEvent(cc.ScrollView.EventType.SCROLLING, this, this.onGameListScrolling)
        // this.gameListView.offScrollViewEvent(cc.ScrollView.EventType.SCROLL_ENDED, this, this.onGameListScrollEnd);
    }

    public gotoMainScene(subGameId: SubGameId = -1): void {
        this.promoteView.node.active = true;
        this.gameListView.node.active = true;
        this.userBrief.node.active = true;
        this.subGameListView.node.active = false;

        let proNX: number = this.promoteView.node.x
        this.promoteView.node.x = -1000;

        let userNX: number = this.userBrief.node.x;
        let userNY: number = this.userBrief.node.y;
        this.userBrief.node.y = 1000;

        play(this.promoteView.node, proNX, this.promoteView.node.y);
        play(this.userBrief.node, userNX, userNY);

        function play(target: cc.Node, posX: number, posY: number) {
            let s = cc.moveTo(0.2, posX, posY).easing(cc.easeCubicActionOut());
            target.runAction(s);
        }
        this.updateProgress(-500);
        this.balanceView.switchStyle('normal');
        this.playMusicSignal.dispatch([SoundUrlDefine.MUSIC_SCENE, true]);

        if (subGameId >= 0) {
            this.gameListView.anchorSubGame(subGameId);
        }
    }

    private onStageClick(e: cc.Event.EventTouch): void {
        if (e && e.type == cc.Node.EventType.TOUCH_END) {
            let target: cc.Node = <cc.Node>e.target;
            if (target.name.indexOf('Btn') != -1) {
                this.clickEffectChannel.play(SoundUrlDefine.SOUND_BUTTON_CLICK);
                // this.play.dispatch(SoundOPDefine.OP_PLAY_SOUND, SoundUrlDefine.SOUND_BUTTON_CLICK);
            } else if (target.name == "Canvas") {
                if (this._mouseEffect) {
                    this.mouse.active = true;
                    let pos: cc.Vec2 = e.getLocation();
                    let size: cc.Size = this._mouseEffect.node.getContentSize();
                    // this._mouseEffect.node.x = pos.x - this.node.x - size.width;
                    // this._mouseEffect.node.y = pos.y - this.node.y + size.height;
                    this._mouseEffect.node.x = pos.x - this.node.x;
                    this._mouseEffect.node.y = pos.y - this.node.y;
                    this._mouseEffect.clearTracks();
                    this._mouseEffect.setAnimation(0, "4", false);
                    this.clickEffectChannel.play(SoundUrlDefine.SOUND_CLICK_HEARTS);

                    // this.soundDispatcher.dispatch(SoundOPDefine.OP_PLAY_SOUND, SoundUrlDefine.SOUND_CLICK_HEARTS);
                }
            }
        }
    }

    private onGameListScrollEnd(scrollView: cc.ScrollView) {
        // let currentOffset = Math.floor(scrollView.getScrollOffset().x);
        // cc.log(`GameListCurrentOffset: ${currentOffset}`);
        // if(currentOffset > -250 && currentOffset < 0) {
        //     scrollView.scrollToPercentHorizontal(250 / (scrollView.content.width - 1000), 1);
        // }
    }

    private onGameListScrolling(scrollView: cc.ScrollView, cdata: any): void {
        this.updateProgress(scrollView.content.x);
    }

    private onSubGameListScrolling(scrollView: cc.ScrollView, cdata: any): void {
        let movePos: cc.Vec2 = scrollView.getScrollOffset();
        let maxPos: cc.Vec2 = scrollView.getMaxScrollOffset();
        let flag = this.gridWidth;
        if (maxPos.x <= flag) {
            // this.hallBG.curPage = 1;
            // this.hallBG.totlePage = 1;
            return;
        }
        let offX: number = Math.abs(movePos.x);
        let curPage: number = offX % flag != 0 ? Math.ceil(offX / flag) : offX / flag;
        this.hallBG.curPage = curPage;
    }

    private updateProgress(scrollViewX: number) {
        // -656 -710
        let start: number = -656;
        let end: number = -710;
        // cc.log(`on game list scrolling, view:${scrollView}, pos:${scrollView.content.position}, cdata:${cdata}`)
        let total = end - start;
        let now = scrollViewX - start;
        let percent = now / total;
        this.promoteView.setProgress(percent);
    }

    /**
     * 切换大厅操作
     */
    protected onSwitchHall(type: SubGameType): void {
        this.promoteView.node.active = false;
        this.gameListView.node.active = false;
        this.userBrief.node.active = false;
        this.subGameListView.node.active = true;
        let renders: SubGameEntity[];
        let tempType: string = "";
        let musicSrc: string
        switch (type) {
            case SubGameType.SLOT:
                musicSrc = SoundUrlDefine.MUSIC_SLOT_SCENE;
                break;
            case SubGameType.ARCADE:
                musicSrc = SoundUrlDefine.MUSIC_ARC_SCENE;
                break;
            default:
                // 不是Slot/arcade,不做处理
                return;
        }

        tempType = type;
        renders = this.subGameModel.getSubGamesByType(type);
        if (renders != undefined) {
            this.subGameListView.type = tempType;
            this.subGameListView.updateContent(renders);
            this.hallBG.switchBG(type);
            this.balanceView.switchStyle(type);
            //this.scheduleOnce( this.calePage,0.4 );
        }

        this.playMusicSignal.dispatch([musicSrc, true]);
        // this.soundDispatcher.dispatch(SoundOPDefine.OP_PLAY_MUSIC, musicSrc);
    }

    private calePage() {
        let scrollView = this.subGameListView.scrollView;
        let maxPos: cc.Vec2 = scrollView.getMaxScrollOffset();
        let flag = this.gridWidth;
        let totlePage = maxPos.x % flag != 0 ? Math.ceil(maxPos.x / flag) : maxPos.x / flag;
        // this.hallBG.totlePage = totlePage;
    }


    /**
     * 钱包转换
     */
    private async gameWalletTransferAll() {
        let task = this.lobbyServer.gameWalletTransferAll(1);
        let result = await task.wait();
        if (result.isOk) {
            //cc.log("----------------------------------------------转换钱包成功");
        }
        else {
            let reason = result.error;
            this.pushTipsQueueSignal.dispatch(reason.errMsg);
            //cc.log("-------------------------------转换钱包errmag", reason.errMsg);
        }
    }

    /**
    * 是否领取了注册送金
    */
    private async isReceivedRegAmount() {
        let info = this.giftBoxModel.getOperationalActivityInfoByCode(GiftBoxType.REGISTER);
        if (!info) return;
        else {
            if (info.enable && !info.finish) {
                UIManager.instance.showPanel(RegisterSendGoldPanel, LayerManager.uiLayerName, false);
            }
        }
    }

    private onSubGameExit(subGameId: SubGameId): void {
        let subGame: SubGameEntity = this.subGameModel.getSubGame(subGameId);
        switch (subGame.gameType) {
            case SubGameType.SLOT:
            case SubGameType.ARCADE:
                this.subGameListView.anchorSubGame(subGameId);
            default:
                break;
        }
    }

    private anchorToLastSubGame(): void {
        if (!this.subGameModel.exitingSubGameId) return;
        let id = this.subGameModel.exitingSubGameId;
        this.subGameModel.exitingSubGameId = null;

        let game: SubGameEntity = this.subGameModel.getSubGame(id);
        switch (game.gameType) {
            case SubGameType.SLOT:
            case SubGameType.ARCADE:
                this.onSwitchHall(game.gameType);
                break;
            default:
                this.gotoMainScene(id);
                break;
        }
    }
}
