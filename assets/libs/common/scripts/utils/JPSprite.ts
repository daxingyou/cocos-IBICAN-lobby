import AssetAllocator, { AssetAllocatorType } from "../modules/assets/models/AssetAllocator";
import AssetsUtils from "./AssetsUtils";

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
export default class JPSprite extends cc.Sprite {
    // 远程下载的资源是否需要缓存到内存中
    @property
    cacheRam: boolean = false;

    private urlStr: string;
    private assetsAllocator: AssetAllocator<cc.Texture2D>;
    public set url(u: string) {
        if (this.assetsAllocator) {
            this.assetsAllocator.cancel();
            this.assetsAllocator.reset();
        }
        else {
            this.assetsAllocator = new AssetAllocator(AssetAllocatorType.Remote);
        }
        this.urlStr = u;
        this.alloc();
    }
    public get url(): string {
        return this.urlStr;
    }

    private async alloc() {
        let ret = await this.assetsAllocator.alloc(this.urlStr);
        if (ret.isOk) {
            // retain
            this.cacheRam && AssetsUtils.retainAssetKey(this.assetsAllocator.url);
            this.onUrlLoad(null, ret.result);
        }
        else{
            cc.log(`load err ${ret.reason}`);
        }

    }

    private onUrlLoad(err, texture): void {
        if (!err) {
            // cc.log( `load complete texture ${texture.url}` );
            let sp: cc.SpriteFrame = new cc.SpriteFrame(texture);
            this.spriteFrame = sp;
            this.node.emit("loadComplete", this);
        } else {
            cc.log(`load err ${err}`);
        }
    }

    onDestroy() {
        if(this.assetsAllocator) this.assetsAllocator.dispose();
        this.assetsAllocator = null;
        super.onDestroy();
    }
}
