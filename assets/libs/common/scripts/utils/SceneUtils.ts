// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class SceneUtils {
    /**
     * 项目的第一个场景(用户可以看到的)
     */
    public static get firstSceneName(): string {
        return this.mFirstSceneName;
    }
    private static mFirstSceneName: string = null;

    /**
     * 获取指定ID的项目在大厅中初始场景名
     * @param id 
     */
    public static getInLobbyScene(id: number | string): string {
        return SceneUtils.mInLobbySceneMap[id];
    }
    private static get mInLobbySceneMap(): { [id: string]: string }{
        if(!cc["~@#mInLobbySceneMap"]) cc["~@#mInLobbySceneMap"] = {};
        return cc["~@#mInLobbySceneMap"];
    }

    /**
     * 向框架注入第一个场景的名称
     * 框架在初始化完成后会跳转到注入的场景
     * @example @SceneUtils.firstScene
     */
    public static firstScene(klass: any, attrName: string) {
        SceneUtils.mFirstSceneName = klass[attrName];
    }

    /**
     * 子项目注册其在大厅中的起始场景
     * @param id 
     */
    public static inLobbyScene(id: string | number = "") {
        if(CC_EDITOR){
            return function(k, a){

            }
        }
        
        return function (klass: any, attrName: string) {
            console.log(`register in-lobby scene,id:${id}, scene:${klass[attrName]}`);
            if(SceneUtils.getInLobbyScene(id)){
                throw new Error(`Duplicated in-lobby scene:${id}`);
            }

            SceneUtils.mInLobbySceneMap[id] = klass[attrName];
        }
    }
}
