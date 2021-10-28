import Panel from "./Panel";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass} = cc._decorator;

@ccclass
export default class WaitablePanel extends Panel {
    protected get workWait(): riggerIOC.BaseWaitable {
        if (!this.mWorkWait) this.mWorkWait = new riggerIOC.BaseWaitable();
        return this.mWorkWait;
    }
    private mWorkWait: riggerIOC.BaseWaitable;

    /**
     * 等待面板工作完成
     */
    public wait() {
        return this.workWait.wait();
    }

    public prepare():void{
        this.reset();
    }
    
    public reset(){
        this.workWait.reset();
    }

    /**
     * 使面板进入完成状态 
     * 面板工作完成后调用此接口
     * @param reason 
     */
    public done(reason?: any): void {
        this.workWait.done(reason);
    }

    onHide() {
        this.workWait.done(null);
    }
}
