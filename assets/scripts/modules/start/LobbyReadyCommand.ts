import ReadyCommand from "../../../libs/common/scripts/modules/start/commands/ReadyCommand";
import InitSubGameInfoSignal from "../subGames/signals/InitSubGameInfoSignal";
import SubGamesModel from "../subGames/models/SubGamesModel";
import OnSubGameListUpdateSignal from "../subGames/signals/OnSubGameListUpdateSignal";
import SubGamesServer from "../subGames/servers/SubGamesServer";
import { SoundUrlDefine } from "../../../libs/common/scripts/modules/sound/SoundDefine";
import LobbySoundChannels from "../sound/LobbySoundChannels";
import JPEffectAudio from "../../../libs/common/scripts/utils/JPEffectAudio";
import PlayMusicSignal from "../../../libs/common/scripts/modules/sound/signals/PlayMusicSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class LobbyReadyCommand extends ReadyCommand {
    @riggerIOC.inject(InitSubGameInfoSignal)
    private initSubgameInfoSignal: InitSubGameInfoSignal;

    @riggerIOC.inject(OnSubGameListUpdateSignal)
    private completeSignal: OnSubGameListUpdateSignal;

    @riggerIOC.inject(SubGamesModel)
    private subGameModel: SubGamesModel;

    @riggerIOC.inject(SubGamesServer)
    private subGameServer: SubGamesServer;

    @riggerIOC.inject(PlayMusicSignal)
    private playMusicSignal: PlayMusicSignal;

    @riggerIOC.inject(LobbySoundChannels.LOBBY_BEAUTY_SPEAKING)
    private beautyChanel: JPEffectAudio;

    execute(): void {
        cc.log(`isInitlized:${this.subGameModel.isInitlized}`);
        if (this.subGameModel.isInitlized) return this.done();
        this.initSubgameInfoSignal.dispatch();
        this.subGameServer.startLocalServer();

        this.playMusicSignal.dispatch([SoundUrlDefine.MUSIC_SCENE, true]);
        this.beautyChanel.play(SoundUrlDefine.SOUND_WELCOME);

        this.completeSignal.on(this, this.onInitized);
    }

    private onInitized(): void {
        cc.log(`ready Initized`);
        this.completeSignal.off(this, this.onInitized);
        this.done(true);
    }
}
