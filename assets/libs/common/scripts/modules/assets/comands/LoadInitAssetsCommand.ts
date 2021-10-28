import AssetsConfig from "../AssetsConfig";
import AssetsServer from "../servers/AssetsServer";
import Task from "../../../utils/Task";

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
export default class LoadInitAssetsCommand extends riggerIOC.WaitableCommand {

    @riggerIOC.inject(AssetsServer)
    private assetsServer: AssetsServer;
    private task: Task;

    execute(): void {
        cc.log(`exec load init assets command`)
        this.task = this.assetsServer.loadAssetsByGroup(AssetsConfig.GROUP_INIT);
        if (this.task.isComplete) {
            this.onLoad();
        }
        else {
            this.task.onComplete(this, this.onLoad);
        }
    }

    private onLoad(): void {
        cc.log(`load init assets complete`);
        this.task && this.task.dispose();
        this.task = null;

        this.done();
    }

    onCancel(): void {

    }

    dispose(): void {
        this.task && this.task.dispose();
        this.task = null;

        super.dispose();
    }

}
