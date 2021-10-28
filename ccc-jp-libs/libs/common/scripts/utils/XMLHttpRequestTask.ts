import Task from "./Task";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 一个XMLHttpRequest任务
 */
export default class XMLHttpRequestTask extends Task<string, string> {
    /**
     * 
     */
    public get xmlHttpRequest(): XMLHttpRequest {
        if (!this.mXmlHttpRequest) {
            this.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            this.mXmlHttpRequest = cc.loader.getXMLHttpRequest();
        }
        return this.mXmlHttpRequest;
    }
    protected mXmlHttpRequest: XMLHttpRequest;

    /**
     * 
     * @param method 
     * @param url 
     */
    constructor(method?: "POST" | "GET", url?: string) {
        super(url);
        if (method) this.mMethod = method;
        if (url) this.mUrl = url;
    }

    /**
     * 请求的方法，默认为"POST"
     */
    public get method(): "POST" | "GET" {
        return this.mMethod;
    }
    public set method(m: "POST" | "GET") {
        this.mMethod = m;
    }
    protected mMethod: "POST" | "GET" = "POST";

    public get url(): string {
        return this.mUrl;
    }
    public set url(u: string) {
        this.mUrl = u;
    }
    protected mUrl: string = null;

    // /**
    //  * 超时时间，默认为5秒
    //  */
    // public get timeout(): number {
    //     return this.mTimeOut;
    // }
    // public set timeout(t: number) {
    //     this.mTimeOut = t;
    // }
    // protected mTimeOut: number = 5000;

    /**
     * 属性对象
     */
    protected get paramsMap(): { [key: string]: string | number } {
        if (!this.mParamsMap) {
            this.mParamsMap = {};
        }

        return this.mParamsMap;
    }
    private mParamsMap: { [key: string]: string | number }

    /**
     * 请求头
     */
    protected get requestHeaderMap(): { [key: string]: string } {
        if (!this.mRequestHeaderMap) {
            this.mRequestHeaderMap = {};
        }
        return this.mRequestHeaderMap;
    }
    private mRequestHeaderMap: { [key: string]: string };

    /**
     * 设置请求头
     * @param name 
     * @param value 
     */
    public setRequestHeader(name: string, value: string): XMLHttpRequestTask {
        this.requestHeaderMap[name] = value;
        return this;
    }

    public setParams(para: string, value: string | number): XMLHttpRequestTask {
        this.paramsMap[para] = value;
        return this;
    }

    onTaskStart(): void {
        if (!this.url || this.url.length <= 0) throw new Error("a valid url should be specified");
        this.xmlHttpRequest.open(this.method, this.url);
        this.xmlHttpRequest.timeout = this.mTimeout == -1 ? 5000 : this.mTimeout;
        this.setAllRequestHeader();
        let self = this;

        this.xmlHttpRequest.onreadystatechange = this.onReadyStateChange.bind(this);

        this.xmlHttpRequest.addEventListener("progress", this.onLoaderProgress.bind(this));

        this.xmlHttpRequest.send(this.makeParamsStr());

    }

    onTaskCancel(): void {
        if (!this.isWaitting()) return;
        this.mXmlHttpRequest.abort();
    }

    reset(): Task {
        this.mXmlHttpRequest = null;
        return super.reset() as XMLHttpRequestTask;
    }

    protected onReadyStateChange(evt: Event) {
        cc.log(`evt:${evt}`);
        if (this.mXmlHttpRequest.readyState === 4
            && (this.mXmlHttpRequest.status >= 200 && this.mXmlHttpRequest.status < 300)) {
            this.setComplete(this.xmlHttpRequest.response);
            this.reset();
        }
    }

    protected onLoaderProgress(evt): void {
        if (evt.lengthComputable) {
            let p = evt.loaded / evt.total;
            this.setProgress(p);
        }
    }

    private setAllRequestHeader(): void {
        if (!this.mRequestHeaderMap) return;
        if (!this.xmlHttpRequest) return;
        for (let k in this.mRequestHeaderMap) {
            this.xmlHttpRequest.setRequestHeader(k, this.mRequestHeaderMap[k]);
        }
    }

    private makeParamsStr(): string {
        if (!this.mParamsMap) {
            return "";
        }

        let ret: string = "";
        for (let k in this.mParamsMap) {
            ret += `${k}=${this.mParamsMap[k]}&`;
        }

        return ret;
    }

}
