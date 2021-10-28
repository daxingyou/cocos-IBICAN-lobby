//
//  NativeUtils.h
//  lobby-mobile
//
//  Created by MacOS on 2019/6/13.
//

#import <Foundation/Foundation.h>
#import <HTTPServer.h>
#import <SSZipArchive.h>
#import <Photos/Photos.h>
#import <AssetsLibrary/AssetsLibrary.h>

NS_ASSUME_NONNULL_BEGIN


@interface NativeUtils : NSObject

+ (void)OCLog: (NSString *)str;
+ (void)unzipFileFromPath: (NSString *)zipPath toDest: (NSString *)destPath;
+ (void)startServerViaRoot: (NSString *)root atPort: (int)port;
+ (NSString *)getDeviceId;
+ (void)saveUUID: (NSString *)uuid;
+ (NSString *)readUUID;
+ (BOOL)appendToClipBoard: (NSString *)string;
+ (BOOL)saveImageToAlbum: (NSString *)temp;
+ (BOOL)setOrientation:(int)orientation;

+ (BOOL)shareWebToWX:(NSString*)url title:(NSString *)title
        description:(NSString*)desc
        imgBase64Data:(NSString*)imgData
        type:(int)type;
@end

NS_ASSUME_NONNULL_END
