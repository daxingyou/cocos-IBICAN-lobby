import JPMediator from "../../../../libs/common/scripts/utils/JPMediator";
import PersonalCenterPanel from "./PersonalCenterPanel";

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

export default class PersonalCenterMediator extends JPMediator {
    @riggerIOC.inject(PersonalCenterPanel)
    protected view: PersonalCenterPanel;

    constructor() {
        super();
    }

    onInit() {
        super.onInit();
    }

    onShow() {
        super.onShow();
        this.addProtocolListener();
        this.view.personalInfoToggle.check();
        this.view.personalInfoToggle.node.emit('toggle', this.view.personalInfoToggle);
    }

    onHide() {
        super.onHide();
        this.removeProtocolListener();
    }

    onDispose() {
        super.onDispose();
    }

    addProtocolListener() {

    }

    removeProtocolListener() {

    }

}
