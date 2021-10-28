import Constants from "../libs/common/scripts/Constants";

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
 * SIT 
 */
export default class LobbyConstants extends Constants {
    public readonly defaultChannelName:string = "lobby";
    public readonly situationId:string | number = "lobby";

    /**
     * 
     *  https://lobby.abbb00.com/
        https://api.abbb00.com/
        wss://api.abbb00.com/lobby/myWebSocket
        wss://arcade.abbb00.com
        wss://chess.abbb00.com
        wss://rc.abbb00.com
        wss://slot.abbb00.com

     */
    // 服务器相关设置
    // 各种API的地址
    // public readonly jpApiUrl:string = "http://uat.hk.abbb00.com:8080/";
    // public readonly jpLobbyServerUrl:string = `ws://uat.hk.abbb00.com:8080/lobby/myWebSocket`;
    public readonly jpApiUrl:string = "https://api.abbb00.com/";
    public readonly jpLobbyServerUrl:string = `wss://api.abbb00.com/lobby/myWebSocket`;



    // 客户端（web）地址
    public readonly jpClientUrl:string = "http://uat.hk.abbb00.com:9090/"


    // 更新服务器路径
    public readonly updatingServerUrl:string = `${this.jpClientUrl}Public/items/`;

    public readonly env: string = "hk-uat";
}
