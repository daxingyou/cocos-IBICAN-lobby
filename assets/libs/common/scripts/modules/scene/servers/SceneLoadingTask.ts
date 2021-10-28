import Task from "../../../utils/Task";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class SceneLoadingTask extends Task {

    constructor(sceneName: string) {
        super(sceneName);
    }

    onTaskStart(): void {
        cc.director.preloadScene(<string>this.taskId, this.onSceneProgress.bind(this), this.onLoad.bind(this));
    }

    onTaskCancel(): void {
    }

    private onSceneProgress(completedCount: number, totalCount: number, item: any): void {
        if (totalCount == 0) {
            this.setProgress(1);
        }
        else {
            this.setProgress(completedCount / totalCount);
        }
    }

    /**
     * 场景加载完成的回调
     * @param err 
     */
    private onLoad(err) {
        if (err) {
            this.setError(err);
        }
        else {
            // 成功加载
            this.setComplete();
        }
    }

}
