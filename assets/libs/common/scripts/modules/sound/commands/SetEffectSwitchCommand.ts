import SoundModel from "../models/SoundModel";

export default class SetEffectSwitchCommand extends riggerIOC.Command {
    @riggerIOC.inject(SoundModel)
    private model: SoundModel;
    execute(state: boolean) {
        this.model.effectSwitch = state;
    }
}
