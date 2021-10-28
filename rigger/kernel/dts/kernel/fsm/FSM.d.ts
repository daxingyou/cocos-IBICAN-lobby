/**
* 有限状态机类
*/
declare module rigger {
    class FSM {
        /**
         * 状态机的当前状态名
         */
        readonly nowState: string | number;
        private mNowStateName;
        constructor();
        dispose(): void;
        /**
         * 所有在状态映射
         */
        private stateMap;
        /**
         * 所有在参数值
         */
        private paramsMap;
        /**
         * 触发器映射
         */
        private triggerMap;
        /**
         * 启动状态机，一般在设置好所有参数，设置后再调用，只需要调用一次
         */
        start(): void;
        /**
         * 检查当前状态（是否可以迁移当前状态)
         */
        private checkNowState;
        /**
         * 给状态机添加一个状态，添加成功后会返回新添加的状态
         * 如果原来已经有些STATE了则直接使用已有的
         * @param stateName
         */
        addState(stateName: number | string, ifDefault?: boolean): FSMState;
        /**
         * 根据状态名或状态标识获取状态数据
         * @param stateName
         */
        getState(stateName: number | string): FSMState;
        /**
         * 获取参数值
         * @param params
         */
        getValue<T>(params: string | number): any;
        /**
         * 设置参数值
         * @param params
         * @param value
         * @param ifTrigger 是否是触发器模式 ,此模式下，当参数关联的transition发生后，会将参数值置回原值
         *
         */
        setValue(params: string | number, value: any, ifTrigger?: boolean): void;
        /**
         * 当参数发生改变时调用
         * @param params
         */
        private onParamsChange;
        /**
         * 迁移到新状态
         * @param oldState
         * @param newState
         */
        private transitToState;
    }
}
