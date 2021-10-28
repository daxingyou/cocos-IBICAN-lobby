import { BeatHeartReq, BeatHeartResp } from "../../scripts/protocol/protocols/protocols";
import NetworkServer, { ChannelName } from "../common/scripts/modules/network/servers/NetworkServer";

/**
* 心跳包协议插件 
*/
@rigger.utils.DecoratorUtil.register
export default class HeartBeatProtocolPlugin extends rigger.AbsServicePlugin {
	/**
	 * 插件名（全名，只有当具有此字段时才能进行注册)
	 */
	static pluginName?: string = "HeartBeatProtocolPlugin";

	// private static commandsMap:{} = {};

	// @riggerIOC.inject(BeatHeartRespSignal)
	// private heartBeartRespSignal: BeatHeartRespSignal;

	// @riggerIOC.inject(NetworkServer)
	// private networkServer: NetworkServer;

	constructor() {
		super();
	}

	public ping(channelName: ChannelName): void {
		let req: BeatHeartReq = new BeatHeartReq();
		// this.networkServer.send(channelName, CommandCodes.PPBeatHeartReq, req);
		// cc.log(`now ping, channel:${channelName}, code:${rigger.service.HeartBeatService["$commandCodes"][channelName].PPBeatHeartReq}`)
		let sender = rigger.service.HeartBeatService["$netsender"][channelName]
		sender.send(channelName, 
			rigger.service.HeartBeatService["$commandCodes"][channelName].PPBeatHeartReq, req)
		
	}

	public receivePong(channelName: ChannelName) {
		// console.log("receive pong");
		// this.heartBeartRespSignal.on(this, this.onHeartBeartResp);
		rigger.service.HeartBeatService["$respSignal"][channelName].on(this, this.onHeartBeartResp);
	}

	public cancelReceivePong(channelName: ChannelName) {
		// console.log(`cancel receive pong:${channelName}`);

		// this.heartBeartRespSignal.off(this, this.onHeartBeartResp);
		let signal = rigger.service.HeartBeatService["$respSignal"][channelName];
		if (signal) {
			signal.off(this, this.onHeartBeartResp);
		}
	}

	/**
	 * 插件开始时的回调 
	 * @param resultHandler 
	 * @param startupArgs 
	 */
	protected onStart(resultHandler: rigger.RiggerHandler, startupArgs: any[]): void {
		resultHandler.success();
	}

	/**
	 * 插件停止时的回调 
	 * @param resultHandler 
	 */
	protected onStop(resultHandler: rigger.RiggerHandler): void {
		resultHandler.success();
	}

	/**
	 * 插件重启时的回调
	 * @param resultHandler 
	 */
	protected onRestart(resultHandler: rigger.RiggerHandler): void {
		resultHandler.success();
	}

	private onHeartBeartResp(resp: BeatHeartResp) {
		// cc.log("receive heart beat")
		rigger.service.TimeService.instance.setServerTime(resp.serverSec * 1000);
		this.getOwner<rigger.service.HeartBeatService>().pong();
	}
}