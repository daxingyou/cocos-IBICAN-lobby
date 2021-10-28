// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export enum BaseAlertStyle {
    YES = 1, // 只有确定按钮
    YES_NO = 2, // 有确定和取消按钮
}

export enum BaseAlertResult{
    YES = 1,
    NO = 2
}

export default class BaseAlertInfo {
    style: BaseAlertStyle = BaseAlertStyle.YES_NO;
    title: string = "";
    content: string = "";

}
