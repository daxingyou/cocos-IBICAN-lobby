import RedDotUpdateSignal from "./RedDotUpdateSignal";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

interface registerMap {
    parent: string;
    child: string[];
    redDotNum: number;
}

export default class RedDotUtils {

    //注册节点集合
    private static registerNodeMap: {} = {};

    /**
     * 根据node返回红点数
     * @param node 
     */
    public static getRedDotNumByNode(node: string) {
        if (RedDotUtils.registerNodeMap[node]) {
            return RedDotUtils.registerNodeMap[node].redDotNum;
        }
        else {
            cc.log(`node is not exist. node: ${node}`);
            return null;
        }
    }

    /**
     * 注册红点
     * @param selfNode 
     * @param parentNode 
     * @param redDotNum 节点红点数.仅最底层需传 1
     */
    public static registrRedDot(selfName: string, parentName: string = null, redDotNum: number = 0) {
        if (RedDotUtils.registerNodeMap[selfName]) {
            cc.log(`${selfName} cannot repeat registration.`);
            return;
        }
        if (!parentName) {
            RedDotUtils.registerNodeMap[selfName] = { parent: null, child: [], redDotNum: redDotNum }; //root
        }
        else {
            RedDotUtils.registerNodeMap[selfName] = { parent: parentName, child: [], redDotNum: redDotNum };
            RedDotUtils.registerNodeMap[parentName].child.push(selfName);
            // if(redDotNum > 0) {
            //     RedDotUtils.updateParent(selfName);
            // } 
        }
        cc.log(`registr node. node: ${selfName}`);
    }

    /**
     * 注销
     * @param self 
     */
    public static unRegistrRedDot(nodeName: string) {
        let node = RedDotUtils.registerNodeMap[nodeName] as registerMap;
        if (node) {
            let parentName = node.parent;
            if (parentName) {
                let parentNode = RedDotUtils.registerNodeMap[parentName] as registerMap;
                for (let i = 0; i < parentNode.child.length; i++) {
                    if (parentNode.child[i] == nodeName) {
                        parentNode.child.splice(i, 1); //从父节点删去
                    }
                }
            }

            RedDotUtils.registerNodeMap[nodeName] = null; //删除自己
        }
    }

    /**
     * 更新指定节点
     * @param node 节点名
     * @param num 红点数
     */
    public static updateRedDot(nodeName: string, num: number) {
        if (!RedDotUtils.registerNodeMap[nodeName]) {
            cc.log(`node is not exist. node: ${nodeName}`);
            return;
        }
        RedDotUtils.registerNodeMap[nodeName].redDotNum = num;
        RedDotUtils.redDotUpdateSignal.dispatch(nodeName);

        //更新父节点
        RedDotUtils.updateParent(nodeName);
    }

    public static redDotUpdateSignal: RedDotUpdateSignal = new RedDotUpdateSignal();
    /**
     * 从下至上更新父节点
     * @param node 节点名
     */
    private static updateParent(nodeName: string) {
        let parentRedDotNum: number = 0;
        let parentName = RedDotUtils.registerNodeMap[nodeName].parent;
        if(!parentName) return;

        let parentNode = RedDotUtils.registerNodeMap[parentName];
        parentNode.child.forEach(function (child) {
            parentRedDotNum += RedDotUtils.registerNodeMap[child].redDotNum;
        });
        RedDotUtils.registerNodeMap[parentName].redDotNum = parentRedDotNum;
        RedDotUtils.redDotUpdateSignal.dispatch(parentName);
        this.updateParent(parentName);
    }
}