import GlobalSignal from "../../../signals/GlobalSignal";

/**
 * 场景切换成功的信号
 * 参数为场景名
 * 这是一个全局信号，即大厅和子游戏可以共享同一个实例
 */
export default class OnChangeSceneCompleteSignal extends GlobalSignal<string>{
    protected signalFlag = "$gsigOnChangeSceneCompleteSignal";
}