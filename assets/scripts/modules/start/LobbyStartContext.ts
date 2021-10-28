import StartContext from "../../../libs/common/scripts/modules/start/StartContext";
import ReadyCommand from "../../../libs/common/scripts/modules/start/commands/ReadyCommand";
import LobbyReadyCommand from "./LobbyReadyCommand";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class LobbyStartContext extends StartContext {
    /**
     * 绑定注入
     */
    // bindInjections(): void {
        // this.injectionBinder.bind(ReadyCommand).to(LobbyReadyCommand);
    // }
}
