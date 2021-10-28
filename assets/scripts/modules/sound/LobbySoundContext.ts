import SoundContext from "../../../libs/common/scripts/modules/sound/SoundContext";
import LobbySoundServer from "./servers/LobbySoundServer";
import LobbySoundChannels from "./LobbySoundChannels";
import JPEffectAudio from "../../../libs/common/scripts/utils/JPEffectAudio";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbySoundContext extends SoundContext {
    /**
     * 绑定注入
     */
    bindInjections(): void {
        super.bindInjections();
        this.injectionBinder.bind(LobbySoundServer).toSingleton();

        // 绑定声音
        // 面板弹出的声音频道
        this.injectionBinder.bind(LobbySoundChannels.PANEL_POP_UP).to(JPEffectAudio).toSingleton();
        this.injectionBinder.bind(LobbySoundChannels.LOBBY_BEAUTY_SPEAKING).to(JPEffectAudio).toSingleton();
        this.injectionBinder.bind(LobbySoundChannels.CLICK_EFFECT).to(JPEffectAudio).toSingleton();
    }

    /**
     * 绑定命令
     */
    bindCommands(): void {
        super.bindCommands();
    }

    /**
     * 绑定界面与Mediator
     */
    bindMediators(): void {
    }

    /**
     * 模块启动时的回调
     */
    protected onStart(): void {
        super.onStart();
    }
}
