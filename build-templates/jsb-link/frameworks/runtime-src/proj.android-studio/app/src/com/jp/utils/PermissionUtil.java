package com.jp.utils;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

import java.util.ArrayList;

/**
 * 权限工具类
 */
public class PermissionUtil {
    public static String TAG = PermissionUtil.class.getSimpleName();

    public static int SDK_PERMISSION_REQUEST = 1;

    public static void getPersimmions(Activity activity, String... permissions) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            ArrayList<String> permissionList = new ArrayList<String>();
            for (String permission : permissions) {
                addPermission(permissionList, permission, activity);
            }
            if (permissionList.size() > 0) {
                activity.requestPermissions(permissionList.toArray(new String[permissionList.size()]), SDK_PERMISSION_REQUEST);
            }
        }
    }

    @TargetApi(23)
    public static boolean addPermission(ArrayList<String> permissionsList, String permission, Activity activity) {
        if (activity.checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) {
            if (activity.shouldShowRequestPermissionRationale(permission)) {
                return true;
            } else {
                permissionsList.add(permission);
                return false;
            }
        } else {
            return true;
        }
    }

}