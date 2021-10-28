// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class MaintenanceNoticeInfo {
    constructor() {
    }

    public id: number;
    public beginTime: string;
    public endTime: string;
    public maintenanceTitle: string;
    public maintenanceContent: string;
    public updateContent: string;
    public status: number;
    public version: string;
    public versionNumber: number;
    public createTime: string;
    public updateTime: string;
    public isDeleted: boolean;
}
