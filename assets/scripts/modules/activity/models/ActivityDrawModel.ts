import { Winning, PrizePool } from "../../../protocol/protocols/protocols";


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

export default class ActivityDrawModel extends riggerIOC.Model {

    /**大奖纪录 */
    private _grandWinningList: Winning[] = []
    /**个人中奖记录 */
    private _myWinningList: Winning[] = []
    /**最新中奖记录 */
    private _latestWinningList: Winning[] = []
    /**奖池信息*/
    private _poolList: PrizePool[] = []
    /**玩家今日积分*/
    private _todayScore: number = 0
    /**玩家明日积分*/
    private _tomorrowScore: number = 0

    /**玩家第一次打开界面*/
    private _firstIntPut: boolean = true

    constructor() {
        super();
    }

    dispose() {
        this._grandWinningList = [];
        this._myWinningList = [];
        this._latestWinningList = [];
    }

    get grandWinningList(): Winning[] {
        return this._grandWinningList;
    }
    set grandWinningList(v: Winning[]) {
        this._grandWinningList = v;
    }
    get myWinningList(): Winning[] {
        return this._myWinningList;
    }
    set myWinningList(v: Winning[]) {
        this._myWinningList = v;
    }
    get latestWinningList(): Winning[] {  
        this._latestWinningList.forEach(()=>{
            this._latestWinningList.sort((a,b)=>{
               if(a.time>b.time){
                    return 1
               }
               if(a.time<b.time){
                    return -1
               }
            })
        })
        return this._latestWinningList;
    }
    set latestWinningList(v: Winning[]) {
        this._latestWinningList = v;
    }
    get poolList(): PrizePool[] {
        return this._poolList;
    }
    set poolList(v: PrizePool[]) {
        this._poolList = v;
    }
    get todayScore(): number {
        return this._todayScore;
    }
    set todayScore(v: number) {
        this._todayScore = v;
    }
    get tomorrowScore(): number {
        return this._tomorrowScore;
    }
    set tomorrowScore(v: number) {
        this._tomorrowScore = v;
    }

    get firstIntPut(): boolean {
        return this._firstIntPut;
    }
    set firstIntPut(v: boolean) {
        this._firstIntPut = v;
    }

}

export enum PoolType {
    SliverTurn = 1,     //白银转盘
    GoldTurn = 2,   //黄金转盘
    DiamonTurn = 3      //钻石转盘
}


