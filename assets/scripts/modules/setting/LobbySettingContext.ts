import SettingsContext from "../../../libs/common/scripts/modules/settings/SettingsContext";
import SettingPanel from "./views/SettingPanel";
import SettingMediator from "./views/SettingMediator";

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
export default class LobbySettingContext extends SettingsContext {
    constructor(app: riggerIOC.ApplicationContext){
        super(app);
    }

    bindInjections(): void {
        super.bindInjections();
    }

    bindCommands(): void {
        super.bindCommands();
    }

    bindMediators(): void {
        super.bindMediators();
        this.mediationBinder.bind(SettingPanel).to(SettingMediator);
    }
}
