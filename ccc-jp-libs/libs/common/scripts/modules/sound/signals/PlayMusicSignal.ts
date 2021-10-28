/**
 * 播放背景音乐的信号
 */
export default class PlayMusicSignal extends riggerIOC.Signal<[string/**声音的url */, 
    boolean/**是否循环,默认为true */, boolean/** 当URL相同时，是否强制重新播放，如果为false,如果URL与正在播放的相同，则*/]> {
    dispatch(args:[string, boolean, boolean] = [null, null, false]){
        super.dispatch(args);
    }
}