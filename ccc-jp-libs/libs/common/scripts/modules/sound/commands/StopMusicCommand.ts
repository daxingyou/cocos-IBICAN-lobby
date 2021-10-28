import SoundModel from "../models/SoundModel";

export default class StopMusicCommand extends riggerIOC.Command {
    @riggerIOC.inject(SoundModel)
    private model: SoundModel;
    execute(): void {
        this.model.nowMusic.stop();
    }
}