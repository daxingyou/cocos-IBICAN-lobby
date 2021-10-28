// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class SceneModel extends riggerIOC.Model {

    /**
     * 当前所在场景
     */
    public get nowScene(): string {
        return cc.director.getScene().name;
    }
    protected mNowScene: string = null;

    /**
     * 获取预先准备好的场景名称，这通常由大厅给子游戏准备
     */
    public get preparedScene(): string {
        return cc["_prepared_scene"];
    }
    public set preparedScene(scene: string) {
        cc["_prepared_scene"] = scene;
    }
    public clearPreparedScene(){
        this.preparedScene = undefined;
    }

    // dispose(): void {

    // }
}
