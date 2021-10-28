package com.jp.lobby.wxapi;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.jp.utils.WXApiUtils;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;

import org.cocos2dx.javascript.AppActivity;

public class WXEntryActivity extends AppActivity implements IWXAPIEventHandler {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WXApiUtils.getInstance().regToWx(this);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        WXApiUtils.getInstance().getApi().handleIntent(intent, this);
    }

    @Override
    public void onReq(BaseReq baseReq) {
        // 这里不作深究
        Log.d("wxReq", "" + baseReq);
    }

    @Override
    public void onResp(BaseResp baseResp) {
        if(baseResp instanceof SendAuth.Resp){
            SendAuth.Resp newResp = (SendAuth.Resp) baseResp;
            //获取微信传回的code
            String code = newResp.code;
            Log.i("newRespnewResp","   code    :"+code);
        }

        switch (baseResp.errCode) {
            case BaseResp.ErrCode.ERR_OK:
                switch (baseResp.getType()) {
                    case ConstantsAPI.COMMAND_SENDMESSAGE_TO_WX:
                        Log.d("shareToWX", "succed");
                }
                break;
             default:
                 //错误返回
                 Log.d("baseResp", baseResp.errCode + "");
                 break;
        }
    }
}
