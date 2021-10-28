// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseMarqueeModel<T> extends riggerIOC.Model {

    private mSystemMsgList: T[];
    private mGameMsgList: T[];
    private msgCount: number = 0;

    protected msgMaxNum: number = 100;

    constructor() {
        super();
        this.mSystemMsgList = [];
        this.mGameMsgList = [];
    }

    public get systemMsgList(): T[] {
        if (!this.mSystemMsgList) this.mSystemMsgList = [];
        return this.mSystemMsgList;
    }

    public get gameMsgList(): T[] {
        if (!this.mGameMsgList) this.mGameMsgList = [];
        return this.mGameMsgList;
    }

    public getMsgCount(): number{
        return this.msgCount;
    }

    public pushSystemMsg(msg: T) {
        this.systemMsgList.push(msg);
        this.sortSystemMsg && this.sortSystemMsg(this.systemMsgList);
        this.msgCount = this.msgCount + 1;
    }

    public pushGameMsg(msg: T) {
        if (this.msgCount < this.msgMaxNum) {
            this.gameMsgList.push(msg);
            this.sortGameMsg && this.sortGameMsg(this.gameMsgList);
            this.msgCount = this.msgCount + 1;
        }
    }

    public shiftMessage(): T{
        let msg: T = this.systemMsgList.shift();
        if (! msg) {
            msg = this.gameMsgList.shift();
        }
        if (msg) {
            this.msgCount = this.msgCount - 1 >= 0 ? this.msgCount - 1 : 0;
        }
        return msg
    }

    /**
     * 游戏广播排序
     */
    protected sortGameMsg?(gameList: T[]): void;

    /**
     * 系统广播排序
     */
    protected sortSystemMsg?(systemList: T[]): void;


    dispose() {
        delete this.mSystemMsgList;
        delete this.mGameMsgList;
    }
}
