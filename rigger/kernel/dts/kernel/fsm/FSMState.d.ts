/**
* 有限状态机的状态类
*/
declare module rigger {
    /**
     * 状态机的状态数据
     */
    class FSMState {
        /**
         *
         * @param state 状态名或标示符
         */
        constructor(state: number | string);
        dispose(): void;
        private enterActionManager;
        /**
         * 添加进入此状态时的动作,可以重复调用以增加多个动作
         * 动作回调时会将旧状态与新状态名附加在传入参数末尾，如：
         * function onEnter(extraArg..., oldState, newState){}
         * @param whenEnterCaller
         * @param whenEnterMethod
         * @param whenEnterArgs
         */
        addEnterAction(whenEnterCaller: any, whenEnterMethod: (...oldStateAndNewState: any[]) => any, ...whenEnterArgs: any[]): FSMState;
        private leaveActionManager;
        /**
         * 添加离开此状态时的动作,可以重复调用以增加多个动作
         * 动作回调时会将旧状态与新状态名附加在传入参数末尾，如：
         * function onEnter(extraArg..., oldState, newState){}
         * @param whenLeaveCaller
         * @param whenLeaveMethod
         * @param whenLeaveArgs
         */
        addLeaveAction(whenLeaveCaller: any, whenLeaveMethod: (...oldStateAndNewState: any[]) => any, ...whenLeaveArgs: any[]): FSMState;
        /**
         * 执行进入动作
         * @param oldState
         * @param newState
         */
        executeEnterAction(fromState: number | string): void;
        /**
         * 执行离开动作
         * @param toState
         */
        executeLeaveAction(toState: number | string): void;
        /**
         * 参数状态关系映射
         */
        readonly paramsStateRelationMap: {};
        private mParamsStateRelationMap;
        /**
         * 增加一个迁移（条件），此接口可以重复对同一个状态调用，以增加多个条件，此时，需要所有条件都满足后，状态才会发生迁移
         * 返回FSMstate
         * @param toState 目标状态
         * @param paramsName 需要检查的参数名
         * @param checkCaller 检查函数调用者
         * @param checkMethod 检查函数
         * @param args 额外参数
         */
        addTransition(toState: number | string, paramsName?: number | string, checkCaller?: any, checkMethod?: (paramsValue: any, fsm?: FSM, paramsName?: string | number, ...args: any[]) => boolean, ...args: any[]): FSMState;
        /**
         * 当状态机的参数发生了变化时调用，返回新的状态，如果为null,则表示不满足迁移条件
         * @param fsm
         * @param paramsName
         */
        onParamsChange(fsm: FSM, paramsName: string | number): number | string;
        /**
         * 检查所有的transition，看是否有可以迁移的状态,并返回新状态，如果没可迁移状态，则返回NULL，
         * @param fsm
         */
        checkAllTransitions(fsm: FSM): number | string;
        getTransition(toState: number | string): FSMTransition;
        protected setTransition(toState: number | string, transition: FSMTransition): FSMTransition;
        /**
         * 状态名或标识
         */
        readonly stateName: string | number;
        private mStateName;
        /**
         * 所有可能的变迁
         */
        private transitionsMap;
    }
}
