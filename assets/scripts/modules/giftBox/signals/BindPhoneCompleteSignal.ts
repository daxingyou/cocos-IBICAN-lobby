
const {ccclass, property} = cc._decorator;

@ccclass
export default class BindPhoneCompleteSignal extends riggerIOC.Signal<null> {
    constructor() {
        super();
    }
}
