
import SoundModel from "./models/SoundModel";
import PlayMusicSignal from "./signals/PlayMusicSignal";
import PlayMusicCommand from "./commands/PlayMusicCommand";
import OnMusicVolumeChangeSignal from "./signals/OnMusicVolumeChangeSignal";
import OnEffectVolumeChangeSignal from "./signals/OnEffectVolumeChangeSignal";
import OnMusicSwitchChangeSignal from "./signals/OnMusicSwitchChangeSignal";
import OnEffectSwitchChangeSignal from "./signals/OnEffectSwitchChangeSignal";
import StopMusicSignal from "./signals/StopMusicSignal";
import StopMusicCommand from "./commands/StopMusicCommand";
import JPMusicAudio from "../../utils/JPMusicAudio";
import SetMusicSwitchSignal from "./signals/SetMusicSwitchSignal";
import SetMusicSwitchCommand from "./commands/SetMusicSwitchCommand";
import SetEffectSwitchSignal from "./signals/SetEffectSwitchSignal";
import SetEffectSwitchCommand from "./commands/SetEffectSwitchCommand";
import SetMusicVolumeSignal from "./signals/SetMusicVolumeSignal";
import SetMusicVolumeCommand from "./commands/SetMusicVolumeCommand";
import SetEffectVolumeSignal from "./signals/SetEffectVolumeSignal";
import SetEffectVolumeCommand from "./commands/SetEffectVolumeCommand";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class SoundContext extends riggerIOC.ModuleContext {
    /**
     * 绑定注入
     */
    bindInjections(): void {
        this.injectionBinder.bind(SoundModel).toSingleton();
        // 背景音乐播放器
        this.injectionBinder.bind(JPMusicAudio).toSingleton();
        // this.injectionBinder.bind(SoundDispatcher).toSingleton();
        // this.injectionBinder.bind(SoundCommand).toSingleton();
        this.injectionBinder.bind(OnMusicVolumeChangeSignal).toSingleton();
        this.injectionBinder.bind(OnEffectVolumeChangeSignal).toSingleton();
        this.injectionBinder.bind(OnMusicSwitchChangeSignal).toSingleton();
        this.injectionBinder.bind(OnEffectSwitchChangeSignal).toSingleton();
    }

    /**
     * 绑定命令
     */
    bindCommands(): void {
        // this.commandBinder.bind(SoundSignal).to(SoundCommand);
        /**
         * 声音设置相关的命令
         */
        this.commandBinder.bind(PlayMusicSignal).to(PlayMusicCommand);
        this.commandBinder.bind(StopMusicSignal).to(StopMusicCommand);
        this.commandBinder.bind(SetMusicSwitchSignal).to(SetMusicSwitchCommand);
        this.commandBinder.bind(SetEffectSwitchSignal).to(SetEffectSwitchCommand);
        this.commandBinder.bind(SetMusicVolumeSignal).to(SetMusicVolumeCommand);
        this.commandBinder.bind(SetEffectVolumeSignal).to(SetEffectVolumeCommand)
    }

    /**
     * 绑定界面与Mediator
     */
    bindMediators(): void {

    }

    /**
     * 模块启动时的回调
     */
    protected onStart(): void {
        this.done();
    }
}
