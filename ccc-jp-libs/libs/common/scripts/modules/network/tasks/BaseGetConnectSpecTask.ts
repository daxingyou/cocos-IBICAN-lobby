import Task from "../../../utils/Task";
import BaseConnectionSpec from "../servers/BaseConnectionSpec";

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
 * 获连接信息任务的基类，在框架中被注入成了单例
 * 框架只有在尝试从环境中获取连接信息失败后，才会开启此任务
 */
export default abstract class BaseGetConnectSpecTask extends Task<BaseConnectionSpec, any> {

    setComplete(spec: BaseConnectionSpec):void{
        super.setComplete(spec);
    }

}
