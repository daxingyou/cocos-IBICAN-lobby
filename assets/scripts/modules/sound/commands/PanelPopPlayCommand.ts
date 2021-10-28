import { SoundUrlDefine, SoundOPDefine } from "../../../../libs/common/scripts/modules/sound/SoundDefine";
import UIManager from "../../../../libs/common/scripts/utils/UIManager";
import LobbyAssetsConfig from "../../assets/LobbyAssetsConfig";
import LobbySoundChannels from "../LobbySoundChannels";
import JPAudio from "../../../../libs/common/scripts/utils/JPAudio";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class PanelPopPlayCommand extends riggerIOC.Command {
    @riggerIOC.inject(LobbySoundChannels.PANEL_POP_UP)
    private popupChannel: JPAudio;

    constructor() {
        super();
    }

    execute(resPath: string) {
        let panelPopRecord = UIManager.instance.getPanelPopRecord();
        if(panelPopRecord[resPath]) {
           let count = panelPopRecord[resPath].count; 
           if(count && count == 1) {
               let soundUrl: string = null;
               switch(resPath) {
                   //保险箱
                   case LobbyAssetsConfig.SAFEBOX_PANEL:
                       soundUrl = SoundUrlDefine.SOUND_SAFE_BOX;
                       break;
                   //转出
                   case LobbyAssetsConfig.WITHDRAW_CASH_PANEL:
                       soundUrl = SoundUrlDefine.SOUND_CASH;
                       break;
                   //绑定手机
                   case LobbyAssetsConfig.BINDING_PHONE:
                       soundUrl = SoundUrlDefine.SOUND_GIFT_PACKAGE;
                       break;
                   //充值
                   case LobbyAssetsConfig.RECHARGE_PANEL:
                       soundUrl = SoundUrlDefine.SOUND_STORE;
                       break;
                   //客服
                   case LobbyAssetsConfig.SERVICE_PANEL:
                       soundUrl = SoundUrlDefine.SOUND_SERVICE;
                       break;
                   default:
                       cc.log(`panelPop: ${resPath}, popCount: ${count}`);
                       break;
               }
               if(soundUrl) {
                   this.popupChannel.play(soundUrl);
               }
           }
        }
    }
}
