import AssetAllocator from "../modules/assets/models/AssetAllocator";

/**
 * 声音，一个声音播放抽象
 */
@riggerIOC.autoDispose
export default abstract class JPAudio {

    public static focuListeners: { onBlur: () => void, onFocus: () => void }[] = [];
    static onWindowBlur() {
        JPAudio.focuListeners.forEach(e => e.onBlur())
    }

    static onWindowFocus() {
        JPAudio.focuListeners.forEach(e => e.onFocus());
    }

    /**
     * 是否是一次性的播放器，一次性的播放器，在播放完成后就会自动析构自身
     */
    public ifOnce: boolean = false;

    // 正在播放的音乐的循环模式
    public ifLoop: boolean = false;

    // 正在播放的音乐id
    public audioID: number = null;

    // 当前声音的url，可能处于播放状态也可能处于停止状态
    public url: string;

    /**
     * 音量, 如果未设置(null/undefined)，则使用全局的音量
     */
    public get volume(): number {

        return this.mVolume;
    }
    public set volume(v: number) {
        if (v == null || v == undefined) return;
        if (v < 0 || v > 1) throw new Error("volume should be in range [0, 1]");
        this.mVolume = v;
        if (this.audioID !== null) {
            cc.audioEngine.setVolume(this.audioID, v);
        }
    }
    protected mVolume: number = null;

    /**
     * 总时间,如果当前没有音乐，则返回0
     */
    public get duration(): number {
        if (!this.audioID) return 0;
        return cc.audioEngine.getDuration(this.audioID);
    }

    /**
     * 获取当前时间
     */
    public get currentTime(): number {
        if (!this.audioID) return 0;
        return cc.audioEngine.getCurrentTime(this.audioID) * 1000;
    }

    /**
     * 设置当前时间
     */
    public set currentTime(time: number) {
        if (this.audioID) {
            cc.audioEngine.setCurrentTime(this.audioID, time / 1000);
        }
    }
    // protected mStartTime: number = 0;

    /**
     * 获取状态
     */
    public get state(): cc.audioEngine.AudioState {
        return cc.audioEngine.getState(this.audioID);
    }

    // 当前正在播放的音乐的分配器
    @riggerIOC.inject(AssetAllocator)
    private allocator: AssetAllocator<cc.AudioClip> = null;

    // 下一首要播放的资源的资源分配器
    @riggerIOC.inject(AssetAllocator)
    private preparingAllocator: AssetAllocator<cc.AudioClip> = null;

    @riggerIOC.inject(AssetAllocator)
    private tempHolder: AssetAllocator<cc.AudioClip> = null;

    // 下一首要播放的音乐的地址
    private preparingUrl: string;

    // 下一首要播放的音乐的循环模式
    private preparingIfLoop: boolean;

    constructor() {
    }

    /**
     * 播放音乐,如果请求播放的音乐资源未准备好，则先加载资源;
     * 加载期间，原来的音乐默认继续播放
     * 播放音乐流程:
     * 1. 设置好下一首要播放的音乐的参数
     * 2. 准备要播放的音乐的资源
     * 3. 准备完成后，再次检查各项参数，确定此地准备的资源是否依然有效（可能的失效原因：准备期间，用户请求了播放其它的音乐)
     * 4. 播放准备好的音乐，并切换所有参数
     * @param url 
     * @param ifLoop 
     * @param ifForce 当新URL和正在播放的URL相同时，是否强制重新开始播放，默认为false，
     *        如果不强制重新播放，则当URL相同时，会直接跳过  
     */
    async play(url: string = null, ifLoop: boolean = null, ifForce: boolean = false) {
        // 如果未传入URl，则播放上次播放的
        url = url || this.url;
        ifLoop = ifLoop == null ? this.ifLoop : ifLoop;
        if ("" == url || !url) return;
        // 如果要播放的URL正在准备中，返回
        if (url == this.preparingUrl) return;
        if (!this.isPlaying) {
            this.url = url;
        }
        else {
            // 如果正在播放,且新播放的URL和正在播放的URL相同，则返回
            if (!this.preparingUrl) {
                if (url == this.url && !ifForce) return;
            }
        }

        // 是否需要继续（如果声音被禁止了，则不需要继续)
        if (!this.isEnabled()) return;

        // 准备音乐资源
        this.preparingIfLoop = ifLoop;
        this.prepareAudioClip(url);

        let prepareAllocator = this.preparingAllocator;
        if (prepareAllocator.isWaitting()) {
            let result = await prepareAllocator.wait();
            if (result.isFailed) {
                cc.log(`come across an error when allocate audio:${url}`);
                return;
            }
        }

        let clip = prepareAllocator.getAsset();
        // 未获取到资源
        if (!clip) {
            return;
        }

        // 停止原来的音乐播放
        this.stopCurrent();

        // 播放声音
        this.audioID = this.onPlay(clip, ifLoop);
        // 设置开始时间
        // if(this.mStartTime){
        //     this.currentTime = this.mStartTime;
        // }
        // 完成回调(可以优化成按需求监听)
        cc.audioEngine.setFinishCallback(this.audioID, (() => {
            this.onPlayComplete(this.audioID)
        }).bind(this));
        // 音量
        if (!this.useGlobalVolume) {
            this.volume = this.volume;
        }

        // 交换分配器
        if (this.url) {
            this.allocator.reset();
            this.tempHolder = this.allocator;
        }

        this.allocator = this.preparingAllocator;
        this.preparingAllocator = this.tempHolder;
        this.tempHolder = null;

        // 切换相关参数
        this.url = this.preparingUrl;
        this.ifLoop = this.preparingIfLoop;

        this.preparingUrl = this.preparingIfLoop = null;
    }

