import IAsyncListLayout from "./IAsyncListLayout";
import UIUtils from "../UIUtils";
import RefreshListDescConst from "../refreshList/const/RefreshListDescConst";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class AsyncList extends cc.Component {

    @property(cc.Prefab)
    template: cc.Node | cc.Prefab = null;

    /**
     * 获取子项
     * @param index 
     */
    public getItem(index: number): cc.Node {
        if (index >= this.items.length) return null;
        return this.mItems[index];
    }

    /**
     * 获取子项上的组件
     * @param index 
     * @param type 
     */
    public getItemComponent<T extends cc.Component>(index: number, type: { prototype: T }): T {
        if (index >= this.items.length) return null;
        return this.mItems[index].getComponent<T>(type);
    }

    /**
     * 获取子项节点列表
     */
    public get items(): (cc.Node | cc.Prefab)[] {
        return this.mItems;
    }

    protected layout: IAsyncListLayout

    protected pool: cc.Node[] = [];
    protected mItems: cc.Node[] = [];


    protected itemNum: number = 0;

    protected task: riggerIOC.WaitForTime;
    protected mRenderHandlers: riggerIOC.ListenerManager = null;

    protected get renderHandlers(): riggerIOC.ListenerManager {
        if (!this.mRenderHandlers) this.mRenderHandlers = new riggerIOC.ListenerManager();
        return this.mRenderHandlers;
    }

    protected mRenderAllHandlers: riggerIOC.ListenerManager = null;
    protected get renderAllHandlers(): riggerIOC.ListenerManager {
        if (!this.mRenderAllHandlers) this.mRenderAllHandlers = new riggerIOC.ListenerManager();
        return this.mRenderAllHandlers;
    }

    onRender(caller: any, handler: Function, args: any[] = null) {
        this.renderHandlers.on(caller, handler, args);
    }

    offRender(caller: any, handler: Function): void {
        this.renderHandlers.off(caller, handler);
    }

    /**
     * 注册当所有项都被渲染完成时的回调
     * @param caller 
     * @param handler 
     * @param args 
     */
    onRenderAll(caller, handler: Function, args: any[] = null) {
        this.renderAllHandlers.on(caller, handler, args);
    }

    offRenderAll(caller: any, handler: Function) {
        this.renderAllHandlers.off(caller, handler);
    }

    getLayout<T extends IAsyncListLayout>(): T {
        return <T>this.layout;
    }

    setLayout<T extends IAsyncListLayout>(layout: T): void {
        this.layout = layout;
    }

    public reset(itemNum: number, layout: IAsyncListLayout = null): AsyncList {
        if (layout) this.setLayout(layout);

        // 是否有正在进行的任务
        if (this.task) {
            this.task.cancel("cancel");
        }

        // 回收所有ITEM
        this.mItems.forEach((value, _idx) => {
            value.active = false;
            value.removeFromParent(true);
            this.pool.push(value);
        });

        this.mItems = [];
        this.itemNum = itemNum;


        return this;
    }

    public clearPool() {
        this.pool.forEach((value) => {
            value.destroy();
        });
        this.pool = [];
    }

    public async run(bullk: number, interval: number = 1) {
        if (this.task) {
            if (this.task.isWaitting()) return;
        }
        else {
            this.task = new riggerIOC.WaitForTime();
        }

        if (!this.template) return;
        if (interval == 1) {
            while (this.mItems.length < this.itemNum) {
                this.createItems(Math.min(this.itemNum - this.mItems.length, bullk));
                if (this.mItems.length >= this.itemNum) break;

                // 等一帧
                // await this.task.forFrame().wait();
                await riggerIOC.waitForNextFrame();
                // this.task.reset();
            }

            // 所有的都完成了
            if (this.mRenderAllHandlers) {
                this.mRenderAllHandlers.execute(this);
            }

        }
    }

    public forceRender(): void {
        if (this.mRenderHandlers) {
            let len: number = this.mItems.length;
            for (let i: number = 0; i < len; i++) {
                this.mRenderHandlers.execute(this.mItems[i], i);
            }
        }

        this.mRenderAllHandlers && this.mRenderAllHandlers.execute(this);
    }

    /**
     * 创建指定数目的子项,并设置位置等
     * @param num 
     */
    protected createItems(num: number): void {
        let nowNum: number = this.mItems.length;
        let tempNum: number = 0;
        while (tempNum < num) {
            let inst: cc.Node = this.pool.shift();
            if (!inst) {
                inst = <cc.Node>UIUtils.instantiate(this.template)
                if (!inst) throw new Error("can not instantiate prefab, please check!, prefab:" + this.template);
            }
            this.mItems.push(inst);
            ++tempNum;

            // 回调
            this.node.addChild(inst);
            this.mRenderHandlers && this.mRenderHandlers.execute(inst, nowNum++);
            // 设置位置
            this.layout && this.layout.layout(inst, nowNum - 1);

            inst.active = true;
        }
    }

    // onLoad() {
    //     // this.renderHandlers = new riggerIOC.ListenerManager();
    // }

    start() {
        if (this.template && this.template instanceof cc.Node) this.template.active = false;
    }
}
