export default class LobbyToggleItem{
    public toggleNode: cc.Node = null;
    public mailId: number = 0;
    public redPointName: string;

    constructor(toggleNode: cc.Node, mailId: number){
        this.toggleNode = toggleNode;
        this.mailId = mailId;
    }
}