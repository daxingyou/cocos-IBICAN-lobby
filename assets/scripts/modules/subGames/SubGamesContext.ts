import SubGamesModel from "./models/SubGamesModel";
import SubGamesServer from "./servers/SubGamesServer";
import InitSubGameInfoSignal from "./signals/InitSubGameInfoSignal";
import LoadLocalSubGameInfoCommand from "./commands/LoadLocalSubGameInfoCommand";
import RequestSubGameInfoCommand from "./commands/RequestSubGameInfoCommand";
import SubGameInitlizedSignal from "./signals/SubGameInitlizedSignal";
import GameListMediator from "../lobby/views/GameListMediator";
import GameListView from "../lobby/views/GameListView";
import UpdateSubGameSignal from "./signals/UpdateSubGameSignal";
import UpdateSubGameCommand from "./commands/UpdateSubGameCommand";
import OnSubGameListUpdateSignal from "./signals/OnSubGameListUpdateSignal";
import OnSubGameUpdateTaskCreateSignal from "./signals/OnSubGameUpdateTaskCreateSignal";
import MakeSureLoginedCommand from "../login/commands/MakeSureLoginedCommand";
import PrepareToLaunchSubGameCommand from "./commands/PrepareToLaunchSubGameCommand";
import RequestLaunchInfoTask from "./servers/tasks/RequestLaunchInfoTask";
import LaunchSubGameCommand from "./commands/LaunchSubGameCommand";
import LaunchSubGameTask from "./servers/tasks/LaunchSubGameTask";
import SubGameCommandEexcuter from "./servers/SubGameCommandEexcutar";
import SubGameReadySignal from "./signals/SubGameReadySignal";
import SubGameExitSignal from "./signals/SubGameExitSignal";
import SubGameRunnerView from "./views/SubGameRunnerView";
import SubGameRunnerMediator from "./views/SubGameRunnerMediator";
import LaunchSubGameSignal from "./signals/LaunchSubGameSignal";
import PromoteView from "../lobby/views/PromoteView";
import PromoteMediator from "../lobby/views/PromoteMediator";
import LaunchInGameSubGameTask from "./servers/tasks/LaunchInGameSubGameTask";
import ExitInGameSubGameTask from "./servers/tasks/ExitInGameSubGameTask";
import TryToLaunchSubGameSignal from "./signals/TryToLaunchSubGameSignal";
import SubGameClickCommand from "./commands/SubGameClickCommand";
import ReportViewCloseSignal from "./signals/ReportViewCloseSignal";
import ReportViewOpenSignal from "./signals/ReportViewOpenSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class SubGamesContext extends riggerIOC.ModuleContext {
    /**
     * 绑定注入
     */
    bindInjections(): void {
        this.injectionBinder.bind(SubGamesModel).toSingleton();
        this.injectionBinder.bind(SubGamesServer).toSingleton();

        /**
         * 子游戏数据初始化完成的信号
         */
        this.injectionBinder.bind(SubGameInitlizedSignal).toSingleton();
        /**
         * 子游戏信息更新了的信号
         */
        this.injectionBinder.bind(OnSubGameListUpdateSignal).toSingleton();

        // 创建了新的下载任务
        this.injectionBinder.bind(OnSubGameUpdateTaskCreateSignal).toSingleton();

        // 请求注入信息的任务
        this.injectionBinder.bind(RequestLaunchInfoTask).toSingleton();
        // 启动子游戏的任务
        this.injectionBinder.bind(LaunchSubGameTask).toSingleton();
        // 子游戏命令执行器
        this.injectionBinder.bind(SubGameCommandEexcuter).toSingleton();
        // 子游戏就绪的信号
        this.injectionBinder.bind(SubGameReadySignal).toSingleton();
        // 子游戏退出的信号
        this.injectionBinder.bind(SubGameExitSignal).toSingleton();
        // IN-GAME类型的子游戏启动任务
        this.injectionBinder.bind(LaunchInGameSubGameTask).toSingleton();
        // IN-GAME类型子游戏的返回大厅的任务
        this.injectionBinder.bind(ExitInGameSubGameTask).toSingleton();
        // 报表打开的信号
        this.injectionBinder.bind(ReportViewOpenSignal).toSingleton();
        // 报表关闭的信号
        this.injectionBinder.bind(ReportViewCloseSignal).toSingleton();
    }

    /**
     * 绑定命令
     */
    bindCommands(): void {
        /**
         * 初始化子游戏信息的命令，游戏准备好后手动调用
         */
        this.commandBinder
        .bind(InitSubGameInfoSignal)
        .to(LoadLocalSubGameInfoCommand)
        .to(RequestSubGameInfoCommand);

        /**
         * 开始更新游戏，会从服务器下载最新版本的游戏，并更新
         */
        this.commandBinder
        .bind(UpdateSubGameSignal)
        .to(UpdateSubGameCommand)

        this.commandBinder.bind(TryToLaunchSubGameSignal).to(SubGameClickCommand)

        /**
         * 尝试启动子游戏
         */
        // this.commandBinder.bind(TryToLaunchSubGameSignal).to(TryToLaunchSubGameCommand);
        this.commandBinder.bind(LaunchSubGameSignal)
        .inSequence()
        // 首先确保已经登录
        .to(MakeSureLoginedCommand)
        // 准备启动子游戏，如：向服务器请求一些启动信息
        .to(PrepareToLaunchSubGameCommand)
        .to(LaunchSubGameCommand)
        

    }

    /**
     * 绑定界面与Mediator
     */
    bindMediators(): void {
        this.mediationBinder.bind(GameListView).to(GameListMediator);    
        this.mediationBinder.bind(PromoteView).to(PromoteMediator);
        this.mediationBinder.bind(SubGameRunnerView).to(SubGameRunnerMediator);
    }

    /**
     * 模块启动时的回调
     */
    protected onStart(): void {
        this.done();
    }

}
