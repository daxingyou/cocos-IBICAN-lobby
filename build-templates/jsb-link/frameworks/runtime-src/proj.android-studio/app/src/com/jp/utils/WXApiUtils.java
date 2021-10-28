package com.jp.utils;

import android.util.Log;

import android.content.Context;
import android.graphics.Bitmap;

import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXImageObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;

public class WXApiUtils {

    private static WXApiUtils mInstace = null;
    private static  final  String APP_ID = "wxc84608c63d54b258";
    private IWXAPI api; // IWXAPI 是第三方app和微信通信的openApi接口

    public static WXApiUtils getInstance() {
        if (null == mInstace) {
            mInstace = new WXApiUtils();
        }
        return mInstace;
    }

    public void regToWx(Context context) {
        // 通过WXAPIFactory工厂，获取IWXAPI的实例
        api = WXAPIFactory.createWXAPI(context, APP_ID, true);

        // 将应用的appId注册到微信
        api.registerApp(APP_ID);
    }

    public IWXAPI getApi() {
        return api;
    }

    /**
     * 分享图片到微信
     * bmp 图片
     * type: 0-对话 1-朋友圈 2-收藏
     */
    public void shareImgToWx(Bitmap bmp, int type) {
        WXImageObject imgObj = new WXImageObject(bmp);
        WXMediaMessage msg = new WXMediaMessage();
        msg.mediaObject = imgObj;

         Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, 200, 200, true);
         bmp.recycle();

        //bmp TO ByteArray
        byte[] bytes = WXApiUtils.bmpToByteArray(thumbBmp, 32);
        msg.thumbData = bytes;

        //构造一个req
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction("img");
        req.message = msg;
        switch (type) {
            case 0:
                req.scene = SendMessageToWX.Req.WXSceneSession; //对话
                break;
            case 1:
                req.scene = SendMessageToWX.Req.WXSceneTimeline; //朋友圈
                break;
            case 2:
                req.scene = SendMessageToWX.Req.WXSceneFavorite; //收藏
                break;
            default:
                break;
        }
        api.sendReq(req);
        Log.d("wxapiReq", "succed");
    }

    /**
     * 分享网页至微信
     * @param url 链接
     * @param title 标题
     * @param description 描述
     * @param bmp 缩略图
     * @param type 0-微信好友 1-朋友圈
     */
    public void shareWebPageToWx(String url, String title, String description, Bitmap bmp, int type) {
        WXWebpageObject webpage = new WXWebpageObject();
        webpage.webpageUrl = url;
        WXMediaMessage msg = new WXMediaMessage(webpage);
        msg.title = title;
        msg.description = description;
        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, 200, 200, true);
        bmp.recycle();
        byte[] bytes = WXApiUtils.bmpToByteArray(thumbBmp, 32);
        msg.thumbData = bytes;

        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction("webpage");
        req.message = msg;
        switch (type) {
            case 0:
                req.scene = SendMessageToWX.Req.WXSceneSession; //对话
                break;
            case 1:
                req.scene = SendMessageToWX.Req.WXSceneTimeline; //朋友圈
                break;
            case 2:
                req.scene = SendMessageToWX.Req.WXSceneFavorite; //收藏
                break;
            default:
                break;
        }
        api.sendReq(req);
        Log.d("wxapiReq", "Webpage Req send");
    }

    private String buildTransaction(final String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }

    /**
     * Bitmap转换成byte[]并且进行压缩,压缩到不大于maxkb
     *
     * @param bitmap
     * @param maxKb
     * @return
     */
    private static byte[] bmpToByteArray(Bitmap bitmap, int maxKb) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, output);
        int options = 100;
        while (output.toByteArray().length > maxKb && options != 10) {
            output.reset(); //清空output
            bitmap.compress(Bitmap.CompressFormat.JPEG, options, output);//这里压缩options%，把压缩后的数据存放到output中
            options -= 10;
        }
        return output.toByteArray();
    }
}
