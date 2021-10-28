import SituationModel from "../models/SituationModel";
import BaseConnectionSpec from "../../network/servers/BaseConnectionSpec";
import Constants from "../../../Constants";
import LoginRequest from "../../login/models/LoginRequest";
import GetCustomLoginSpecTask from "../tasks/GetCustomLoginSpecTask";
import BaseGetConnectSpecTask from "../../network/tasks/BaseGetConnectSpecTask";

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
 * 环境模块的服务器，用于从运行环境中获取相关信息，
 * 会尝试从环境中获取token, lobbyUrl以及默认(default)频道的连接信息
 * 用户可以重写相关接口以修改获取方式
 */
export default class SituationServer extends riggerIOC.Server {
    @riggerIOC.inject(SituationModel)
    private situationModel: SituationModel;

    @riggerIOC.inject(Constants)
    protected constants: Constants;

    // dispose(): void {
    //     super.dispose();
    // }

    @riggerIOC.inject(GetCustomLoginSpecTask)
    private getCustomLoginSpecTask: GetCustomLoginSpecTask;

    @riggerIOC.inject(BaseGetConnectSpecTask)
    protected getConnectSpecTask: BaseGetConnectSpecTask;

    /**
     * 获取登录描述信息
     * 获取步骤:
     * 1. 首先获取外部注入的
     * 2. 从全局环境中获取
     * 3. 通过和用户的交互获取
     */
    public async getLoginSpec(): Promise<LoginRequest> {
        if (this.getCustomLoginSpecTask && this.getCustomLoginSpecTask.isWaitting()) {
            let ret: riggerIOC.Result<LoginRequest> = await this.getCustomLoginSpecTask.wait();
            return ret.result;
        }

        // 获取注入的
        let spec: LoginRequest = this.getLoginSpecByInject();
        if (spec) return spec;

        // 获取全局的
        spec = this.situationModel.getLoginSpecGlobal();
        if (spec) {
            this.situationModel.clearLoginSpecGlobal();
            return spec;
        }

        // 最后尝试由用户手动输入
        this.getCustomLoginSpecTask.prepare();
        let ret: riggerIOC.Result<LoginRequest> = await this.getCustomLoginSpecTask.wait();
        if (ret.isFailed) {
            cc.error(`error when get login spec:${this.getCustomLoginSpecTask.getReason()}`);
        }
        return ret.result;
    }

    /**
     * 获取连接描述信息
     */
    public async getConnectionSpec(channelName: string | number): Promise<BaseConnectionSpec> {
        if (this.getConnectSpecTask && this.getConnectSpecTask.isWaitting()) {
            let ret: riggerIOC.Result<BaseConnectionSpec, any> = await this.getConnectSpecTask.wait();
            return ret.result;
        }

        let spec: BaseConnectionSpec = this.getConnectionSpecByInject(channelName);
        if (spec) return spec;

        spec = this.situationModel.getConnectionSpecGlobal();
        if (spec) {
            return spec;
        }

        // 最后尝试由用户手动输入
        this.getConnectSpecTask.prepare();
        let result: riggerIOC.Result<BaseConnectionSpec> = await this.getConnectSpecTask.wait();
        return result.result;
    }

    public getRecordUrl(): string {
        let url = this.situationModel.getRecordUrlGlobal();
        if (url) {
            return url;
        }

        return this.getRecordUrlByInject();
    }

    /**
     * 获取大厅的URL，如果没有则返回undefined
     */
    public getLobbyUrl(): string | null | undefined {
        let url = SituationServer.getMetaValue("lobbyUrl");
        if (url) {
            url = window.atob(url);
        }

        return url;
    }

    /**
     * 获取指定ID的元素的value值
     * @param id 
     */
    public static getMetaValue(id: string): string {
        let ele: HTMLElement = null;
        if (ele = document.getElementById(id)) {
            let metaValue: string = ele.getAttribute("value");
            return metaValue;
        }

        return null;
    }

    /**
     * 获取注入的登录描述信息
     */
    protected getLoginSpecByInject(): LoginRequest {
        let token: string = SituationServer.getMetaValue("token");
        if (token) {
            let ret: LoginRequest = new LoginRequest();
            ret.token = token;
            return ret;
        }

        return null;
    }

    protected getConnectionSpecByInject(channelName: string | number): BaseConnectionSpec {
        let ip: string = SituationServer.getMetaValue("serverIp");
        if (ip) {
            let port: any = SituationServer.getMetaValue("serverPort");
            if (port) {
                port = window.atob(port);
                port = parseInt(port);
            }
            else {
                port = null;
            }
            ip = window.atob(ip);
            return new BaseConnectionSpec(ip, port);
        }

        return null;
    }

    protected getRecordUrlByInject(): string {
        let url: string = SituationServer.getMetaValue("recordUrl");
        if (url) {
            return window.atob(url);
        }

        return null;
    }

    /**
     * 从环境中获取默认的服务器端口，如果为空，则直接使用IP/URL登录
     */
    // protected resolveDefaultServerPort(): number {
    //     let portStr: string = SituationServer.getMetaValue("serverPort");
    //     if (portStr) {
    //         return parseInt(portStr);
    //     }

    //     return null;
    // }

    // protected resolveLobbyUrl(): string {
    //     return SituationServer.getMetaValue("lobbyUrl");
    // }


}
