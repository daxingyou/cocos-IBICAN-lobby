import Task from "../../../../../libs/common/scripts/utils/Task";
import SubGameEntity, { SubGameId, LaunchType } from "../../models/SubGameEntity";
import SubGameRunnerMediator from "../../views/SubGameRunnerMediator";
import LaunchInGameSubGameTask from "./LaunchInGameSubGameTask";
import SubGamesModel from "../../models/SubGamesModel";
import VerifySubGameTask from "./VerifySubGameTask";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class LaunchSubGameTask extends Task<boolean> {

    @riggerIOC.inject(LaunchInGameSubGameTask)
    private inGameLaunchTask: LaunchInGameSubGameTask;

    @riggerIOC.inject(SubGamesModel)
    private subGameModel: SubGamesModel;

    constructor() {
        super();
        this.timeout = 10000;
    }

    async onTaskStart(subGameId: SubGameId) {
        let subGame: SubGameEntity = this.subGameModel.getSubGame(subGameId);
        if (!subGame) {
            throw new Error(`Launch Sub Game Failed, invalid sub game id:${subGameId}`);
        }

        if (subGame.launchType == LaunchType.Native) {
            this.launchInGame(subGameId);
        }
        else {
            this.launchByWebView(subGameId);
        }
    }

    onTaskCancel() {
        // cc.log(`cancel laucnh`)
    }

    private async launchByWebView(subGameId: SubGameId): Promise<any> {
        // 通知运行子游戏
        let runnerAgent: SubGameRunnerMediator = SubGameRunnerMediator.instance;
        if (runnerAgent) {
            try {
                await runnerAgent.run(subGameId);
                this.setComplete();

            } catch (error) {
                cc.log(`in game task:${error}`)
                this.cancel(error);
            }

        } else {
            this.cancel("no runner");
        }
    }

    private async launchInGame(subGameId: SubGameId): Promise<any> {
        if (this.inGameLaunchTask.isWaitting()) return;
        this.inGameLaunchTask.reset();
        let ret = await this.inGameLaunchTask.start(subGameId).wait();
        if (ret.isOk) {
            this.setComplete();
        }
        else {
            console.log(`preload sub game error:${ret.error}`)
            this.setError(ret.error);
        }
    }

    async verifySubGame(subGameId: SubGameId) {
        // 进行分析
        if (window["LOBBY-VERIFIER"]) {
            let verifyTask: VerifySubGameTask = new VerifySubGameTask();
            let report = await verifyTask.wait(subGameId);
            cc.log(`report:${report.result}`);
        }
    }
}
