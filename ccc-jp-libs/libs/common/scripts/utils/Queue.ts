// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class Queue<T> {
    protected get content(): T[] {
        if (!this.mContent) this.mContent = [];
        return this.mContent;
    }
    private mContent: T[];

    isEmpty(): boolean {
        return !this.mContent || this.mContent.length <= 0;
    }

    clear(): void {
        this.mContent = null;
    }

    /**
     * 入列
     * @param item 
     */
    inqueue(item: T): void {
        this.content.push(item);
    }

    /**
     * 出列
     */
    outqueue(): T{
        return this.content.shift();
    }
}
