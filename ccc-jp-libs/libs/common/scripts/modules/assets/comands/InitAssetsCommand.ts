import AssetsUtils from "../../../utils/AssetsUtils";
import GetLocalMainVersionTask from "../tasks/GetLocalMainVersionTask";
import Constants from "../../../Constants";
import AssetsModel from "../models/AssetsModel";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class InitAssetsCommand extends riggerIOC.WaitableCommand {
    @riggerIOC.inject(GetLocalMainVersionTask)
    private getLocalMainVersionTask: GetLocalMainVersionTask

    @riggerIOC.inject(Constants)
    private constants: Constants;

    @riggerIOC.inject(AssetsModel)
    private assetsModel: AssetsModel;

    async execute() {
        cc.log("nothing to do, maybe added later")
        // cocos creator 2.2.0版本已经修复了此BUG，因此去掉此代码
        // 暂时不升级至2.1.3或以上版本，所以依然需要手动添加引用
        AssetsUtils.retainBuiltinAssets();
        if(this.getLocalMainVersionTask){
            if(!this.getLocalMainVersionTask.isWaitting()){
                this.getLocalMainVersionTask.reset();
                this.getLocalMainVersionTask.timeout = 5000;
                let fileName = this.constants.situationId;
                this.getLocalMainVersionTask.start(`${fileName}_meta`);
            }
    
            let ret = await this.getLocalMainVersionTask.wait();
            if(ret.isOk){
                this.assetsModel.version = ret.result;
            }
        }
        
        this.done();
    }
}
