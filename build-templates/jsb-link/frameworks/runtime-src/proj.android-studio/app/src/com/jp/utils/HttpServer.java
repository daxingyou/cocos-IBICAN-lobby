package com.jp.utils;

import android.util.Log;

import com.koushikdutta.async.AsyncServer;
import com.koushikdutta.async.http.server.AsyncHttpServer;
import com.koushikdutta.async.http.server.AsyncHttpServerRequest;
import com.koushikdutta.async.http.server.AsyncHttpServerResponse;
import com.koushikdutta.async.http.server.HttpServerRequestCallback;

import org.cocos2dx.lib.Cocos2dxHelper;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;


import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;

public class HttpServer {

//    static String TAG = "SERVER";
    public static void startServer(final String root, int port) {
//        Log.i(TAG, "start http server");
        
        AsyncHttpServer server = new AsyncHttpServer();
        AsyncServer mAsyncServer = new AsyncServer();
//        final String realRoot = root;

        server.get("[\\d\\D]*", new HttpServerRequestCallback() {
            @Override
            public void onRequest(AsyncHttpServerRequest asyncHttpServerRequest, AsyncHttpServerResponse asyncHttpServerResponse) {
                try {
                    String requestPath = asyncHttpServerRequest.getPath();
//                    Log.i(TAG, "requestPath: " + requestPath);
                    HttpServer.sendAssignFile(asyncHttpServerResponse, root + requestPath);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });

        server.listen(mAsyncServer, port);
    }

    public static void sendAssignFile(AsyncHttpServerResponse response, String path) throws IOException {
        File file = new File(path);
//        Log.i(TAG, AsyncHttpServer.getContentType(path));
        // HttpServer.callNative();
        FileInputStream stream = new FileInputStream(file);
        response.setContentType(AsyncHttpServer.getContentType(path));

        response.sendStream(stream, stream.available());
    }

    public static void callNative(){
        Cocos2dxHelper.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Log.i("TESTTTTTTTTTT", "callNative fun()");
                Cocos2dxJavascriptJavaBridge.evalString("WebViewGroup.test();");
            }
        });
    }


    public static String Inputstr2Str_Reader(FileInputStream in, String encode)
    {

        String str = "";
        try
        {
            if (encode == null || encode.equals(""))
            {
                // 默认以utf-8形式
                encode = "utf-8";
            }
            BufferedReader reader = new BufferedReader(new InputStreamReader(in, encode));
            StringBuffer sb = new StringBuffer();

            while ((str = reader.readLine()) != null)
            {
                sb.append(str).append("\n");
            }
            return sb.toString();
        }
        catch (UnsupportedEncodingException e1)
        {
            e1.printStackTrace();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }

        return str;
    }


    public static void createGameListConfig(AsyncHttpServerResponse response, String path) throws IOException {
        File file = new File(path);
//        Log.i(TAG, AsyncHttpServer.getContentType(path));
        FileInputStream stream = new FileInputStream(file);
        response.setContentType(AsyncHttpServer.getContentType(path));

        response.sendStream(stream, stream.available());
    }
}
