import BaseMarqueeModel from "../../../../libs/common/scripts/modules/marquee/model/BaseMarqueeModel";
import { BroadcastTypeResp } from "../../../protocol/protocols/protocols";
import Queue from "../../../../libs/common/scripts/utils/Queue";


export default class LobbyMarqueeModel extends BaseMarqueeModel<BroadcastTypeResp> {
    constructor() {
        super();
    }

    /**
     * 游戏广播排序
     */
    protected sortGameMsg(gameList: BroadcastTypeResp[]) {
        gameList.sort(this.sortFn);
    }

    /**
     * 系统广播排序
     */
    protected sortSystemMsg(systemList: BroadcastTypeResp[]) {
        systemList.sort(this.sortFn);
    }

    /**
     * 优先级从大到小
     * @param a 
     * @param b 
     */
    sortFn(a: BroadcastTypeResp, b: BroadcastTypeResp) {
        return b.priority - a.priority;
    }
}