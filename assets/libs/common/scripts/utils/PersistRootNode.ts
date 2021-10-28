import UIUtils from "./UIUtils";
import AssetsUtils from "./AssetsUtils";
import AssetCounterComponent from "./AssetCounterComponent";
/**
 * 一个表示常驻节点的类
 */
const { ccclass } = cc._decorator;
@ccclass
export default class PersistRootNode extends AssetCounterComponent {
    onLoad(): void {
        super.onLoad();
        cc.game.addPersistRootNode(this.node);
    }

    onDestroy(): void {
        cc.game.removePersistRootNode(this.node);
        super.onDestroy();
    }
}