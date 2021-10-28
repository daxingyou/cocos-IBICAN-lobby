import Panel from "../../../utils/Panel";
import OnClickGetVerifyCodeSignal from "../signals/OnClickGetVerifyCodeSignal";
import OnClickRegisterSignal from "../signals/OnClickRegisterSignal";
import LayerManager, { Layer } from "../../../utils/LayerManager";
import UIManager from "../../../utils/UIManager";
import PanelStackFrame from "../../../utils/PanelStackFrame";

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
export default class BaseRegisterPanel extends Panel {
    public static show(layerOrNameOrID: string | number | Layer = LayerManager.uiLayerName, closeOther: boolean = true, funEx?: any, stackInfo?: PanelStackFrame){
        UIManager.instance.showPanel(BaseRegisterPanel, layerOrNameOrID, closeOther, funEx, stackInfo);
    }

    // 点击获取验证码按钮的信号
    @riggerIOC.inject(OnClickGetVerifyCodeSignal)
    public onClickGetVerifyCodeSignal: OnClickGetVerifyCodeSignal;

    // 点击注册按钮的信号
    @riggerIOC.inject(OnClickRegisterSignal)
    public onClickRegisterBtnSignal: OnClickRegisterSignal;
    
}
