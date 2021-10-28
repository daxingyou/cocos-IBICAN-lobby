package com.jp.utils;

import android.content.Context;
import android.provider.Settings;

import org.cocos2dx.javascript.SDKWrapper;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * Created by Administrator on 2019/4/3.
 */

public class ZipUtils {
    public static void unZip(String filePath, String destDir) throws Exception {
//        System.out.println("zipFileString ： " +  zipFileString);
        // System.out.println("zipFileString filePath: " +  filePath);
        // System.out.println("zipFileString destDir: " +  destDir);

        File zipFile = new File(filePath);
        FileInputStream fileInputStream = new FileInputStream(zipFile);
        ZipInputStream inZip = new ZipInputStream(fileInputStream);
        ZipEntry zipEntry;
        String szName;
        while ((zipEntry = inZip.getNextEntry()) != null) {
            szName = zipEntry.getName();
            String destPath = destDir + File.separator + szName;
            // System.out.println("zipFileString destPath: " +  destPath);
            if (zipEntry.isDirectory()) {
                //获取部件的文件夹名
                szName = szName.substring(0, szName.length() - 1);
                File folder = new File(destPath);
                folder.mkdirs();

            } else {
                File file = new File(destPath);
                if (!file.exists()) {
                    file.getParentFile().mkdirs();
                    file.createNewFile();
                }
                // 获取文件的输出流
                FileOutputStream out = new FileOutputStream(file);
                int len;
                byte[] buffer = new byte[1024];
                // 读取（字节）字节到缓冲区
                while ((len = inZip.read(buffer)) != -1) {
                    // 从缓冲区（0）位置写入（字节）字节
                    out.write(buffer, 0, len);
                    out.flush();
                }
                out.close();
            }
        }
        inZip.close();
    }
}
