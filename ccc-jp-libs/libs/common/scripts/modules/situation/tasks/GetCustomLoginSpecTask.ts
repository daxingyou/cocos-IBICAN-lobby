import Task from "../../../utils/Task";
import LoginRequest from "../../login/models/LoginRequest";

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
 * 获取自定义登录描述信息的任务
 * 建议在此任务中通过交互界面由用户输入相关信息
 * 完成后，应该设置 LoginRequest
 * 
 */
export default abstract class GetCustomLoginSpecTask extends Task<LoginRequest, any> {
    onTaskStart(): void {
        this.setError("not implemented GetCustomLoginSpecTask")
    }

    /**
     * 设置完成结果
     * @param result 
     */
    setComplete(result: LoginRequest): void {
        super.setComplete(result);
    }
}
