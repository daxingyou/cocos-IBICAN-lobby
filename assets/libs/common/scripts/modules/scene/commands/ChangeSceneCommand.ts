import BaseLoadingPanel from "../../assets/views/BaseLoadingPanel";
import Panel from "../../../utils/Panel";
import UIManager from "../../../utils/UIManager";
import LayerManager from "../../../utils/LayerManager";
import Task from "../../../utils/Task";
import SceneLoadingTask from "../servers/SceneLoadingTask";
import SceneModel from "../models/SceneModel";
import ReadyCommand from "../../start/commands/ReadyCommand";
// import OnChangeSceneCompleteSignal from "../signals/OnChangeSceneCompleteSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 切换场景的命令
 */
export default class ChangeSceneCommand extends riggerIOC.WaitableCommand {
    private view: Panel;
    private task: Task;
    private sceneName: string = null;

    @riggerIOC.inject(SceneModel)
    private sceneModel: SceneModel;

    @riggerIOC.inject(ReadyCommand)
    private readyCommand: riggerIOC.ICommand;

    // @riggerIOC.inject(OnChangeSceneCompleteSignal)
    // private onChangeSceneCompleteSignal: OnChangeSceneCompleteSignal;

    execute(
        [sceneName/**要跳转到的场景名称 */,
            loadingPanelClass = BaseLoadingPanel/**加载场景时的过渡/加载面板 */,
            command = null/**如果不为空，则会在准备好场景后执行好像命令，如果是一个可以等待的命令(WaitableCommand)，则会等待此命令完成* ，当命令执行结果不为真时取消跳转*/
        ]: [string, { new(): Panel }, riggerIOC.ICommand
            ]): void {
        cc.log(`change to scene:${sceneName}---->`);
        this.sceneName = sceneName;
        this.readyCommand = command;

        if (this.sceneName == this.sceneModel.preparedScene) {
            this.sceneModel.clearPreparedScene();
            this.decideIfChange();
        }
        else {
            // 显示加载界面
            this.task = new SceneLoadingTask(sceneName);
            if (loadingPanelClass)
                this.view = UIManager.instance.showPanel(loadingPanelClass, LayerManager.uiLayerName, true, this.task);
            this.waitView();

            // 开始任务
            this.task.start();
        }
    }

    // 等待加载界面
    private waitView(): void {
        if (this.view) {
            if (this.view instanceof BaseLoadingPanel) {
                this.view.completeSignal.on(this, this.onViewComplete);
            }
        }
        else {
            this.task.onComplete(this, this.onViewComplete)
        }
    }

    private onViewComplete(): void {
        if (this.task && this.task.progress >= 1)
            this.decideIfChange();
    }

    /**
     * 决定是否真的跳转,以及何时跳转
     */
    private async decideIfChange() {
        // cc.log(`screenName: ${this.sceneName},decideIfChange:${this.readyCommand}`);
        let sceneName: string = this.sceneName;
        // if (!sceneName) return;

        // 是否跳转
        if (this.readyCommand) {
            let ret: boolean = true;
            if (this.readyCommand instanceof riggerIOC.WaitableCommand) {
                this.readyCommand.execute();
                let result:riggerIOC.Result<boolean> = await this.readyCommand.wait();
                if(result.isOk){
                    ret = result.result;
                }
                else{
                    ret = false;
                }
            }
            else {
                ret = this.readyCommand.execute();
            }

            this.clear();

            if (ret) {
                // 需要跳转
                cc.director.loadScene(sceneName, (() => {
                    this.onLaunchScene(sceneName);
                }).bind(this));
                // this.onChangeSceneCompleteSignal.dispatch(sceneName);
                // this.done();
            }
        }
        else {
            this.clear();

            // 直接跳
            cc.director.loadScene(sceneName, (() => {
                this.onLaunchScene(sceneName);
            }).bind(this));
            // this.onChangeSceneCompleteSignal.dispatch(sceneName);
            // this.done();
        }
    }

    private clear(): void {
        this.readyCommand = null;

        if (this.view && this.view instanceof BaseLoadingPanel) {
            this.view.completeSignal.off(this, this.onViewComplete);
        }
        this.view && UIManager.instance.hidePanel(this.view);
        this.view = null;

        this.sceneName = null;
        this.task && this.task.dispose();
        this.task = null;
    }

    onCancel(): void {

    }

    onLaunchScene(sceneName) {
        // this.onChangeSceneCompleteSignal.dispatch(sceneName);
        this.done();
    }
}
