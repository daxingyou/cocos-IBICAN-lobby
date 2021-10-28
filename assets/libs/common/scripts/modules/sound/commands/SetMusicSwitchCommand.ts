import SoundModel from "../models/SoundModel";

export default class SetMusicSwitchCommand extends riggerIOC.Command {
    @riggerIOC.inject(SoundModel)
    private model: SoundModel

    execute(state: boolean): void {
        this.model.musicSwitch = state;
    }
}