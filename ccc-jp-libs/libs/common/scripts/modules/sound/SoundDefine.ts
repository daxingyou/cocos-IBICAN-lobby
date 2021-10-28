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

export default class SoundDefine{

    public static readonly SOUND_TYPE:string = "sound";
    public static readonly MUSIC_TYPE:string = "music";
}

export class SoundOPDefine{
    public static readonly OP_INIT:string = "op_init";
    public static readonly OP_SET_SOUND_TOGGLE:string = "setSound";
    public static readonly OP_SET_MUSIC_TOGGLE:string = "setMusic";

    public static readonly OP_SET_SOUND_VOLUME:string = "setSoundVolume";
    public static readonly OP_SET_MUSIC_VOLUME:string = "setMusicVolume";

    public static readonly OP_PLAY_MUSIC:string = "playMusic";
    public static readonly OP_STOP_MUSIC:string = "stopSMusic";

    public static readonly OP_PLAY_SOUND:string = "playSound";
    public static readonly OP_STOP_SOUND:string = "stopSound";
}

export class SoundUrlDefine{
    public static readonly MUSIC_SCENE:string = "audio/music/Lobby_BGM";
    public static readonly MUSIC_SLOT_SCENE:string = "audio/music/Slot_BGM";
    public static readonly MUSIC_ARC_SCENE:string = "audio/music/Arc_BGM";
    
    public static readonly SOUND_BUTTON_CLICK:string = "audio/sound/Currency_Button";
    public static readonly SOUND_CLICK_HEARTS:string = "audio/sound/Click_Hearts";
    public static readonly SOUND_DOWDLOAD_COMPLETE:string = "audio/sound/Download_Complete";
    public static readonly SOUND_WELCOME:string = "audio/sound/Welcome";

    public static readonly SOUND_SAFE_BOX:string = "audio/sound/SafeBox";
    public static readonly SOUND_CASH:string = "audio/sound/Cash";
    public static readonly SOUND_AGENCY:string = "audio/sound/Agency";
    public static readonly SOUND_GIFT_PACKAGE:string = "audio/sound/GiftPackage";
    public static readonly SOUND_STORE:string = "audio/sound/Store";
    public static readonly SOUND_SERVICE:string = "audio/sound/Service";
}