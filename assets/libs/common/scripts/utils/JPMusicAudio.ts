import JPAudio from "./JPAudio";
/**
 * 背景音乐
 * 全局只能存在一个,如果已经存在，则会报错
 */
export default class JPMusicAudio extends JPAudio {
    // static tempEnable:boolean = null;
    public static onBlur(): void {
        // JPMusicAudio.tempEnable = JPMusicAudio.enabled; 
        // JPMusicAudio.enabled = false;
        JPMusicAudio.inst && JPMusicAudio.inst.pause();
    }

    public static onFocus(): void {
        // if(null == JPMusicAudio.tempEnable) return;
        // JPMusicAudio.enabled = JPMusicAudio.tempEnable;
        // JPMusicAudio.tempEnable = null;
        JPMusicAudio.inst && JPMusicAudio.inst.resume();
    }
    
    private static inst: JPMusicAudio;
    /**
     * 全局音量
     */
    public static get globalVolume(): number {
        return JPMusicAudio.mGlobalVolume;
    }
    public static set globalVolume(v: number) {
        if (v < 0 || v > 1) throw new Error("volume should be in range [0, 1]");
        JPMusicAudio.mGlobalVolume = v;
        cc.audioEngine.setMusicVolume(v);
    }
    private static mGlobalVolume = 0.5;

    /**
     * 背景音乐状态:开/关
     */
    public static get enabled(): boolean {
        return JPMusicAudio.mEnabled;
    }
    public static set enabled(state: boolean) {
        JPMusicAudio.mEnabled = state;
        if (JPMusicAudio.inst) {
            if (state) {
                JPMusicAudio.inst.play();
            }
            else {
                JPMusicAudio.inst.stop();
                cc.audioEngine.stopMusic();
            }
        }
    }
    private static mEnabled: boolean = true;

    constructor() {
        super();
        if (JPMusicAudio.inst) throw new Error("JPMusicAudio can only has one instance");
        JPMusicAudio.inst = this;
    }

    dispose(): void{
        JPMusicAudio.inst = null;
        super.dispose();
    }

    protected onPlay(clip: cc.AudioClip, ifLoop: boolean): number {
        return cc.audioEngine.playMusic(clip, ifLoop);
    }

    protected isEnabled(): boolean{
        return JPMusicAudio.enabled;
    }
}

JPAudio.focuListeners.push(JPMusicAudio);