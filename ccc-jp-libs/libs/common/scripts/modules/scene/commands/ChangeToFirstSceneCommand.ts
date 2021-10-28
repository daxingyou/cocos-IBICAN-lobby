import ChangeSceneSignal from "../signals/changeSceneSignal";
import SceneUtils from "../../../utils/SceneUtils";
import BaseLoadingPanel from "../../assets/views/BaseLoadingPanel";
import ReadyCommand from "../../start/commands/ReadyCommand";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class ChangeToFirstSceneCommand extends riggerIOC.Command {
    @riggerIOC.inject(ChangeSceneSignal)
    private changeSceneSignal: ChangeSceneSignal;

    @riggerIOC.inject(ReadyCommand)
    private readyCommand: ReadyCommand;

    execute(): void {
        let sceneName:string = SceneUtils.firstSceneName;
        
        if (sceneName) {
            this.changeSceneSignal.dispatch([sceneName, BaseLoadingPanel, this.readyCommand]);
        }
        else {
            throw new Error(`no FIRST-SCENE has been registered`);
        }
    }
}
