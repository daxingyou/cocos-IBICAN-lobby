import LobbyMarqueeModel from "../model/LobbyMarqueeModel";
import LobbyPushMarqueeSignal from "../signals/LobbyPushMarqueeSignal";
import { BroadcastTypeRespSignal } from "../../../protocol/signals/signals";
import { BroadcastTypeResp } from "../../../protocol/protocols/protocols";

/**跑马灯服务 */
export default class LobbyMarqueeServer extends riggerIOC.Server {

    @riggerIOC.inject(BroadcastTypeRespSignal)
    private broadcastTypeRespSignal: BroadcastTypeRespSignal;

    @riggerIOC.inject(LobbyPushMarqueeSignal)
    private pushMarqueeSignal: LobbyPushMarqueeSignal;

    @riggerIOC.inject(LobbyMarqueeModel)
    private model: LobbyMarqueeModel;

    constructor() {
        super();        
        this.broadcastTypeRespSignal.on(this, this.onGetTypeResp);
        // setInterval(()=> {
        //     let priority = [1, 2, 3, 4, 5, 6][Math.floor(Math.random() * 6)];
        //     this.massageTest(priority);
        // }, 2000)
    }

    dispose(): void {
        this.broadcastTypeRespSignal.off(this, this.onGetTypeResp);
        super.dispose();
    }

    // public massageTest(priority: number){
    //     let temp = new BroadcastTypeResp();
    //     temp.body = `priority-${priority}: just for test`;
    //     temp.priority = priority;
    //     this.onGetTypeResp(temp)

    // }

    private onGetTypeResp(resp: BroadcastTypeResp) {
        // let time = resp.time;
        // let type = resp.type;
        // let tempString: string = `<color=#ffffff><size=23>本游戏将在<color=#2dff5e>${time}</color>分钟后关闭进行【<color=#fff95a>${type}</color>】维护，请您合理安排游戏时间哦…</size></color>`;
        let tempString = resp.body
        this.model.pushSystemMsg(resp);
        this.pushMarqueeSignal.dispatch();
    }

    // private onGetType4Resp(resp: BroadcastType4Resp) {
    //     this.model.pushSystemMsg(`<color=#ffffff><size=23>${resp.text}</size></color>`);
    //     this.pushMarqueeSignal.dispatch();
    // }


    // private onGetType3Resp(resp: BroadcastType3Resp) {
    //     let nick = resp.nick;
    //     let game = resp.game;
    //     let amount = resp.amount;
    //     let arg1 = "";
    //     let arg2 = "";
    //     let tempString: string = `<color=#ffffff><size=23>恭喜玩家<color=#2dff5e>${nick}</color>在<color=#fff95a>${game}</color>使用<color=#ff7623>${arg1}</color>一炮击杀<color=#23fff2>${arg2}</color>，赢得<color=#fff95a>${amount}</color>元</size></color>`;
    //     this.model.pushGameMsg(tempString);
    //     this.pushMarqueeSignal.dispatch();
    // }

    // private onGetType2Resp(resp: BroadcastType2Resp) {
    //     let nick = resp.nick;
    //     let game = resp.game;
    //     let amount = resp.amount;
    //     let tempString: string = `<color=#ffffff><size=23>恭喜玩家<color=#2dff5e>${nick}</color> 在 <color=#fff95a>${game}</color>财神附体，赢得<color=#fff95a>${amount}</color>元</size></color>`;
    //     this.model.pushGameMsg(tempString);
    //     this.pushMarqueeSignal.dispatch();
    // }

    // private onGetType1Resp(resp: BroadcastType1Resp) {
    //     let nick = resp.nick;
    //     let game = resp.game;
    //     let card_type = resp.card_type;
    //     let amount = resp.amount;
    //     let tempString: string = `<color=#ffffff><size=23>恭喜玩家<color=#2dff5e>${nick}</color> 在 <color=#fff95a>${game}</color>拿到 <color=#ff7623>${card_type}</color>，一把赢得<color=#fff95a>${amount}</color>元</size></color>`;
    //     this.model.pushGameMsg(tempString);
    //     this.pushMarqueeSignal.dispatch();
    // }
}