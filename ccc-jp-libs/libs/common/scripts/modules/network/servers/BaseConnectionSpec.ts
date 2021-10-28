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
 * 网络连接规范，用于描述一个连接的信息，以便建立连接
 */
export default class BaseConnectionSpec {
    constructor(url: string, port: number = null) {
        this.url = url;
        this.port = port;
    }
    /**
     * IP或URL
     */
    url: string;

    /**
     * 端口,可以不做规定
     */
    port?: number = null;

}
