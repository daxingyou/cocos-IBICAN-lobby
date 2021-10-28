// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass("CCRiggerLayoutSpec")
export default class CCRiggerLayoutSpec {

    @property(() => {
        return {
            default: "",
            type: String
        }
    })
    width: string = ""

    @property(() => {
        return {
            default: "",
            type: String
        }
    })
    height: string = ""

    @property(() => {
        return {
            default: "",
            type: String
        }
    })
    top: string = ""

    @property(() => {
        return {
            default: "",
            type: String
        }
    })
    bottom: string = ""


    @property(() => {
        return {
            default: "",
            type: String
        }
    })
    left: string = ""

    @property(() => {
        return {
            default: "",
            type: String
        }
    })
    right: string = ""

    @property(() => {
        return {
            default: "",
            type: String
        }
    })
    horizontalCenter: string = ""

    @property(() => {
        return {
            default: "",
            type: String
        }
    })
    verticalCenter: string = ""

    // update (dt) {}
}
