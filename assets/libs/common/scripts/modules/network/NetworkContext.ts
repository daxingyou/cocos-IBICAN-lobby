import NetworkServer from "./servers/NetworkServer";
import BaseGetReconnectSpecTask from "./tasks/BaseGetReconnectSpecTask";

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
 * 网络模块,主要负责维护应用的网络环境(包括实际服务器IP,端口等的获取),消息收发
 * 网络模块内置一个默认频道("default"),当时使用sendDefault接口时，会先尝试从环境中获取"default"频道的连接信息
 * 如果未能成功获取，则会调用全局任务BaseGetConnectSpecTask来获取相关信息
 */
export default class NetworkContext extends riggerIOC.ModuleContext {
    /**
     * 绑定注入
     */
    bindInjections(): void {
        // 重连规范获取任务
        this.injectionBinder.bind(BaseGetReconnectSpecTask).toSingleton();
        this.injectionBinder.bind(NetworkServer).toSingleton();
        
    }

    /**
     * 绑定命令
     */
    bindCommands(): void {
        // this.commandBinder.bind(NetworkServerOnCloseSignal).to(NetworkServerOnCloseCommand);
    }

    /**
     * 绑定界面与Mediator
     */
    bindMediators(): void {

    }

    /**
     * 模块启动时的回调
     */
    protected onStart(): void {
        // cc.log(`network context`)
        this.done();
    }

}
