import SceneContext from "../../../libs/common/scripts/modules/scene/SceneContext";
import OnChangeSceneCompleteSignal from "../../../libs/common/scripts/modules/scene/signals/OnChangeSceneCompleteSignal";
import LobbyOnChangeSceneCompleteSignal from "./signals/LobbyOnChangeSceneCompleteSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class LobbySceneContext extends SceneContext {
    bindInjections():void {
        super.bindInjections();
        this.injectionBinder.bind(OnChangeSceneCompleteSignal).toValue(new LobbyOnChangeSceneCompleteSignal());
    }
}
