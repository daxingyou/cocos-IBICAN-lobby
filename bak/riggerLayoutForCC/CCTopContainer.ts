import CCRiggerLayout from "./CCRiggerLayout";
export default class CCTopContainer implements riggerLayout.ITopContainer {
    public static listenerManager:rigger.utils.ListenerManager = new rigger.utils.ListenerManager;
    private static isListened:boolean = false;

    protected item: CCRiggerLayout;
    setItem(item: any): void {
        this.item = item;
    }

    getDesignWidth(): number {
        return this.item.designWidth;
    }

    getDesignHeight(): number {
        return this.item.designHeight;
    }

    getRealWidth(): number {
        return cc.view.getFrameSize().width;
    }
    getRealHeight(): number {
        return cc.view.getFrameSize().height;
    }

    
    onResize(caller: any, method: Function, args: any[]): void {
        CCTopContainer.listenerManager.on(caller, method, args);
    }

    offResize(caller: any, method: Function): void {
        CCTopContainer.listenerManager.off(caller, method);
    }

    constructor(item: CCRiggerLayout) {
        this.item = item;
        if(!CCTopContainer.isListened){
            cc.view.setResizeCallback(this.onResizeCallBack)
            CCTopContainer.isListened = true;
        }
    }

    dispose(): void {
        this.item = null;
    }

    protected caller:any;
    protected method: Function;
    protected args:any[];
    protected onResizeCallBack(){
        cc.log("cc resize:")
        CCTopContainer.listenerManager.execute();
    }
    
}
