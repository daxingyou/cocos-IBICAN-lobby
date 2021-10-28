import AssetsConfig from "../AssetsConfig";
import UIManager from "../../../utils/UIManager";
import BaseLoadingPanel from "../views/BaseLoadingPanel";
import LayerManager from "../../../utils/LayerManager";
import AssetsServer from "../servers/AssetsServer";
import Task from "../../../utils/Task";
import SituationModel from "../../situation/models/SituationModel";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
@riggerIOC.autoDispose
export default class PreloadAssetsCommand extends riggerIOC.WaitableCommand {

    @riggerIOC.inject(AssetsServer)
    private assetsServer: AssetsServer;

    @riggerIOC.inject(SituationModel)
    private situationModel: SituationModel;

    private task: Task;
    private panel: BaseLoadingPanel;

    execute(): void {
        this.task = this.assetsServer.loadAssetsByGroup(AssetsConfig.GROUP_PRELOADING);
        // 大厅环境下不显示自己的加载界面(因为此时可能还没有地方显示)
        if(this.task.isComplete){
            this.onLoad();
        }
        else{
            if (this.situationModel.isInLobby) {
                this.task.onComplete(this, this.onLoad);
            }
            else {
                this.panel = <BaseLoadingPanel>UIManager.instance.showPanel(BaseLoadingPanel, LayerManager.uiLayerName, false, this.task);
                this.panel.completeSignal.on(this, this.onLoad);
            }
        }
    }

    private onLoad() {
        // cc.log(this.task.progress);
        if (this.task.progress >= 1) {
            this.panel && this.panel.completeSignal.off(this, this.onLoad)

            this.panel && UIManager.instance.hidePanel(this.panel);
            this.panel = null;

            this.task.dispose();
            this.task = null;

            this.done();
        }

    }

    onCancel():void{
        
    }

    dispose():void{
        cc.log(`now dispose preload assets command`);
        this.task && this.task.dispose();
        this.panel && UIManager.instance.hidePanel(this.panel);
        this.task = this.panel = null;

        super.dispose();
    }

}
