import OnMusicVolumeChangeSignal from "../signals/OnMusicVolumeChangeSignal";
import OnMusicSwitchChangeSignal from "../signals/OnMusicSwitchChangeSignal";
import OnEffectVolumeChangeSignal from "../signals/OnEffectVolumeChangeSignal";
import OnEffectSwitchChangeSignal from "../signals/OnEffectSwitchChangeSignal";
import JPMusicAudio from "../../../utils/JPMusicAudio";
import JPEffectAudio from "../../../utils/JPEffectAudio";
import Constants from "../../../Constants";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class SoundModel extends riggerIOC.Model {
    @riggerIOC.inject(OnMusicVolumeChangeSignal)
    private musicVolumeChangeSignal: OnMusicVolumeChangeSignal;

    @riggerIOC.inject(OnMusicSwitchChangeSignal)
    private musicSwitchChangeSignal: OnMusicSwitchChangeSignal;

    @riggerIOC.inject(OnEffectVolumeChangeSignal)
    private effectVolumeChangeSignal: OnEffectVolumeChangeSignal;

    @riggerIOC.inject(OnEffectSwitchChangeSignal)
    private effectSwitchChangeSignal: OnEffectSwitchChangeSignal;

    @riggerIOC.inject(Constants)
    private constants: Constants;

    /**
     * 当前正在播放的背景音乐
     */
    @riggerIOC.inject(JPMusicAudio)
    public nowMusic: JPMusicAudio = null;

    /**
     * 当前的背景音乐url（可能未播放)
     */
    // protected nowMusicUrl: string = null;

    constructor() {
        super();
        this.init();
    }

    private init(): void {
        this.musicVolume = this.getLocalMusicVolume();
        this.effectVolume = this.getLocalEffectVolume();
        this.musicSwitch = this.getLocalMusicState();
        this.effectSwitch = this.getLocalEffectState();
    }

    public audioEnable: boolean = true;
    // public volume: number = 0.5;

    /**
     * 背景音乐音量
     */
    public get musicVolume(): number {
        return this.nowMusic.useGlobalVolume ? JPMusicAudio.globalVolume : this.nowMusic.volume;
    }
    public set musicVolume(v: number) {
        JPMusicAudio.globalVolume = v;
        this.storeMusicVolume(v);

        this.musicVolumeChangeSignal.dispatch(v);
    }

    /**
     * 音效音量
     */
    public get effectVolume(): number {
        return JPEffectAudio.globalVolume;
    }
    public set effectVolume(v: number) {
        JPEffectAudio.globalVolume = v;
        this.storeEffectVolume(v);

        this.effectVolumeChangeSignal.dispatch(v);
    }


    /**
     * 背景音乐状态:开/关
     */
    public get musicSwitch(): boolean {
        return JPMusicAudio.enabled;
    }
    public set musicSwitch(state: boolean) {
        JPMusicAudio.enabled = state;
        this.storeMusicSwitch(state);

        this.musicSwitchChangeSignal.dispatch(state);
    }

    public get effectSwitch(): boolean {
        return JPEffectAudio.enabled
    }
    public set effectSwitch(state: boolean) {
        JPEffectAudio.enabled = state;
        this.storeEffectSwitch(state);

        this.effectSwitchChangeSignal.dispatch(state);
    }

    /**
     * 背景音乐的状态：开/关
     */
    // protected readonly musicStateKey: string = "musicState";
    private get musicStateKey(): string {
        if (!this.mMusicStateKey) this.mMusicStateKey = `musicState_${this.constants.situationId}`;
        return this.mMusicStateKey;
    }
    private mMusicStateKey: string = null;

    private storeMusicSwitch(state: boolean): void {
        cc.sys.localStorage.setItem(this.musicStateKey, state);
    }
    private getLocalMusicState(): boolean {
        let stateStr: string = cc.sys.localStorage.getItem(this.musicStateKey);
        return stateStr ? (stateStr == "false" ? false : true) : true;
    }

    private get effectStateKey(): string {
        if (!this.mEffectStateKey) this.mEffectStateKey = `effectState_${this.constants.situationId}`;
        return this.mEffectStateKey;
    }
    private mEffectStateKey: string = null;

    private storeEffectSwitch(state: boolean): void {
        cc.sys.localStorage.setItem(this.effectStateKey, state);

    }
    private getLocalEffectState(): boolean {
        let stateStr: string = cc.sys.localStorage.getItem(this.effectStateKey);
        return stateStr ? (stateStr == "false" ? false : true) : true;
    }

    static readonly DEFAULT_VOLUME = 1;
    /**
    * 本地存储的背景音乐设置
    */
    private get musicVolumeStorageKey(): string {
        if(!this.mMusicVolumeStorageKey) this.mMusicVolumeStorageKey = `musicVol_${this.constants.situationId}`;
        return this.mMusicVolumeStorageKey;
    }
    private mMusicVolumeStorageKey: string = null;

    private storeMusicVolume(vol: number): void {
        cc.sys.localStorage.setItem(this.musicVolumeStorageKey, vol);
    }
    private getLocalMusicVolume(): number {
        let v = cc.sys.localStorage.getItem(this.musicVolumeStorageKey);
        v = parseFloat(v);
        if (isNaN(v)) v = SoundModel.DEFAULT_VOLUME;
        return v;
    }

    /**
     * 本地存储的音效设置
     */
    private get effectVolumeStorageKey(): string {
        if(!this.mEffectVolumeStorageKey) this.mEffectVolumeStorageKey = `effectVol_${this.constants.situationId}`;
        return this.mEffectVolumeStorageKey;
    }
    private mEffectVolumeStorageKey: string = null;

    private storeEffectVolume(vol: number): void {
        cc.sys.localStorage.setItem(this.effectVolumeStorageKey, vol);
    }
    private getLocalEffectVolume(): number {
        let v = cc.sys.localStorage.getItem(this.effectVolumeStorageKey);
        v = parseFloat(v);
        if (isNaN(v)) v = SoundModel.DEFAULT_VOLUME;
        return v;
    }

}

