/**
* name
*/
declare module rigger {
    class FSMTransition {
        constructor(toState: number | string);
        dispose(): void;
        /**
         * 迁移的目标状态名或标识符
         */
        toStateName: string | number;
        /**
         * 所有的条件
         */
        readonly conditions: FSMTransitionCondition[];
        /**
         * 给迁移添加条件
         * @param paramsName 参与判断的参数
         * @param checkCaller 检查函数的调用者
         * @param checkMethod 检查函数
         * @param args 额外参数
         */
        addCondition(paramsName: number | string, checkCaller?: any, checkMethod?: (e: any, ...args: any[]) => boolean, ...args: any[]): void;
        check(fsm: FSM): boolean;
        private mConditions;
    }
}
