// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class QRcodeUI extends cc.Component {

	public init(url){
		//注意 最好把qrImage与qrcode的节点长宽设置为2的倍数。不然可能会出现无法识别二维码
		var ctx = this.node.addComponent(cc.Graphics);
		if (typeof (url) !== 'string') {
			console.log('url is not string',url);
			return;
		}
		this.QRCreate(ctx, url);
	}

	private QRCreate(ctx, url) {
		var qrcode = new QRCode(-1, QRErrorCorrectLevel.H);
		qrcode.addData(url);
		qrcode.make();

		ctx.fillColor = cc.Color.BLACK;
		//块宽高
		var tileW = this.node.width / qrcode.getModuleCount();
		var tileH = this.node.height / qrcode.getModuleCount();

		// draw in the Graphics
		for (var row = 0; row < qrcode.getModuleCount(); row++) {
			for (var col = 0; col < qrcode.getModuleCount(); col++) {
				if (qrcode.isDark(row, col)) {
					// ctx.fillColor = cc.Color.BLACK;
					var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
					var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
					ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
					ctx.fill();
				}
			}
		}
	}
}
