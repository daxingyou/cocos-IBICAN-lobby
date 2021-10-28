import OnChangeSceneCompleteSignal from "../../../../libs/common/scripts/modules/scene/signals/OnChangeSceneCompleteSignal";

export default class LobbyOnChangeSceneCompleteSignal extends OnChangeSceneCompleteSignal{
    constructor(){
        super();
        this.setInstanceGlobal();
    }
}