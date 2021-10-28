import Constants from "../../../Constants";
import LoginRequest from "../../login/models/LoginRequest";
import BaseConnectionSpec from "../../network/servers/BaseConnectionSpec";

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
 * 记录游戏运行环境的数据
 */
export default class SituationModel extends riggerIOC.Model {

    @riggerIOC.inject(Constants)
    private constants: Constants;

    /**
     * 获取全局环境中的登录描述信息
     * 该信息中描述了成功登录帐号所需的所有信息
     * 此信息可以由登录命令处理
     * @param situationId 
     */
    public getLoginSpecGlobal(situationId?: string | number): LoginRequest | null | undefined {
        let key: string = this.makeLoginSpecSituationKey(situationId);
        return this.getGlobal(key);
    }

    /**
     * 将登录描述信息设置到全局环境中
     * 该信息中描述了成功登录帐号所需的所有信息
     * 此信息可以由登录命令处理
     * @param situationId 
     * @param spec 
     */
    public setLoginSpecGlobal(spec: LoginRequest, situationId?: string | number): void {
        let key: string = this.makeLoginSpecSituationKey(situationId);
        this.setGlobal(key, spec);
    }

    /**
     * 清除全局环境中的登录描述信息
     * @param situationId 
     */
    public clearLoginSpecGlobal(situationId?: string | number): void {
        let key: string = this.makeLoginSpecSituationKey(situationId);
        this.setGlobal(key, undefined);
    }

    /**
     * 获取全局环境中的连接描述信息
     * @param situationId 
     */
    public getConnectionSpecGlobal(situationId?: string | number): BaseConnectionSpec | null | undefined {
        let key: string = this.makeConnectionSpecSituationKey(situationId);
        return this.getGlobal(key);
    }

    /**
     * 将连接描述信息设置到全局环境中去
     * @param spec 
     * @param situationId 
     */
    public setConnectionSpecGlobal(spec: BaseConnectionSpec, situationId?: string | number): void {
        let key: string = this.makeConnectionSpecSituationKey(situationId);
        this.setGlobal(key, spec);
    }

    /**
     * 清除全局环境中的连接描述信息
     * @param situationId 
     */
    public clearConnectionSpecGlobal(situationId?: string | number): void {
        this.setConnectionSpecGlobal(undefined, situationId);
    }

    public getRecordUrlGlobal(situationId?: string | number): string {
        let key: string = this.makeRecordUrlSituationKey(situationId);
        return this.getGlobal(key);
    }

    public setRecordUrlGlobal(recordUrl: string, situationId?: string | number): void {
        let key: string = this.makeRecordUrlSituationKey(situationId);
        this.setGlobal(key, recordUrl);
    }

    public clearRecordUrlGlobal(situationId: string | number): void {
        this.setRecordUrlGlobal(undefined, situationId);
    }

    /**
     * 获取全局的常量表，此接口只在处于 LobbyVerifier环境下才有用
     * @param situationId 
     */
    public getConstantsGlobal(situationId?: string | number): Constants {
        let key: string = this.makeConstantsSituationKey(situationId);
        return this.getGlobal(key);
    }

    /**
     * 设置全局常量表，只在 LobbyVerifier环境下才有效
     * @param constants 
     * @param situationId 
     */
    private setConstantsGlobal(constants: Constants, situationId?: string | number) {
        let key: string = this.makeConstantsSituationKey(situationId);
        this.setGlobal(key, constants);
    }

    /**
     * 当前是否处于大厅中
     */
    public get isInLobby(): boolean {
        return !!this.getGlobal(this.makeSituationKey("inLobby"));
    }

    /**
     * 设置大厅状态 
     */
    public set isInLobby(stat: boolean) {
        this.setGlobal(this.makeSituationKey("inLobby"), stat);
    }

    /**
     * 是否处于大厅检查器环境中
     */
    public get isInVerifier(): boolean {
        return !!this.getGlobal(this.makeSituationKey("inVerifier"));
    }

    public set isInVerifier(stat: boolean) {
        this.setGlobal(this.makeSituationKey("inVerifier"), stat);
    }

    /**
     * 从全局空间中获取键对应的值
     * @param key 
     */
    public getGlobal(key: string): any {
        if (!cc["$sit_global"]) return null;
        return cc["$sit_global"][key];
    }

    /**
     * 将键值对设置到全局空间中去
     * @param key 
     * @param value 
     */
    public setGlobal(key: string, value: any): void {
        if (!cc["$sit_global"]) cc["$sit_global"] = {};
        cc["$sit_global"][key] = value;
    }

    public clearGlobal(): void {
        cc["$sit_global"] = undefined;
    }

    private makeSituationKey(situationId: string | number): string {
        return `_sit_${situationId}`;
    }

    private makeLoginSpecSituationKey(situationId: string | number): string {
        situationId = this.getSituationId(situationId);
        return this.makeSituationKey(`login_spec_${situationId}`);
    }

    private makeConnectionSpecSituationKey(situationId?: string | number): string {
        situationId = this.getSituationId(situationId);
        return this.makeSituationKey(`${`conn_spec_${situationId}`}`);
    }

    private makeRecordUrlSituationKey(situationId?: string | number): string {
        situationId = this.getSituationId(situationId);
        return this.makeSituationKey(`record_url_${situationId}`);
    }

    /**
     * 获取常量表的环境KEY
     * @param situationId 
     */
    private makeConstantsSituationKey(situationId?: string | number): string {
        situationId = this.getSituationId(situationId);
        return this.makeSituationKey(`${`constants_${situationId}`}`);
    }

    private getSituationId(situationId?: string | number): string | number {
        if (situationId == null || situationId == undefined) {
            return this.constants.situationId;
        }

        return situationId;
    }

    constructor() {
        super();
        // if (this.isInVerifier) {
        //     this.setConstantsGlobal(this.constants);
        // }
    }

    // dispose(): any {
    // }

}
