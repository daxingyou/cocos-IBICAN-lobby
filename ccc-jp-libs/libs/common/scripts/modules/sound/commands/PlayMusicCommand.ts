import SoundModel from "../models/SoundModel";

/**
 * 播放背景音乐的命令
 */
export default class PlayMusicCommand extends riggerIOC.Command {
    @riggerIOC.inject(SoundModel)
    private model: SoundModel;
    execute([url = null, ifLoop = true, ifForce = false]: [string, boolean, boolean]): void {
        this.model.nowMusic.play(url, ifLoop, ifForce);
    }
}