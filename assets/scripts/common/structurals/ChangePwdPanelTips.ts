// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class ChangePwdPanelTips {
    constructor() {
    }

    public oldPwdInputTips: string = '请输入原密码';
    public newPwdInputTips: string = '请输入新密码';
    public newPwdInputAgainTips: string = '请再次输入新的密码';

    public pwdInputRuleTips: string = '请输入6-12位数字和字母组合';
    public twoNewPwdNotEqualTips: string = '两次输入密码不一致';
}
