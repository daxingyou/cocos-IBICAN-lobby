//
//  NativeUtils.m
//  lobby-mobile
//
//  Created by MacOS on 2019/6/13.
//

#import "NativeUtils.h"
#import <HTTPServer.h>
#import <SSZipArchive.h>
#import "MyHttpConnection.h"
#import <Photos/Photos.h>
#import <AssetsLibrary/AssetsLibrary.h>
#import "WXApi.h"
#import  "RootViewController.h"
#import  "AppController.h"
#include "scripting/js-bindings/event/EventDispatcher.h"

@implementation NativeUtils

static HTTPServer *_localHttpServer;

+ (void)OCLog:(NSString *)str {
    NSLog(@"%@", str);
}

+ (void)unzipFileFromPath: (NSString *)zipPath toDest: (NSString *)destPath  {
    if ([SSZipArchive unzipFileAtPath:zipPath toDestination:destPath] ) {
        NSLog(@"解压成功。");
    } else {
        NSLog(@"解压失败。");
    }
}

+ (void)startServerViaRoot:(NSString *)root atPort:(int)port {
    NSLog(@"%@++++++++%d", root, port);
    
    _localHttpServer = [[HTTPServer alloc] init];
    [_localHttpServer setType:@"_http.tcp"];
    
    [_localHttpServer setConnectionClass:[MyHttpConnection class]];
    [_localHttpServer setDocumentRoot: root];
    [_localHttpServer setPort: port];
    
    NSError *error;
    if([_localHttpServer start:&error]){
        NSLog(@"Server Start listening at port %d", port);
    }
    else{
        NSLog(@"Start Server Failure!");
    }
}

+ (NSString *)getDeviceId {
    
    NSString *deviceUUID = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
    
    NSLog(@"UUID::::::%@",deviceUUID);
    
    return deviceUUID;
}

+ (void)saveUUID: (NSString *)uuid {
}

+ (NSString *)readUUID {
    
    return @"";
}

+ (BOOL)appendToClipBoard: (NSString *)string {
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string = string;
    return YES;
}

+ (BOOL)saveImageToAlbum:(NSString *)temp {
    NSURL* tempUrl = [NSURL fileURLWithPath:temp];
    NSString *title = @"JPGame";
    
    // 1.获取(创建)相册
    //查询所有自定义相册
    PHFetchResult<PHAssetCollection *> *collections = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeAlbum subtype:PHAssetCollectionSubtypeAlbumRegular options:nil];
    PHAssetCollection *createCollection = nil;
    for (PHAssetCollection *collection in collections) {
        if ([collection.localizedTitle isEqualToString:title]) {
            createCollection = collection;
            break;
        }
    }
    
    //当前对应的app相册没有被创建
    if (createCollection == nil) {
        //        //创建一个【自定义相册】
        //        NSError *error = nil;
        //        __block NSString *createCollectionID = nil;
        //        [[PHPhotoLibrary sharedPhotoLibrary]performChangesAndWait:^{
        //            //创建一个【自定义相册】
        //            createCollectionID = [PHAssetCollectionChangeRequest creationRequestForAssetCollectionWithTitle:title].placeholderForCreatedAssetCollection.localIdentifier;
        //        } error:&error];
        //        createCollection = [PHAssetCollection fetchAssetCollectionsWithLocalIdentifiers:@[createCollectionID] options:nil].firstObject;
        NSError *error = nil;
        [[PHPhotoLibrary sharedPhotoLibrary]performChangesAndWait:^{
            //创建一个【自定义相册】
            [PHAssetCollectionChangeRequest creationRequestForAssetCollectionWithTitle:title];
        } error:&error];
        
        collections = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeAlbum subtype:PHAssetCollectionSubtypeAlbumRegular options:nil];
        for (PHAssetCollection *collection in collections) {
            if ([collection.localizedTitle isEqualToString:title]) {
                createCollection = collection;
                break;
            }
        }
    }
    
    // 2.先保存图片到【相机胶卷】
    /// 同步执行修改操作
    //    NSError *error = nil;
    //    __block PHObjectPlaceholder *placeholder = nil;
    //    [[PHPhotoLibrary sharedPhotoLibrary]performChangesAndWait:^{
    //        placeholder =  [PHAssetChangeRequest creationRequestForAssetFromImageAtFileURL: tempUrl].placeholderForCreatedAsset;
    //    } error:&error];
    //    if (error != nil) {
    //        NSLog(@"保存失败");
    //        return NO;
    //    } else {
    //        NSLog(@"保存成功。");
    //    }
    
    // 2.保存到相册
    __block PHObjectPlaceholder *placeholder = nil;
    NSError* error3 = nil;
    [[PHPhotoLibrary sharedPhotoLibrary]performChangesAndWait:^{
        PHAssetCollectionChangeRequest *requtes = [PHAssetCollectionChangeRequest changeRequestForAssetCollection: createCollection];
        placeholder =  [PHAssetChangeRequest creationRequestForAssetFromImageAtFileURL: tempUrl].placeholderForCreatedAsset;
        [requtes addAssets:@[placeholder]];
    } error:&error3];
    if (error3 != nil) {
        NSLog(@"转存失败。。。");
        return NO;
    } else {
        NSLog(@"转存成功！！！");
    }
    
    return YES;
}

