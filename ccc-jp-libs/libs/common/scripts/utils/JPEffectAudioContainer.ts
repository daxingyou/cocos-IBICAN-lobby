import JPEffectAudio from "./JPEffectAudio";
/**
 * 一个音效容器，可以维护多个音效播放器
 * 可以将此容器注入到需要的地方，以方便同时播放多个音效
 */
@riggerIOC.autoDispose
export default class JPEffectAudioContainer {
    protected effects: { [id: string]: JPEffectAudio } = {};

    /**
     * 
     * @param id 音频播放器唯一标识，和其它播放器作区分
     * @param url 要播放的音乐地址
     * @param ifLoop 是否循环
     */
    async play(id: string, url: string = null, ifLoop: boolean = null) {
        let effect: JPEffectAudio = this.effects[id];
        if (!effect) {
            effect = this.effects[id] = new JPEffectAudio();
        }
        return effect.play(url, ifLoop);
    }

    /**
     * 获取指定id的音效播放器实例
     * 如果没有则返回null | undefined
     * @param id 播放器唯一标识
     */
    getInstance(id: string): JPEffectAudio | null | undefined {
        return this.effects[id];
    }

    dispose(): void {
        for (var k in this.effects) {
            this.effects[k].dispose();
        }
        this.effects = {};
    }
}