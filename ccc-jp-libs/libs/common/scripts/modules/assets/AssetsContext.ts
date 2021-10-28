import InitAssetsSignal from "./signals/InitAssetsSignal";
import InitAssetsCommand from "./comands/InitAssetsCommand";
import LoadInitAssetsCommand from "./comands/LoadInitAssetsCommand";
import PreloadAssetsSignal from "./signals/PreloadAssetsSignal";
import PreloadAssetsCommand from "./comands/PreloadAssetsCommand";
import BaseLoadingPanel from "./views/BaseLoadingPanel";
import BaseLoadingPanelMediator from "./mediators/BaseLoadingPanelMediator";
import AssetsServer from "./servers/AssetsServer";
import HotUpdateTask from "./tasks/HotUpdateTask";
import GetLocalMainVersionTask from "./tasks/GetLocalMainVersionTask";
import AssetsModel from "./models/AssetsModel";
import MakeSureInstallMetaTask from "./tasks/MakeSureInstallMetaTask";
/**
 * 资源模块上下文容器
 */
export default class AssetsContext extends riggerIOC.ModuleContext {
    @riggerIOC.inject(InitAssetsSignal)
    private initAssetsSignal: InitAssetsSignal;

    constructor(app: riggerIOC.ApplicationContext) {
        super(app);
    }

    bindInjections(): void {
        cc.log("AssetsContext bindInjections");
        this.injectionBinder.bind(AssetsModel).toSingleton();
        this.injectionBinder.bind(AssetsServer).toSingleton();

        // 绑定原生环境下特有的任务
        if (cc.sys.isNative) {
            // 获取本地版本任务是否真的只能在原生环境？
            this.injectionBinder.bind(GetLocalMainVersionTask).toSingleton();
            this.injectionBinder.bind(MakeSureInstallMetaTask).toSingleton();
            this.injectionBinder.bind(HotUpdateTask).toSingleton();

        }
        else{
            this.injectionBinder.bind(GetLocalMainVersionTask).toValue(null);    
            this.injectionBinder.bind(MakeSureInstallMetaTask).toValue(null);    
            this.injectionBinder.bind(HotUpdateTask).toValue(null);

        }
    }

    bindCommands(): void {
        // 初始化资源
        this.commandBinder.bind(InitAssetsSignal)
            .inSequence()
            .to(InitAssetsCommand)
            .to(LoadInitAssetsCommand)
            // .to(HotUpdateCommand)
            .to(PreloadAssetsCommand)
            .toValue(this.doneCommand)
            .once();

        this.commandBinder.bind(PreloadAssetsSignal).to(PreloadAssetsCommand);
    }

    bindMediators(): void {
        this.mediationBinder.bind(BaseLoadingPanel).to(BaseLoadingPanelMediator);
    }

    onStart(): void {
        this.initAssetsSignal.dispatch();
        // this.pre.dispatch()
    }

    @riggerIOC.inject(AssetsServer)
    protected assetsServer: AssetsServer
    
    dispose():void{
        this.assetsServer.preDispose();
        super.dispose();
    }
}