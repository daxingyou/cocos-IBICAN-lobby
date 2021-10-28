import PersistRootNode from "./utils/PersistRootNode";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Application extends cc.Component {
    private app: rigger.BaseApplication;
    constructor() {
        super();
    }

    @property(cc.JsonAsset)
    public applicationConfig: cc.JsonAsset = null;

    // private showBtn: cc.Button; 
    static isStart: boolean = false;

    public get version(): string{
        return this.applicationConfig.json.version;
    }

    start() {
        // cc.debug = cc.debug.DebugMode.INFO
        if (Application.isStart) {
            // console.log("已启动");
            return;
        }
        Application.isStart = true;
        this.node.addComponent(PersistRootNode);
        // cc.game.addPersistRootNode(this.node);
        this.app = rigger.BaseApplication.instance;
        
        this.app.start(
            new rigger.RiggerHandler(this, this.onAppStart),
            {
                // 应用配置
                "applicationConfig": this.applicationConfig.json,
                // 应用实体
                "applictionEntity": this
            }
        );
    }

    private CONNECT_TEST = "lobby";

    onAppStart() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    private onSocketConnect(conName: string) {
        cc.log(`channel connected:${conName}`)
    }

    private onSocketError(err) {
        cc.log(`socket error:${err}`);
    }

    async onKeyUp(e) {
        // cc.log('onKeyUp:' + e.keyCode);
        if(cc.sys.os == cc.sys.OS_ANDROID) {
            if(e.keyCode == cc.macro.KEY.back) {
                Application.exitGame && Application.exitGame();
            }
        }
    }

    /**退出游戏 */
    public static exitGame?(): void;

}