    protected abstract onPlay(clip: cc.AudioClip, ifLoop: boolean): number;
    protected abstract isEnabled(): boolean;

    /**
     * 停止播放
     */
    stop(): void {
        this.stopCurrent();
        if (this.preparingUrl) {
            this.preparingAllocator.reset();
            this.preparingUrl = null;
        }
    }

    /**
     * 暂停
     */
    pause(): void {
        if (this.audioID !== null) {
            cc.audioEngine.pause(this.audioID);
        }
    }

    /**
     * 恢复播放
     */
    resume(): void {
        if (this.audioID !== null) {
            cc.audioEngine.resume(this.audioID);
        }
    }

    dispose(): void {
        if (this.audioID !== null) {
            this.stop();
        }
    }

    /**
     * 该声音是否正在播放
     */
    public get isPlaying(): boolean {
        if (this.audioID == null) return false;
        return cc.audioEngine.getState(this.audioID) == cc.audioEngine.AudioState.PLAYING;
    }

    /**
     * 是否暂停了
     */
    public get isPaused(): boolean {
        if (this.audioID == null) return false;
        return cc.audioEngine.getState(this.audioID) == cc.audioEngine.AudioState.PAUSED;
    }

    /**
     * 是否停止了
     */
    public get isStopped(): boolean {
        if (this.audioID == null) return false;
        return cc.audioEngine.getState(this.audioID) == cc.audioEngine.AudioState.STOPPED;
    }

    /**
     * 是否使用了全局音量
     */
    public get useGlobalVolume(): boolean {
        return this.mVolume == null || this.mVolume == undefined;
    }

    /**
     * 准备声音剪辑
     * @param url 
     */
    private prepareAudioClip(url: string): AssetAllocator<cc.AudioClip> {
        this.preparingUrl = url;
        if (this.preparingAllocator.url == url) return;
        this.preparingAllocator.reset();
        this.preparingAllocator.alloc(url);
    }

    /**
     * 停止当前正在播放的音乐
     */
    private stopCurrent(): void {
        if (this.url) {
            this.allocator.reset();
        }

        // if (this.isPlaying) {
            // 据说停止声音前先将循环设为false可防止声音偶尔导致游戏卡死
            // cc.audioEngine.setLoop(this.audioID, false);
            // cc.audioEngine.setVolume(this.audioID, 0);
            cc.audioEngine.stop(this.audioID);
            this.audioID = null;

            // 延时测试是否可以规避卡死问题
            // setTimeout(() => {
            //     cc.audioEngine.stop(this.audioID);
            //     this.audioID = null;
            // }, 0);
        // }
    }

    private onPlayComplete(audioID: number): void {
        if (this.ifOnce) {
            this.dispose();
            return;
        }

        if (audioID == this.audioID) {
            this.audioID = null;
        }
    }

}

window.addEventListener("blur", function () {
    JPAudio.onWindowBlur();
})
window.addEventListener("focus", function () {
    JPAudio.onWindowFocus();
})