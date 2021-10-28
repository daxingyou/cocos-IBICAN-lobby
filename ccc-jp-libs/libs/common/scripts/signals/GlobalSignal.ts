import SituationModel from "../modules/situation/models/SituationModel";

/**
 * 全局信号，指可以在不同的上下文中（如大厅/子游戏）共享的信号
 */
export default class GlobalSignal<T> extends riggerIOC.Signal<T>{
    @riggerIOC.inject(SituationModel)
    protected situationModel: SituationModel;

    protected signalFlag: string = null;

    getInstance(): GlobalSignal<T> {
        let inst: GlobalSignal<T> = this.situationModel.getGlobal(this.signalFlag);
        if (inst) return inst;
        return this;
    }

    /**
     * 将自己设置为全局实例
     */
    setInstanceGlobal(): void {
        this.situationModel.setGlobal(this.signalFlag, this);
    }

    dispatch(data: T) {
        let inst: GlobalSignal<T> = this.getInstance();
        if (inst == this) {
            super.dispatch(data);
        }
        else {
            inst.dispatch(data);
        }
    }

    /**
     * 注册回调
     * @param caller
     * @param method
     * @param args
     */
    on(caller: any, method: (...args: (any | T)[]) => any, args?: any[], recoverBefore?: boolean): void {
        let inst = this.getInstance();
        if (inst == this) {
            super.on(caller, method, args, recoverBefore);
        }
        else {
            inst.on(caller, method, args, recoverBefore);
        }
    }

    /**
     * 注册一次性回调
     * @param caller
     * @param method
     * @param args
     */
    once(caller: any, method: (...args: (any | T)[]) => any, args?: any[], recoverBefore?: boolean): void {
        let inst = this.getInstance();
        if (inst == this) {
            super.once(caller, method, args, recoverBefore);
        }
        else{
            inst.once(caller, method, args, recoverBefore);            
        }
    }

    /**
     * 取消回调
     * @param caller
     * @param method
     */
    off(caller: any, method: (...args: (any | T)[]) => any): void{
        let inst = this.getInstance();
        if (inst == this) {
            super.off(caller, method);
        }
        else{
            inst.off(caller, method);            
        }
    }
}