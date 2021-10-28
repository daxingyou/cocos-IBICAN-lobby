import SubGamesModel from "../models/SubGamesModel";
import SubGamesServer from "../servers/SubGamesServer";
import SubGameEntity from "../models/SubGameEntity";
import LocalSubGameEntity from "../models/LocalSubGameEntity";

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
 * 加载本地存储的子游戏信息
 * 只在原生环境下有用
 * 因为读取文件的操作为同步操作，因此普通命令即可
 */
export default class LoadLocalSubGameInfoCommand extends riggerIOC.Command {
    @riggerIOC.inject(SubGamesModel)
    private subGameModel: SubGamesModel;

    @riggerIOC.inject(SubGamesServer)
    private subGameServer: SubGamesServer;

    execute(): void {
        if(!cc.sys.isNative) {
            return;
        }

        // 是否已经初始化过了
        if(this.subGameModel.isInitlized){
            return;
        }

        // 从本地加载
        let infoList: LocalSubGameEntity[] = this.subGameServer.loadLocalSubGameInfo();
        this.subGameModel.updateSubGamesByLocal(infoList);
    }
}
