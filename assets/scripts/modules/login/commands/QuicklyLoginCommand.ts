import LoginRequest from "../../../../libs/common/scripts/modules/login/models/LoginRequest";
import RequestLoginSignal from "../../../../libs/common/scripts/modules/login/signals/RequestLoginSignal";
import NativeUtils from "../../../../libs/native/NativeUtils";
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


export default class QuicklyLoginCommand extends riggerIOC.Command {
    @riggerIOC.inject(RequestLoginSignal)
    private requestLoginSignal: RequestLoginSignal;

    @riggerIOC.inject(SituationModel)
    private sitModel: SituationModel;

    constructor() {
        super();
    }

    execute() {
        let id = NativeUtils.getDeviceId();
        cc.log(`deviceID: ${id}`);
        let req: LoginRequest = new LoginRequest();
        req.deviceId = id;
        // req.deviceId = 'bc3e957626d38f74';
        // req.deviceId = 'bc3e976526d38f98';
        req.platform = 3;

        this.sitModel.setLoginSpecGlobal(req);
        this.requestLoginSignal.dispatch();
    }
}