+(BOOL)setOrientation:(int)orientation{
    NSLog(@"setOrientation成功%d",orientation);
    //    if(orientation == 3){
    //        return true;
    //    }
    UIDeviceOrientation ooo = [[UIDevice currentDevice]orientation];
    UIInterfaceOrientation ttt = UIInterfaceOrientationUnknown;
    if(ooo == UIDeviceOrientationPortrait && orientation==2){
        return true;
    }
    if( (ooo == UIDeviceOrientationLandscapeRight || ooo==UIDeviceOrientationLandscapeLeft) && orientation==1){
        return true;
    }
    switch (orientation) {
        case 1:
            ooo = UIDeviceOrientationLandscapeRight;
            ttt =UIInterfaceOrientationLandscapeRight;
            break;
        case 2:
            ooo =UIDeviceOrientationPortrait;
            ttt =UIInterfaceOrientationPortrait;
            break;
        case 3:
            break;
        default:
            break;
    }
    if ([[UIDevice currentDevice]   respondsToSelector:@selector(setOrientation:)]) {
        //keyi qipain xitong
        NSNumber *orientationUnknown = [NSNumber numberWithInt:UIDeviceOrientationUnknown];
        [[UIDevice currentDevice] setValue:orientationUnknown forKey:@"orientation"];
        [[UIDevice currentDevice] setValue:[NSNumber numberWithInteger:ooo] forKey:@"orientation"];
    }
    
    return true;
    
    
    //
    //    if ([[UIDevice currentDevice] respondsToSelector:@selector(setOrientation:)]) {
    //        SEL selector = NSSelectorFromString(@"setOrientation:");
    //        NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:[UIDevice
    //                                                                                instanceMethodSignatureForSelector:selector]];
    //        [invocation setSelector:selector];
    //        [invocation setTarget:[UIDevice currentDevice]];
    //        int val = orientation;
    //        [invocation setArgument:&val atIndex:2];
    //        [invocation invoke];
    //    }
    
    
    //    UIInterfaceOrientation orient = [UIApplication sharedApplication].statusBarOrientation;
    //    CGRect frame = [UIScreen mainScreen].applicationFrame;
    //    CGPoint center = CGPointMake(frame.origin.x + ceil(frame.size.width/2),frame.origin.y + ceil(frame.size.height/2));
    //    float rotate = 0;
    //    if (orientation == UIInterfaceOrientationLandscapeLeft) {
    //        CGAffineTransformMakeRotation(M_PI*1.5);
    //        rotate = 90*3;
    //    } else if(orientation == UIInterfaceOrientationLandscapeRight) {
    //        CGAffineTransformMakeRotation(M_PI/2);
    //        rotate = 90;
    //    } else if(orientation == UIInterfaceOrientationPortraitUpsideDown){
    //        CGAffineTransformMakeRotation(-M_PI);
    //        rotate = -90;
    //    } else if(orientation == UIInterfaceOrientationPortrait){
    //        CGAffineTransformMakeRotation(-M_PI/2);
    //        rotate = 0;
    //    } else{
    //        CGAffineTransformIdentity;
    //        rotate = 0;
    //    }
    //    [[UIApplication sharedApplication] setStatusBarOrientation:deviceOrientation animated:YES];
    //    CGFloat duration = [UIApplication sharedApplication].statusBarOrientationAnimationDuration;
    //    [UIView beginAnimations:nil context:nil];
    //    [UIView setAnimationDuration:duration];
    //    [self rotation_btn:rotate];
    //    [UIView commitAnimations];
    
}

+ (PHFetchResult<PHAsset *> *)createdAssets:(NSString *)imgUrl {
    // 同步执行修改操作
    NSError *error = nil;
    __block NSString *assertId = nil;
    NSURL* imgPath = [NSURL fileURLWithPath:imgUrl];
    // 保存图片到【相机胶卷】
    [[PHPhotoLibrary sharedPhotoLibrary]performChangesAndWait:^{
        assertId =  [PHAssetChangeRequest creationRequestForAssetFromImageAtFileURL: imgPath].placeholderForCreatedAsset.localIdentifier;
    } error:&error];
    if (error) {
        NSLog(@"保存失败");
        return nil;
    }
    // 获取相片
    PHFetchResult<PHAsset *> *createdAssets = [PHAsset fetchAssetsWithLocalIdentifiers:@[assertId] options:nil];
    return createdAssets;
}

+ (BOOL)shareWebToWX:(NSString*)url title:(NSString *)title
        description:(NSString*)desc
        imgBase64Data:(NSString*)imgData
        type:(int)type{
    
    WXWebpageObject *webpageObject = [WXWebpageObject object];
    webpageObject.webpageUrl = url;
    
    WXMediaMessage *message = [WXMediaMessage message];
    message.title = title;
    message.description = desc;
    
   NSData img =  NSDataBase64DecodingOptions.imgData;
//    [message setThumbImage:[UIImage imageNamed:imgData]];
    message.thumbData = img;
    
    message.mediaObject = webpageObject;
    SendMessageToWXReq *req = [[SendMessageToWXReq alloc] init];
    req.bText = NO;
    req.message = message;
    //如果可以直接传入 int： tpye 就不需要这个转化
    WXScene sc = WXSceneSession;
    switch (type) {
        case 0:
            sc =WXSceneSession;
            break;
        case 1:
            sc =WXSceneTimeline;
            break;
        case 2:
            sc = WXSceneFavorite;
            break;
        default:
            break;
    }
    req.scene = type;
    [WXApi sendReq:req];
    return true;
};


@end
