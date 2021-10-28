import Task from "../../../../../libs/common/scripts/utils/Task";
import { SubGameId } from "../../models/SubGameEntity";
import SceneUtils from "../../../../../libs/common/scripts/utils/SceneUtils";
import Constants from "../../../../../libs/common/scripts/Constants";
import SituationModel from "../../../../../libs/common/scripts/modules/situation/models/SituationModel";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class VerifySubGameTask extends Task<string> {
    protected subGameId: SubGameId;
    protected report: string = "";

    @riggerIOC.inject(SituationModel)
    protected situationModel: SituationModel;

    @riggerIOC.inject(Constants)
    protected constants: Constants;

    onTaskStart(subGameId: SubGameId): void {
        this.subGameId = subGameId;
        this.verify();
    }

    verify(): void {
        this.verifyScenes();
        this.verifyConstants();
        this.verifyInjectionBinding();
        this.verifyAssets();

        this.setComplete(this.report);
    }

    /**
     * 检查是否有规定的场景
     */
    private verifyScenes(): void {
        let inLobbyScene: string = SceneUtils.getInLobbyScene(this.subGameId);
        this.report += this.makeCheckBlock("CHECK-SCENES", this.makeCheckResult("in-lobby-scene", inLobbyScene, !!inLobbyScene));
    }


    private verifyConstants(): void {
        let constants: Constants = this.situationModel.getConstantsGlobal(this.subGameId);
        let report: string = this.makeCheckResult("if-exist", (!!constants).toString(), !!constants);
        if (constants) {
            // id
            report += this.makeCheckResult("situation-id", constants.situationId.toString(),
                (!!constants.situationId) && constants.situationId !== this.constants.situationId)

            // channel-name
            report += this.makeCheckResult("channel-name", constants.defaultChannelName,
                (!!constants.defaultChannelName) && constants.defaultChannelName !== this.constants.defaultChannelName);
        }
        this.report += this.makeCheckBlock("CHECK-CONSTANTS", report);
    }

    private verifyInjectionBinding(): void {
        // cc.log(`now check injection bindings`);
        let app: riggerIOC.ApplicationContext = riggerIOC.ApplicationContext.getApplication(this.subGameId);
        this.report += this.makeCheckBlock("CHECK-APP", this.makeCheckResult(`app-id:${this.subGameId}`, app ? "ok" : "null", !!app));
        if(!app) return;
        
        // cc.log(`get app, id:${this.subGameId}, app:${app}`);
        let statiscics: {
            [id: string]: riggerIOC.InjectionStatistics[];
        } = app.injectionStatistics;
        // cc.log(`injection staticsics:${statiscics}`);
        let report: string = "";
        for (let k in statiscics) {
            let injections = statiscics[k];
            // cc.log(`injections:${injections}, k:${k},length:${injections.length}`);
            if (injections.length > 1) {
                let ret: string = `id:${k}\r\n`;
                for (let i: number = 0; i < injections.length; ++i) {
                    let statics: riggerIOC.InjectionStatistics = injections[i];
                    // cc.log(`statics:${statics}`);
                    ret += `\t\towner:${statics.owner ? this.getFunctionName(statics.owner.constructor) : "null"}, class:${this.getFunctionName(statics.fromConstructor)}\r\n`;
                }
                report += this.makeCheckResult("check-injection", ret, false)
            }
        }

        this.report += report;
    }

    private verifyAssets(): void {

    }

    private makeCheckBlock(title: string, ret: string): string {
        let starting: string = `===== ${title} =====\r\n`;
        let ending = starting;
        return starting + ret + ending;
    }

    private makeCheckResult(title: string, value: string, isOk: boolean = false): string {
        return `${title}:${value} ====> ${isOk ? "ok" : "failed"}\r\n`;
    }

    private getFunctionName(f: Function):string{
        return f.name || f.toString().match(/function\s*([^(]*)\(/)[1]
    }

    onTaskCancel(): void {

    }
}
