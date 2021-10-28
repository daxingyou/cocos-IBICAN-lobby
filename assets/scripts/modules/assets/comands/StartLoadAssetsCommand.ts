// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// import StartLoadAssetsSignal from "../signals/StartLoadAssetsSignal"
import * as protocol from '../../../protocol/protocols/protocols'
import CommandCodes from "../../../protocol/CommandCodes";



export default class StartLoadAssetsCommand extends riggerIOC.Command {
    /**
     * 执行命令
     */
    execute(arg?: any): void{
        cc.log("show loading panel");
        this.initRes();
    }

    private m_resArr = [];

    private initRes()
    {
        let t_arr = this.addPrefabRES();
        let t_hand: rigger.RiggerHandler = new rigger.RiggerHandler(this, this.onResLoad, [], true);
        rigger.service.AssetsService.instance.getAssets(t_arr,t_hand);

    }

    private onResLoad()
    {
        // UIManager.instance.showPanel("perfabs/assets/loadingPanel", LayerManager.uiLayerName);
    }

    //添加预制体
    private addPrefabRES():any[]
    {
        this.m_resArr.push({ url: "perfabs/assets/loadingPanel", type: cc.Prefab });
        this.m_resArr.push({ url: "perfabs/interface/customerPanel", type: cc.Prefab });
        this.m_resArr.push({ url: "perfabs/interface/radioPanel", type: cc.Prefab });
        this.m_resArr.push({ url: "perfabs/interface/setUpPanel", type: cc.Prefab });
        this.m_resArr.push({ url: "perfabs/login/loginGroup", type: cc.Prefab });
        this.m_resArr.push({ url: "perfabs/login/registerPanel", type: cc.Prefab });
        this.m_resArr.push({ url: "perfabs/maintain/maintainGamePanel", type: cc.Prefab });
        this.m_resArr.push({ url: "perfabs/safeBox/safeBoxPanel", type: cc.Prefab });
        this.m_resArr.push({ url: "perfabs/safeBox/modifyPassword", type: cc.Prefab });
        this.m_resArr.push({ url: "perfabs/tips/tipsPanel", type: cc.Prefab });
        this.m_resArr.push({ url: "perfabs/backBlockingPanel", type: cc.Prefab });
        this.m_resArr.push({ url: "perfabs/exit/exitPanel", type: cc.Prefab });

        return this.m_resArr;
    }


}
