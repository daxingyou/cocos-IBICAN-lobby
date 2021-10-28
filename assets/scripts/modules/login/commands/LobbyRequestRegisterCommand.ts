import RegisterRequest from "../../../../libs/common/scripts/modules/login/models/RegisterRequest";
import Task from "../../../../libs/common/scripts/utils/Task";
import ShowRegisterPanelSignal from "../../../../libs/common/scripts/modules/login/signals/ShowRegisterPanelSignal";
import ShowLoginPanelSignal from "../../../../libs/common/scripts/modules/login/signals/ShowLoginPanelSignal";
import BaseAlertInfo, { BaseAlertStyle, BaseAlertResult } from "../../../../libs/common/scripts/modules/tips/models/BaseAlertInfo";
import BaseAlertPanel from "../../../../libs/common/scripts/modules/tips/views/BaseAlertPanel";
import PassPortInfo from "../../../../libs/common/scripts/modules/login/models/PassportInfo";
import LoginServer from "../../../../libs/common/scripts/modules/login/servers/LoginServer";
import PushWaitingQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushWaitingQueueSignal";
import LoginModel from "../../../../libs/common/scripts/modules/login/models/LoginModel";
import PushTipsQueueSignal from "../../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import LoginRequest from "../../../../libs/common/scripts/modules/login/models/LoginRequest";
import RequestLoginSignal from "../../../../libs/common/scripts/modules/login/signals/RequestLoginSignal";
import ChangeSceneSignal from "../../../../libs/common/scripts/modules/scene/signals/changeSceneSignal";
import SituationModel from "../../../../libs/common/scripts/modules/situation/models/SituationModel";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class LobbyRequestRegisterCommand extends riggerIOC.WaitableCommand {
    @riggerIOC.inject(LoginServer)
    private loginServer: LoginServer;

    @riggerIOC.inject(PushWaitingQueueSignal)
    private pushWaitingSignal: PushWaitingQueueSignal;

    @riggerIOC.inject(LoginModel)
    private loginModel:LoginModel;

    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    constructor() {
        super();
    }

    async execute(request: RegisterRequest) {
        let task: Task = this.loginServer.requestRegister(request);
        // 显示提示界面
        this.pushWaitingSignal.dispatch(["正在为您注册", task])
        // 注册并等待结果
        let resp = await task.wait();
        task.dispose();
        this.parseResp(resp.result, request);
    }

    @riggerIOC.inject(ShowRegisterPanelSignal)
    private regSignal: ShowRegisterPanelSignal;

    @riggerIOC.inject(ShowLoginPanelSignal)
    private loginSignal: ShowLoginPanelSignal;

    @riggerIOC.inject(RequestLoginSignal)
    private requestLoginSignal: RequestLoginSignal;

    @riggerIOC.inject(ChangeSceneSignal)
    private changeSceneSignal: ChangeSceneSignal;

    @riggerIOC.inject(SituationModel)
    private situationModel: SituationModel;
    /**
     * 分析注册返回结果
     * @param resp 
     */
    private async parseResp(resp: string, request: RegisterRequest) {
        cc.log(`resp:${resp}`);
        let respObj = JSON.parse(resp);
        let info: BaseAlertInfo = new BaseAlertInfo();
        if (respObj.code !== 0) {
            this.pushTipsQueueSignal.dispatch(respObj.msg);
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
                // this.loginSignal.dispatch(respObj.data.mobile);
                let req: LoginRequest = new LoginRequest();
                req.account = request.account;
                req.password = request.password;
                req.ifStorePassword = true;
                this.situationModel.setLoginSpecGlobal(req);
                this.requestLoginSignal.dispatch();
            }
        }
    }
}
