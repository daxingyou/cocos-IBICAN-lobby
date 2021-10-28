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
 * 常量表,可被注入
 */
export default class Constants {
    /**
     * 默认的频道名
     * 各个项目可以进行重写
     */
    public readonly defaultChannelName:string = null; 

    /**
     * 游戏ID,请在注入中设为自己的环境ID，一般为游戏ID
     */
    public readonly situationId:string | number = null;

    /**
     * 更新服务器地址,以"/"结尾
     */
    public readonly updatingServerUrl:string = null;
}

