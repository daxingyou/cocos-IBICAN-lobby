package com.jp.utils;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

import com.fm.openinstall.OpenInstall;
import com.fm.openinstall.listener.AppInstallAdapter;
import com.fm.openinstall.listener.AppWakeUpAdapter;
import com.fm.openinstall.model.AppData;

import org.cocos2dx.javascript.SDKWrapper;
import org.json.JSONException;
import org.json.JSONObject;



public class OpenInstallUtils {
     private static String[] PERMISSIONS = {"android.permission.INTERNET", "android.permission.ACCESS_NETWORK_STATE" };
     private static String data;
     private static JSONObject shareParam;
     private static  Long referrerId ;
     private static  String referrerChannel;
     private static  Integer gameId;
     private static AppWakeUpAdapter wakeUpAdapter = null;

     public static void init(){
         Activity content = SDKWrapper.getInstance().getActivity();
         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
             for (String permission : PERMISSIONS) {
                 if (content.checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED){
                     PermissionUtil.getPersimmions(content, PERMISSIONS);
                     break;
                 }
             }
         }

         OpenInstall.getInstall(new AppInstallAdapter() {
             @Override
             public void onInstall(AppData appData) {
                data = appData.getData();
                Log.d("OpenInstall", "data = " + data);
                Log.d("OpenInstall", "getInstall : installData = " + appData.toString());
             }
         });
     }


    public static int getReferrerId(){
        try {
            shareParam = new JSONObject(data);
            Object tempReferrerId = shareParam.get("referrerId");
            referrerId = Long.valueOf(String.valueOf(tempReferrerId));
            Log.d("OpenInstall", "ok:referrerId = " + referrerId);
        }catch(JSONException e){
            referrerId = (long)0;
            Log.d("OpenInstall", "err:referrerId = " + referrerId);
        }
         return  referrerId.intValue() ;
    }

    public static String getReferrerChannel(){
        try {
            shareParam = new JSONObject(data);
            referrerChannel = shareParam.getString("referrerChannel");
            Log.d("OpenInstall", "ok:referrerChannel = " + referrerChannel.toString());
        }catch(JSONException e){
            referrerChannel = "";
            Log.d("OpenInstall", "err:referrerChannel = " + referrerChannel.toString());
        }
        return referrerChannel;
    }

    public static int getGameId(){
        try {
            shareParam = new JSONObject(data);
            gameId = shareParam.getInt("gameId");
            Log.d("OpenInstall", "ok:gameId = " + gameId);
        }catch(JSONException e){
            gameId = 0;
            Log.d("OpenInstall", "err:gameId = " + gameId);
        }
        return gameId.intValue();
    }
}