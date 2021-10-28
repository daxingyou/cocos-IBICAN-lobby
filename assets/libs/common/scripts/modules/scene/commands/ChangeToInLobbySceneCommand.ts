import SceneModel from "../models/SceneModel";
import ChangeSceneSignal from "../signals/changeSceneSignal";
import BaseLoadingPanel from "../../assets/views/BaseLoadingPanel";
import ReadyCommand from "../../start/commands/ReadyCommand";

export default class ChangeToInLobbySceneCommand extends riggerIOC.Command{
    @riggerIOC.inject(SceneModel)
    private sceneModel: SceneModel;

    @riggerIOC.inject(ChangeSceneSignal)
    private changeSceneSignal: ChangeSceneSignal;

    @riggerIOC.inject(ReadyCommand)
    private readyCommand: ReadyCommand;

    execute(): void {
        let sceneName:string = this.sceneModel.preparedScene;

        if (sceneName) {
            this.changeSceneSignal.dispatch([sceneName, BaseLoadingPanel, this.readyCommand]);
        }
        else {
            throw new Error(`no IN-LOBBY-SCENE has been registered`);
        }
    }
}