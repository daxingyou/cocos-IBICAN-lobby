/**
* name
*/
declare module rigger {
    /**
     * 迁移条件
     */
    class FSMTransitionCondition {
        constructor(paramsName: string | number, handler: rigger.RiggerHandler);
        dispose(): void;
        /**
         * 参数名或标识
         */
        paramsName: string | number;
        checkHandler: rigger.RiggerHandler;
        check(fsm: rigger.FSM): boolean;
    }
}
