import RegisterRequest from "../models/RegisterRequest";
import LoginServer from "../servers/LoginServer";
import Task from "../../../utils/Task";
import PushWaitingQueueSignal from "../../tips/signals/PushWaitingQueueSignal";
import BaseAlertPanel from "../../tips/views/BaseAlertPanel";
import BaseAlertInfo, { BaseAlertResult, BaseAlertStyle } from "../../tips/models/BaseAlertInfo";
import ShowRegisterPanelSignal from "../signals/ShowRegisterPanelSignal";
import ShowLoginPanelSignal from "../signals/ShowLoginPanelSignal";
import PassPortInfo from "../models/PassportInfo";
import LoginModel from "../models/LoginModel";

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
 * 注册命令
 */
@riggerIOC.autoDispose
export default class RequestRegisterCommand extends riggerIOC.WaitableCommand {

    @riggerIOC.inject(LoginServer)
    private loginServer: LoginServer;

    @riggerIOC.inject(PushWaitingQueueSignal)
    private pushWaitingSignal: PushWaitingQueueSignal;

    @riggerIOC.inject(LoginModel)
    private loginModel:LoginModel;

    async execute(request: RegisterRequest) {
        let task: Task = this.loginServer.requestRegister(request);
        // 显示提示界面
        this.pushWaitingSignal.dispatch(["正在为您注册", task])
        // 注册并等待结果
        let resp:riggerIOC.Result<string, string> = await task.wait();
        task.dispose();
        this.parseResp(resp.result);
    }

    @riggerIOC.inject(ShowRegisterPanelSignal)
    private regSignal: ShowRegisterPanelSignal;

    @riggerIOC.inject(ShowLoginPanelSignal)
    private loginSignal: ShowLoginPanelSignal;

    /**
     * 分析注册返回结果
     * @param resp 
     */
    private async parseResp(resp: string) {
        cc.log(`resp:${resp}`);
        let respObj = JSON.parse(resp);
        let info: BaseAlertInfo = new BaseAlertInfo();
        if (respObj.code !== 0) {
            info.content = respObj.msg;
            info.style = BaseAlertStyle.YES;
            let ret: BaseAlertResult = await BaseAlertPanel.show(info).wait();
            // 是否再次显示注册界面？
            this.regSignal.dispatch();
        }
        else {
            let pass: PassPortInfo = new PassPortInfo();
            pass.account = respObj.data.mobile;
            pass.nickName = respObj.data.nickname;
            pass.userId = respObj.data.userId;
            pass.icon = respObj.data.headPortrait;
            this.loginModel.updatePassPort(pass)
            
            info.content = `恭喜您注册成功\n是否马上登录?`
            info.style = BaseAlertStyle.YES_NO;
            let ret: BaseAlertResult = await BaseAlertPanel.show(info).wait();
            if(BaseAlertResult.YES == ret){
                this.loginSignal.dispatch(respObj.data.mobile);
            }
        }
    }
    onCancel():void{
        
    }
}
