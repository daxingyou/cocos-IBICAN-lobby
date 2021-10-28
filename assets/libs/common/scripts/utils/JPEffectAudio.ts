import JPAudio from "./JPAudio";
/**
 * 音效
 */
export default class JPEffectAudio extends JPAudio {
    static tempEnable:boolean = null;

    public static onBlur(): void {
        JPEffectAudio.tempEnable = JPEffectAudio.enabled;
        JPEffectAudio.enabled = false;
    }

    public static onFocus(): void {
        if(null == JPEffectAudio.tempEnable) return;
        JPEffectAudio.enabled = JPEffectAudio.tempEnable;
        JPEffectAudio.tempEnable = null;
    }

    /**
     * 所有的音效
     */
    protected static effectsMap: { [id: number]: JPAudio } = {};

    // 分配一个音效ID
    protected static allocId(): number {
        return JPEffectAudio.mNowId++;
    }
    protected static mNowId: number = 1;

    /**
     * 音效音量(全局)
     */
    public static get globalVolume(): number {
        return JPEffectAudio.mVolume;
    }
    public static set globalVolume(v: number) {
        if (v < 0 || v > 1) throw new Error("volume should be in range [0, 1]");
        JPEffectAudio.mVolume = v;
        cc.audioEngine.setEffectsVolume(v);
    }
    private static mVolume: number = 0.5;

    /**
     * 音效是否可用
     */
    public static get enabled(): boolean {
        return JPEffectAudio.mEnabled;
    }
    public static set enabled(state: boolean) {
        this.mEnabled = state;
        if (!state) {
            for (var k in JPEffectAudio.effectsMap) {
                // 不使用cc.audioengine.stopAllEffect,因为此接口目前会导致背景音乐重播一次
                JPEffectAudio.effectsMap[k].stop();
            }
        }
    }
    private static mEnabled: boolean = true;

    protected id: number;

    constructor() {
        super();
        this.id = JPEffectAudio.allocId();
        JPEffectAudio.effectsMap[this.id] = this;
    }

    dispose(): void {
        if (this.isPlaying) this.stop();
        delete JPEffectAudio.effectsMap[this.id];
        super.dispose();
    }

    protected onPlay(clip: cc.AudioClip, ifLoop: boolean): number {
        return cc.audioEngine.playEffect(clip, ifLoop);
    }

    protected isEnabled(): boolean {
        return JPEffectAudio.enabled;
    }
}
JPAudio.focuListeners.push(JPEffectAudio);
