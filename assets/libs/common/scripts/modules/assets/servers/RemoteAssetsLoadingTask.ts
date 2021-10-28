import Task from "../../../utils/Task";
type urlType = string | string[] | { uuid?: string, url?: string };
export default class RemoteAssetsLoadingTask<T = any> extends Task<T[], any> {
    protected url: urlType;
    constructor(url?: urlType) {
        super(null);
        this.url = url;
    }

    reset(): RemoteAssetsLoadingTask<T> {
        this.itmes = [];
        super.reset();
        return this;
    }

    onTaskStart(url: urlType) {
        if (url) this.url = url;
        if (!this.url) {
            this.setError("must specified valid url");
            return;
        }
        cc.loader.load(this.url, this.onLoadingProgress.bind(this), this.onLoadingComplete.bind(this))
    }

    onTaskCancel() {

    }

    private itmes = [];
    private onLoadingProgress(completedCount: number, totalCount: number, item: any): void {
        if(item.error){
            this.setError(item.error);
            return;
        }

        this.itmes.push(item);
        let per = completedCount / totalCount;
        this.setProgress(per);
    }

    private onLoadingComplete(): void {
        this.setComplete(this.itmes);
    }
}