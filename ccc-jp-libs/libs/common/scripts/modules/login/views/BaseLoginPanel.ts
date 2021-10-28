import Panel from "../../../utils/Panel";
import OnClickLoginSignal from "../signals/OnClickLoginSignal";
import UIManager from "../../../utils/UIManager";
import { strict } from "assert";
import LayerManager from "../../../utils/LayerManager";
import WaitablePanel from "../../../utils/WaitablePanel";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class BaseLoginPanel extends WaitablePanel {
    // 显示一个界面
    public static show(defaultAccount:string = "", layer:string = LayerManager.uiLayerName, closeOther:boolean = true): BaseLoginPanel {
        return UIManager.instance.showPanel(BaseLoginPanel, layer, closeOther, defaultAccount) as BaseLoginPanel;
    }

    /**
     * 用户点击了登录按钮时的信号
     */
    @riggerIOC.inject(OnClickLoginSignal)
    public onClickLoginSignal: OnClickLoginSignal;
}
