import JPView from "./JPView";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
@riggerIOC.autoDispose
export default class JPMediator implements riggerIOC.Mediator {
    protected view: JPView;

    onPreInit(): void { }
    onInit(): void { }
    onExtra(arg: any): void { }
    onShow(): void { }
    onHide(): void { }
    onDispose(): void { }

    dispose(): void {
        this.onDispose();
     }

}
