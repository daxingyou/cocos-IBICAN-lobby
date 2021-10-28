// import SoundModel from "../models/SoundModel";
import { SoundOPDefine, SoundUrlDefine } from "../SoundDefine";
import SoundModel from "../models/SoundModel";
import JPMusicAudio from "../../../utils/JPMusicAudio";


// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass } = cc._decorator;

interface SoundData {
    type: string;
    value: any;
}


@ccclass
export default class SoundCommand extends riggerIOC.WaitableCommand {
    @riggerIOC.inject(SoundModel)
    private soundModel: SoundModel;

    execute(soundData: SoundData): void {
        if (soundData) {
            let type: string = soundData.type;
            switch (type) {
                //音效的开启或者关闭
                case SoundOPDefine.OP_SET_SOUND_TOGGLE:
                    this.soundModel.effectSwitch = soundData.value;
                    break;
                //音乐的开启或者关闭
                case SoundOPDefine.OP_SET_MUSIC_TOGGLE:
                    let lastUrl = this.soundModel.nowMusic.url;
                    // let musicUrl: string = lastUrl ? lastUrl : SoundUrlDefine.MUSIC_SCENE;
                    JPMusicAudio.enabled = soundData.value;
                    break;
                //设置音乐的音量
                case SoundOPDefine.OP_SET_MUSIC_VOLUME:
                    this.soundModel.musicVolume = soundData.value;
                    break;
                //设置音效的音量
                case SoundOPDefine.OP_SET_SOUND_VOLUME:
                    this.soundModel.effectVolume = soundData.value;
                    break;
                //播放背景音乐
                case SoundOPDefine.OP_PLAY_MUSIC:
                    this.soundModel.nowMusic.play(soundData.value, true);
                    // this._musicEnable ? this.soundServer.playMusic(soundData.value) : null;
                    break;
                //停止背景音乐
                case SoundOPDefine.OP_STOP_MUSIC:
                    this.soundModel.nowMusic.stop();
                    break;
                //播放音效
                // case SoundOPDefine.OP_PLAY_SOUND:
                    
                //     this._soundEnable ? this.soundServer.playEffect(soundData.value) : null;
                //     break;
                //停止音效
                // case SoundOPDefine.OP_STOP_SOUND:
                //     this.soundServer.stopEffect(soundData.value);
                default:
                    break;
            }
        }
        this.done();
    }

}
