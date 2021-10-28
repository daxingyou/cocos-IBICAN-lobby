import NativeFileUtils from "../../../libs/native/NativeFileUtils";
import NativeUtils from "../../../libs/native/NativeUtils";
import PushTipsQueueSignal from "../../../libs/common/scripts/modules/tips/signals/PushTipsQueueSignal";
import { CCCAssetsSettings } from "../../modules/subGames/utils/SubGameUtils";

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
export default class ScreenShot extends cc.Component {
    @riggerIOC.inject(PushTipsQueueSignal)
    private pushTipsQueueSignal: PushTipsQueueSignal;

    public screenshotByNode(node: cc.Node, rect: cc.Rect, fileName: string = "shot.png", callback ?: Function) {
        // let camera: cc.Camera = node.addComponent(cc.Camera);
        // let cameraNode: cc.Node = new cc.Node('carmera');
        // let camera: cc.Camera = cameraNode.addComponent(cc.Camera);
        // cc.director.getScene().getChildByName('Canvas').insertChild(cameraNode, 1);

        let camera: cc.Camera = cc.director.getScene().getChildByName('Canvas').getChildByName('screenShotCamera').getComponent(cc.Camera);
        camera.node.active = true;

        var size = new cc.Size(node.width, node.height);

        let texture = new cc.RenderTexture();
        texture.initWithSize(size.width, size.height);
        camera.targetTexture = texture;
        node.scaleY = node.scaleY * -1;
        // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
        camera.render(node);

        node.scaleY = node.scaleY * -1;
        // 这样我们就能从 RenderTexture 中获取到数据了
        let data = texture.readPixels();
        if (cc.sys.isNative) {
            let destData: Uint8Array = this.catImageData(data, size, rect);
            this.savaImage(destData, rect.width, rect.height, fileName);
        }
        if (callback) {
            let spriteFrame = new cc.SpriteFrame(texture, new cc.Rect(0, 0, size.width, size.height));
            callback(spriteFrame)
        };

        camera.node.active = false;
        // cameraNode.removeComponent(camera);
        // cameraNode.removeFromParent();
        // camera.destroy();
        // cameraNode.destroy();
    }

    public catImageData(srcData: Uint8Array, scrSize: cc.Size, rect: cc.Rect): Uint8Array {
        let tempData: Uint8Array = new Uint8Array(rect.width * 4 * rect.height);
        let rowBytes: number = scrSize.width * 4;
        let length: number = 0;
        let temp: any = null;
        for (let row = rect.y; row < rect.y + rect.height; row++) {
            let start = row * rowBytes;
            let startIndex: number = start + (rect.x) * 4;
            let endIndex: number = start + (rect.x + rect.width) * 4;
            temp = srcData.slice(startIndex, endIndex);
            tempData.set(temp, length);
            length = length + endIndex - startIndex;
        }
        return tempData;
    }

    private savaImage(data: Uint8Array, imgWidth: number, imgHeight: number, fileName: string) {
        let fullPath: string = NativeFileUtils.getWritablePath();
        // 是否存在
        NativeFileUtils.saveImageData(data, imgWidth, imgHeight, fullPath + fileName);
        let isSaveSuc: boolean = NativeUtils.saveImageToAlbum(fullPath + fileName);
        if (isSaveSuc)
        {
            this.pushTipsQueueSignal.dispatch('已保存至JPGame相册~');
        }else{
            this.pushTipsQueueSignal.dispatch('保存至相册失败，请检查应用权限');
        }
    }
}