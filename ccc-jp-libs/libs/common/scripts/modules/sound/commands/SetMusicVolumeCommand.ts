import SoundModel from "../models/SoundModel";

export default class SetMusicVolumeCommand extends riggerIOC.Command {
    @riggerIOC.inject(SoundModel)
    private model: SoundModel;

    execute(vol: number): void {
        this.model.musicVolume = vol;
    }
}