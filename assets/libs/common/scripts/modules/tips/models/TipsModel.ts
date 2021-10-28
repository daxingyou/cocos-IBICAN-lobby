import { TipsInfo } from "./TipsInfo";
import Queue from "../../../utils/Queue";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class TipsModel extends riggerIOC.Model {
    /**
     * 提示队列
     * 
     */
    public get tips(): Queue<TipsInfo> {
        // let instance: TipsModel = this.getInstance();
        if (!this.mTips) this.mTips = new Queue<TipsInfo>();
        return this.mTips;
    }
    protected mTips: Queue<TipsInfo>;

    // @riggerIOC.inject(SituationModel)
    // protected situationModel: SituationModel;

    dispose(): void {
        this.mTips = null;
        super.dispose();
    }

    /**
     * 获取真正在实例
     * 1. 先尝试从全局环境中获取
     * 2. 如果未成功获取，则直接返回自身
     */
    // public getInstance(): TipsModel{
    //     let instaance: TipsModel = this.getGlobalInstance();
    //     if(instaance) return instaance;
    //     return this;        
    // }

    /**
     * 获取全局的TipsModel实例
     * 全局是指在多个应用之间共享的，如大厅与子游戏之间
     * 此接口设计用于让子项目可以共享大厅的提示系统（当子游戏运行于大厅中时）
     * 如果不想让子游戏共享大厅的提示系统，则可以重写此接口并返回null
     */
    // public getGlobalInstance(): TipsModel {
    //     return this.situationModel.getGlobal("tipsModel");
    // }

    /**
     * 将自身设置为全局实例
     * 将自己设置全局实例，以便让其它项目共享，设计用于大厅将自己的提示系统共享给各子游戏使用
     */
    // protected setGlobalInstance() {
    //     this.situationModel.setGlobal("tipsModel", this);
    // }

}
