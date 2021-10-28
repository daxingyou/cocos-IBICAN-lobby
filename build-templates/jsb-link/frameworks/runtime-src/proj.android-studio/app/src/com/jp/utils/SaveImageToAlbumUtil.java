package com.jp.utils;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;

import org.cocos2dx.javascript.SDKWrapper;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class SaveImageToAlbumUtil {
    private static String[] PERMISSIONS_STORAGE = {"android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE" };

    public static boolean saveImageToAlbum(String fullPath) {
        try {
            FileInputStream stream = new FileInputStream(fullPath);
            Bitmap bitmap  = BitmapFactory.decodeStream(stream);
            String fileName = stampToDate(System.currentTimeMillis()) + ".png";
            return saveBitmap(bitmap, fileName);
        }catch (java.io.FileNotFoundException e){
            e.printStackTrace();
            return false;
        }
    }

    /*
     * 保存文件，文件名为当前日期
     */
    private static Boolean saveBitmap(Bitmap bitmap, String bitName){
        Boolean isSuccess = true;
        String fileName = Environment.getExternalStorageDirectory().getPath()+"/DCIM/JPGame/"+bitName ;
        File file = new File(fileName);
        if (!file.getParentFile().exists()){
            file.getParentFile().mkdirs();
        }
        if (!file.canWrite()){
            PermissionUtil.getPersimmions(SDKWrapper.getInstance().getActivity(), PERMISSIONS_STORAGE);
        }
        if (!file.exists()){
            try {
                file.createNewFile();
            }catch (IOException e){
                e.printStackTrace();
                isSuccess = false;
            }
        }

        FileOutputStream out;
        try{
            out = new FileOutputStream(file);
            // 格式为 JPEG，照相机拍出的图片为JPEG格式的，PNG格式的不能显示在相册中
            if(bitmap.compress(Bitmap.CompressFormat.JPEG, 90, out))
            {
                out.flush();
                out.close();
                // 插入图库
                MediaStore.Images.Media.insertImage(SDKWrapper.getInstance().getContext().getContentResolver(), file.getAbsolutePath(), bitName, null);
            }
        }
        catch (FileNotFoundException e)
        {
            e.printStackTrace();
            isSuccess = false;
        }
        catch (IOException e)
        {
            e.printStackTrace();
            isSuccess = false;
        }

        // 最后通知图库更新
        SDKWrapper.getInstance().getContext().sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE,
                Uri.fromFile(new File(file.getPath()))));
        return isSuccess;
    }

    /*
     * 将时间戳转换为时间
     */
    private static String stampToDate(Long time){
        String res;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy_MM_dd--HH-mm-ss");
        long lt = new Long(time);
        Date date = new Date(lt);
        res = simpleDateFormat.format(date);
        return res;
    }

}
