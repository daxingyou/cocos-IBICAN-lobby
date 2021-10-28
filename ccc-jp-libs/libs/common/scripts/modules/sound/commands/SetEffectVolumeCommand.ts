import SoundModel from "../models/SoundModel";

export default class SetEffectVolumeCommand extends riggerIOC.Command {
    @riggerIOC.inject(SoundModel)
    private model: SoundModel;

    execute(vol: number): void{
        this.model.effectVolume = vol;
    }
}