import SubGamesServer from "../servers/SubGamesServer";
import Task from "../../../../libs/common/scripts/utils/Task";
import SubGameEntity, { SubGameId } from "../models/SubGameEntity";

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
 * 下载游戏的命令
 */
export default class UpdateSubGameCommand extends riggerIOC.Command {
    @riggerIOC.inject(SubGamesServer)
    private server: SubGamesServer;

    // 如果下载成功则返回true
    execute(gameId: SubGameId): void {
        // 生成下载任务
        this.server.updateSubGame(gameId);
    }
}
